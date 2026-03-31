import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET - Obtener categoría por ID (público)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categorias = await db.categorias.findById(id);
    const categoria = categorias[0];

    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar categoría (solo admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json(
        { error: 'Solo administradores pueden actualizar categorías' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const categorias = await db.categorias.findById(id);
    const categoria = categorias[0];

    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { nombre, slug, descripcion, color, orden } = body;

    const updated = await db.categorias.update(id, {
      nombre: nombre || categoria.nombre,
      slug: slug || categoria.slug,
      descripcion: descripcion !== undefined ? descripcion : categoria.descripcion,
      color: color || categoria.color,
      orden: orden !== undefined ? orden : categoria.orden,
    });

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar categoría (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json(
        { error: 'Solo administradores pueden eliminar categorías' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const categorias = await db.categorias.findById(id);
    const categoria = categorias[0];

    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    await db.categorias.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
