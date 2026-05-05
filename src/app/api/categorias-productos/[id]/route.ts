import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { categoriaProductoUpdateSchema } from '@/lib/validations';

// GET - Obtener categoría de producto por ID o slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Buscar por ID o slug
    let categoria = await prisma.categoria_producto.findUnique({ where: { id } });
    if (!categoria) {
      categoria = await prisma.categoria_producto.findUnique({ where: { slug: id } });
    }

    if (!categoria) {
      return NextResponse.json({ error: 'Categoría de producto no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: categoria });
  } catch (error) {
    console.error('Error fetching categoria_producto:', error);
    return NextResponse.json({ error: 'Error al obtener categoría de producto' }, { status: 500 });
  }
}

// PUT - Actualizar categoría de producto (solo admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden actualizar categorías' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validar con Zod
    const result = categoriaProductoUpdateSchema.safeParse(body);

    if (!result.success) {
      const errores = result.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({ error: errores }, { status: 400 });
    }

    const categoria = await prisma.categoria_producto.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({ success: true, data: categoria });
  } catch (error) {
    console.error('Error updating categoria_producto:', error);
    return NextResponse.json({ error: 'Error al actualizar categoría de producto' }, { status: 500 });
  }
}

// DELETE - Eliminar categoría de producto (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden eliminar categorías' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.categoria_producto.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting categoria_producto:', error);
    return NextResponse.json({ error: 'Error al eliminar categoría de producto' }, { status: 500 });
  }
}