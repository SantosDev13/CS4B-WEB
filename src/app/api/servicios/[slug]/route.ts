import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET - Obtener servicio por slug (público)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const servicios = await db.servicios.findBySlug(slug);
    const servicio = servicios[0];

    if (!servicio) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(servicio);
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar servicio (solo admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json(
        { error: 'Solo administradores pueden actualizar servicios' },
        { status: 403 }
      );
    }

    const { slug } = await params;
    const servicios = await db.servicios.findBySlug(slug);
    const servicio = servicios[0];

    if (!servicio) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { titulo, descripcion, descripcion_corta, icono, imagen, categoria, orden, visible } = body;

    const updated = await db.servicios.update(servicio.id, {
      titulo: titulo || servicio.titulo,
      descripcion: descripcion || servicio.descripcion,
      descripcion_corta: descripcion_corta !== undefined ? descripcion_corta : servicio.descripcion_corta,
      icono: icono !== undefined ? icono : servicio.icono,
      imagen: imagen !== undefined ? imagen : servicio.imagen,
      categoria: categoria || servicio.categoria,
      orden: orden !== undefined ? orden : servicio.orden,
      visible: visible !== undefined ? visible : servicio.visible,
    });

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar servicio (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json(
        { error: 'Solo administradores pueden eliminar servicios' },
        { status: 403 }
      );
    }

    const { slug } = await params;
    const servicios = await db.servicios.findBySlug(slug);
    const servicio = servicios[0];

    if (!servicio) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    await db.servicios.delete(servicio.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
