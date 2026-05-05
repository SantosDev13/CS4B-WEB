import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import type { Prisma } from '@prisma/client';

// GET - Obtener producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: { categoria: true },
    });

    if (!producto) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: producto });
  } catch (error) {
    console.error('Error fetching producto:', error);
    return NextResponse.json({ error: 'Error al obtener producto' }, { status: 500 });
  }
}

// PUT - Actualizar producto (solo admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden actualizar productos' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const allowedFields = ['titulo', 'slug', 'descripcion', 'descripcion_corta', 'icono', 'imagen', 'categoria_producto_id', 'tamanho', 'orden', 'visible'];
    const updateData: Prisma.ProductoUpdateInput = {};

    for (const [key, value] of Object.entries(body)) {
      const dbKey = key === 'icon' ? 'icono' : key;
      if (allowedFields.includes(dbKey)) {
        (updateData as Record<string, unknown>)[dbKey] = value;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No hay campos válidos para actualizar' }, { status: 400 });
    }

    const producto = await prisma.producto.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: producto });
  } catch (error) {
    console.error('Error updating producto:', error);
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

// DELETE - Eliminar producto (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden eliminar productos' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.producto.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting producto:', error);
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}