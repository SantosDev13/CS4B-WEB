import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { postUpdateSchema } from '@/lib/validations';

// GET - Obtener post por slug (público)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        categoriaPost: { select: { id: true, nombre: true, slug: true, color: true } },
        autor: { select: { id: true, nombre: true, avatar: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    // Incrementar vistas
    await prisma.post.update({
      where: { id: post.id },
      data: { vistas: { increment: 1 } },
    });

    return NextResponse.json({
      ...post,
      categoriaPost: post.categoriaPost,
      autor: post.autor,
    });
  } catch (error) {
    console.error('Error al obtener post:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar post (solo admin/editor)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { slug } = await params;
    const post = await prisma.post.findUnique({ where: { slug } });

    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    const body = await request.json();

    // Validar con Zod
    const result = postUpdateSchema.safeParse(body);

    if (!result.success) {
      const errores = result.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({ error: errores }, { status: 400 });
    }

    const updateData: any = { ...result.data };

    // Manejar fecha_publicacion
    if (updateData.fecha_publicacion) {
      updateData.fecha_publicacion = new Date(updateData.fecha_publicacion);
    }

    const updated = await prisma.post.update({
      where: { id: post.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error al actualizar post:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar post (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden eliminar posts' }, { status: 403 });
    }

    const { slug } = await params;
    const post = await prisma.post.findUnique({ where: { slug } });

    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    await prisma.post.delete({ where: { id: post.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}