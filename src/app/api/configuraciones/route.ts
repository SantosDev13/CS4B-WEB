import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { configuracionSchema } from '@/lib/validations';

// GET - Obtener configuraciones (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clave = searchParams.get('clave');

    if (clave) {
      const config = await prisma.configuracion.findUnique({
        where: { clave },
      });

      if (!config) {
        return NextResponse.json({ error: 'Configuración no encontrada' }, { status: 404 });
      }
      return NextResponse.json(config);
    }

    const configuraciones = await prisma.configuracion.findMany();

    const configObj: Record<string, string> = {};
    configuraciones.forEach(c => {
      configObj[c.clave] = c.valor;
    });

    return NextResponse.json(configObj);
  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear/actualizar configuración (solo admin)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden modificar configuraciones' }, { status: 403 });
    }

    const body = await request.json();

    // Validar con Zod
    const result = configuracionSchema.safeParse(body);

    if (!result.success) {
      const errores = result.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({ error: errores }, { status: 400 });
    }

    const { clave, valor, descripcion } = result.data;

    const config = await prisma.configuracion.upsert({
      where: { clave },
      update: { valor, descripcion },
      create: { clave, valor, descripcion },
    });

    return NextResponse.json({ success: true, data: config }, { status: 201 });
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar configuración (solo admin)
export async function PUT(request: NextRequest) {
  return POST(request);
}

// DELETE - Eliminar configuración (solo admin)
export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden eliminar configuraciones' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const clave = searchParams.get('clave');

    if (!clave) {
      return NextResponse.json({ error: 'Clave es requerida' }, { status: 400 });
    }

    await prisma.configuracion.delete({ where: { clave } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar configuración:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}