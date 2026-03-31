import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET - Obtener configuraciones (público - solo algunas)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clave = searchParams.get('clave');

    if (clave) {
      // Obtener una configuración específica
      const configs = await db.configuraciones.findByClave(clave);
      if (!configs[0]) {
        return NextResponse.json(
          { error: 'Configuración no encontrada' },
          { status: 404 }
        );
      }
      return NextResponse.json(configs[0]);
    }

    // Obtener todas las configuraciones
    const configuraciones = await db.configuraciones.findAll();
    
    // Convertir a objeto clave-valor para facilitar uso
    const configObj: Record<string, string> = {};
    configuraciones.forEach(c => {
      configObj[c.clave] = c.valor;
    });

    return NextResponse.json(configObj);
  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear/actualizar configuración (solo admin)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json(
        { error: 'Solo administradores pueden modificar configuraciones' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { clave, valor, descripcion } = body;

    if (!clave || valor === undefined) {
      return NextResponse.json(
        { error: 'Clave y valor son requeridos' },
        { status: 400 }
      );
    }

    const config = await db.configuraciones.upsert(clave, String(valor), descripcion);

    return NextResponse.json(config[0], { status: 201 });
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar configuración (solo admin)
export async function PUT(request: NextRequest) {
  // Igual que POST
  return POST(request);
}

// DELETE - Eliminar configuración (solo admin)
export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json(
        { error: 'Solo administradores pueden eliminar configuraciones' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const clave = searchParams.get('clave');

    if (!clave) {
      return NextResponse.json(
        { error: 'Clave es requerida' },
        { status: 400 }
      );
    }

    await db.configuraciones.delete(clave);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar configuración:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
