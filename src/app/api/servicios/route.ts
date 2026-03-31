import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET - Obtener servicios (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visible = searchParams.get('visible') !== 'false';
    const categoria = searchParams.get('categoria');

    let servicios;

    if (categoria) {
      servicios = await db.servicios.findByCategoria(categoria);
    } else {
      servicios = await db.servicios.findAll(visible);
    }

    return NextResponse.json(servicios);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear servicio (solo admin)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json(
        { error: 'Solo administradores pueden crear servicios' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { titulo, slug, descripcion, descripcion_corta, icono, imagen, categoria, orden, visible } = body;

    if (!titulo || !slug || !descripcion || !categoria) {
      return NextResponse.json(
        { error: 'Título, slug, descripción y categoría son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el slug sea único
    const existing = await db.servicios.findBySlug(slug);
    if (existing[0]) {
      return NextResponse.json(
        { error: 'El slug ya está en uso' },
        { status: 400 }
      );
    }

    const servicio = await db.servicios.create({
      titulo,
      slug,
      descripcion,
      descripcion_corta: descripcion_corta || null,
      icono: icono || null,
      imagen: imagen || null,
      categoria,
      orden: orden || 0,
      visible: visible !== false,
    });

    return NextResponse.json(servicio[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
