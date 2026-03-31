import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET - Obtener contacto por ID (solo admin/editor)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const contactos = await db.contactos.findById(id);
    const contacto = contactos[0];

    if (!contacto) {
      return NextResponse.json(
        { error: 'Contacto no encontrado' },
        { status: 404 }
      );
    }

    // Marcar como leído si no lo está
    if (!contacto.leido) {
      await db.contactos.markAsRead(id);
    }

    return NextResponse.json(contacto);
  } catch (error) {
    console.error('Error al obtener contacto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Marcar como leído/responder (solo admin/editor)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const contactos = await db.contactos.findById(id);
    const contacto = contactos[0];

    if (!contacto) {
      return NextResponse.json(
        { error: 'Contacto no encontrado' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { leido, respondido, respuesta } = body;

    if (leido !== undefined && leido !== contacto.leido) {
      await db.contactos.markAsRead(id);
    }

    if (respuesta && respondido) {
      await db.contactos.respond(id, respuesta);
    }

    // Obtener contacto actualizado
    const updated = await db.contactos.findById(id);
    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Error al actualizar contacto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: 'Solo administradores pueden eliminar contactos' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const contactos = await db.contactos.findById(id);
    const contacto = contactos[0];

    if (!contacto) {
      return NextResponse.json(
        { error: 'Contacto no encontrado' },
        { status: 404 }
      );
    }

    await db.contactos.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar contacto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
