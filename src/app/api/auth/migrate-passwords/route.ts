import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, comparePassword } from '@/lib/auth';

/**
 * Endpoint de administración para migrar contraseñas a bcrypt
 * 
 * POST /api/auth/migrate-passwords
 * Body: { action: 'check' | 'migrate', password?: string }
 * 
 * - check: verifica si las contraseñas están hasheadas
 * - migrate: hashea todas las contraseñas en texto plano
 */

// Verificar si un string parece ser un hash bcrypt
function isBcryptHash(str: string): boolean {
  // Los hashes bcrypt tienen formato: $2a$10$... o $2b$10$...
  return /^ \$2[ab]\$\d{2}\$/ .test(str);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'check') {
      // Verificar estado de las contraseñas
      const usuarios = await prisma.usuario.findMany({
        select: { id: true, email: true, nombre: true, password: true },
      });

      const results = usuarios.map(u => ({
        id: u.id,
        email: u.email,
        nombre: u.nombre,
        passwordHashed: isBcryptHash(u.password),
        // Si parece hash, mostrar inicio
        passwordPreview: u.password.substring(0, 10),
      }));

      return NextResponse.json({
        total: usuarios.length,
        hashed: results.filter(r => r.passwordHashed).length,
        plain: results.filter(r => !r.passwordHashed).length,
        users: results,
      });
    }

    if (action === 'migrate') {
      // Migrar todas las contraseñas de texto plano a bcrypt
      const usuarios = await prisma.usuario.findMany({
        select: { id: true, email: true, password: true },
      });

      const results = [];

      for (const usuario of usuarios) {
        // Si ya está hasheada, skip
        if (isBcryptHash(usuario.password)) {
          results.push({ id: usuario.id, email: usuario.email, status: 'already_hashed' });
          continue;
        }

        // Hashear la contraseña
        const hashedPassword = await hashPassword(usuario.password);
        
        // Actualizar en DB
        await prisma.usuario.update({
          where: { id: usuario.id },
          data: { password: hashedPassword },
        });

        results.push({ id: usuario.id, email: usuario.email, status: 'migrated' });
      }

      return NextResponse.json({
        success: true,
        migrated: results.filter(r => r.status === 'migrated').length,
        skipped: results.filter(r => r.status === 'already_hashed').length,
        results,
      });
    }

    return NextResponse.json({ error: 'Acción no válida. Use: check o migrate' }, { status: 400 });

  } catch (error) {
    console.error('Error en migrate-passwords:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}