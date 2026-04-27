import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import type { Prisma } from '@prisma/client';

// GET - Obtener servicio por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const servicio = await prisma.servicio.findUnique({
      where: { id },
      include: { categoria: true },
    });

    if (!servicio) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: servicio });
  } catch (error) {
    console.error('Error fetching servicio:', error);
    return NextResponse.json({ error: 'Error al obtener servicio' }, { status: 500 });
  }
}

// PUT - Actualizar servicio (solo admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden actualizar servicios' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const allowedFields = ['titulo', 'slug', 'descripcion', 'descripcion_corta', 'icono', 'imagen', 'categoria_servicio_id', 'tamanho', 'orden', 'visible'];
    const updateData: Prisma.ServicioUpdateInput = {};

    for (const [key, value] of Object.entries(body)) {
      const dbKey = key === 'icon' ? 'icono' : key;
      if (allowedFields.includes(dbKey)) {
        (updateData as Record<string, unknown>)[dbKey] = value;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No hay campos válidos para actualizar' }, { status: 400 });
    }

    const servicio = await prisma.servicio.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: servicio });
  } catch (error) {
    console.error('Error updating servicio:', error);
    return NextResponse.json({ error: 'Error al actualizar servicio' }, { status: 500 });
  }
}

// DELETE - Eliminar servicio (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden eliminar servicios' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.servicio.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting servicio:', error);
    return NextResponse.json({ error: 'Error al eliminar servicio' }, { status: 500 });
  }
}