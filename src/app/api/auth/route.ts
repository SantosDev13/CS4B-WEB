import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { loginSchema } from '@/lib/validations';

const JWT_SECRET = process.env.JWT_SECRET || 'cs4b-secret-key-change-in-production';

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

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Actualizar último login
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimo_login: new Date() },
    });

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        nombre: usuario.nombre,
        rol: usuario.rol 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

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
      token
    });

    // Configurar cookie
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: !isDevelopment,
      sameSite: 'lax',
      maxAge: isDevelopment ? undefined : 60 * 60 * 24 * 7,
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