import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    let categoria;
    const existingById = await db.categorias_servicios.findById(id);
    if (existingById.length > 0) {
      categoria = existingById[0];
    } else {
      const existingBySlug = await db.categorias_servicios.findBySlug(id);
      if (existingBySlug.length > 0) {
        categoria = existingBySlug[0];
      }
    }
    
    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoría de servicio no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ categoria });
  } catch (error) {
    console.error('Error fetching categoria_servicio:', error);
    return NextResponse.json(
      { error: 'Error al obtener categoría de servicio' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.categorias_servicios.findById(id);
    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Categoría de servicio no encontrada' },
        { status: 404 }
      );
    }

    const allowedFields = ['nombre', 'slug', 'descripcion', 'imagen', 'link', 'orden', 'visible'];
    const updateData: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.includes(key)) {
        updateData[key] = value;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No hay campos válidos para actualizar' },
        { status: 400 }
      );
    }

    const categoria = await db.categorias_servicios.update(id, updateData);

    return NextResponse.json({ categoria: categoria[0] });
  } catch (error) {
    console.error('Error updating categoria_servicio:', error);
    return NextResponse.json(
      { error: 'Error al actualizar categoría de servicio' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.categorias_servicios.findById(id);
    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Categoría de servicio no encontrada' },
        { status: 404 }
      );
    }

    await db.categorias_servicios.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting categoria_servicio:', error);
    return NextResponse.json(
      { error: 'Error al eliminar categoría de servicio' },
      { status: 500 }
    );
  }
}