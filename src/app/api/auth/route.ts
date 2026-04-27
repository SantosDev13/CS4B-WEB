import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { loginSchema } from '@/lib/validations';
import { comparePassword, createToken } from '@/lib/auth';
import { checkAuthRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

// POST - Login
export async function POST(request: NextRequest) {
  try {
    // Verificar rate limit antes de todo
    const { allowed, remaining, resetAt } = await checkAuthRateLimit(request);
    
    if (!allowed) {
      const response = NextResponse.json(
        { error: 'Demasiados intentos. Intenta de nuevo más tarde' },
        { status: 429 }
      );
      // Agregar headers de rate limit
      Object.entries(getRateLimitHeaders(remaining, resetAt)).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    const body = await request.json();
    
    // Validar con Zod
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      const errores = result.error.errors.map(e => e.message).join(', ');
      const response = NextResponse.json({ error: errores }, { status: 400 });
      Object.entries(getRateLimitHeaders(remaining, resetAt)).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    const { email, password } = result.data;

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      const response = NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
      Object.entries(getRateLimitHeaders(remaining, resetAt)).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // Verificar contraseña con bcrypt
    const isValidPassword = await comparePassword(password, usuario.password);
    if (!isValidPassword) {
      const response = NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
      Object.entries(getRateLimitHeaders(remaining, resetAt)).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // Crear JWT token
    const token = createToken({
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
    });

    // Crear respuesta con cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
        avatar: usuario.avatar,
      },
    });

    // Agregar headers de rate limit
    Object.entries(getRateLimitHeaders(remaining, resetAt)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // Configurar cookie con JWT
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: !isDevelopment,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 1, // 1 día
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}