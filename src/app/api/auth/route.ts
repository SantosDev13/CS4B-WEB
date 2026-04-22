import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { loginSchema } from '@/lib/validations';

// POST - Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar con Zod
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      const errores = result.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({ error: errores }, { status: 400 });
    }

    const { email, password } = result.data;

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Verificar contraseña (sin hash - comparación directa)
    if (password !== usuario.password) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Crear cookie simple con userId:yrol (base64 encoded)
    const sessionData = Buffer.from(`${usuario.id}:${usuario.rol}`).toString('base64');

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

    // Configurar cookie (30 días)
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    response.cookies.set('auth-token', sessionData, {
      httpOnly: true,
      secure: !isDevelopment,
      sameSite: 'lax',
      maxAge: isDevelopment ? undefined : 60 * 60 * 24 * 30,
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