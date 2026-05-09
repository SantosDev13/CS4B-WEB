import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { categoriaPostSchema } from '@/lib/validations';

// GET - Obtener categorías de posts (público)
export async function GET() {
  try {
    const [categorias, total] = await Promise.all([
      prisma.categoriaPost.findMany({
        orderBy: { orden: 'asc' },
      }),
      prisma.categoriaPost.count(),
    ]);
    const response = NextResponse.json({ success: true, data: categorias, total });
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
    return response;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear categoría de post (solo admin)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden crear categorías' }, { status: 403 });
    }

    const body = await request.json();

    const result = categoriaPostSchema.safeParse(body);

    if (!result.success) {
      const errores = result.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({ error: errores }, { status: 400 });
    }

    const { nombre, slug, descripcion, color, orden } = result.data;

    const existing = await prisma.categoriaPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'El slug ya está en uso' }, { status: 400 });
    }

    const categoria = await prisma.categoriaPost.create({
      data: {
        nombre,
        slug,
        descripcion,
        color,
        orden: orden || 0,
      },
    });

    return NextResponse.json({ success: true, data: categoria }, { status: 201 });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}