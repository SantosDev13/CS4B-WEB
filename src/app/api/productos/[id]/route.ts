import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { productoUpdateSchema } from '@/lib/validations';
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

    // Validar con Zod
    const result = productoUpdateSchema.safeParse(body);

    if (!result.success) {
      const errores = result.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({ error: errores }, { status: 400 });
    }

    const producto = await prisma.producto.update({
      where: { id },
      data: result.data,
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