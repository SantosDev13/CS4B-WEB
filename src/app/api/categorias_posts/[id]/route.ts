import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { categoriaPostUpdateSchema } from '@/lib/validations';

// GET - Obtener categoría de post por ID (público)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoria = await prisma.categoriaPost.findUnique({ where: { id } });

    if (!categoria) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: categoria });
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar categoría de post (solo admin)
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

    const result = categoriaPostUpdateSchema.safeParse(body);

    if (!result.success) {
      const errores = result.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({ error: errores }, { status: 400 });
    }

    const updated = await prisma.categoriaPost.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar categoría de post (solo admin)
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
    await prisma.categoriaPost.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}