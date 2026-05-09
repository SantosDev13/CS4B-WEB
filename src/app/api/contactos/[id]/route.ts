import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

// GET - Obtener contacto por ID (solo admin/editor)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || (authUser.rol !== 'admin' && authUser.rol !== 'editor')) {
      return NextResponse.json({ error: 'Solo administradores o editores pueden ver contactos' }, { status: 403 });
    }

    const { id } = await params;
    const contacto = await prisma.contacto.findUnique({ where: { id } });

    if (!contacto) {
      return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 });
    }

    // Marcar como leído si no lo está
    if (!contacto.leido) {
      await prisma.contacto.update({ where: { id }, data: { leido: true } });
    }

    return NextResponse.json({ success: true, data: contacto });
  } catch (error) {
    console.error('Error al obtener contacto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Marcar como leído/responder (solo admin/editor)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || (authUser.rol !== 'admin' && authUser.rol !== 'editor')) {
      return NextResponse.json({ error: 'Solo administradores o editores pueden actualizar contactos' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { leido, respondido, respuesta } = body;

    const updateData: any = {};
    if (leido !== undefined) updateData.leido = leido;
    if (respondido !== undefined) updateData.respondido = respondido;
    if (respuesta) updateData.respuesta = respuesta;

    const updated = await prisma.contacto.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error al actualizar contacto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar contacto (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden eliminar contactos' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.contacto.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar contacto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}