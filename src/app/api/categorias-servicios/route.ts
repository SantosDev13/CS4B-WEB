import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { categoriaServicioSchema } from '@/lib/validations';

// GET - Obtener categorías de servicios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') !== 'false';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const categorias = await prisma.categoria_servicio.findMany({
      where: publishedOnly ? { visible: true } : undefined,
      orderBy: { orden: 'asc' },
      skip: offset,
      take: limit,
    });

    return NextResponse.json({ success: true, data: categorias });
  } catch (error) {
    console.error('Error fetching categorias_servicios:', error);
    return NextResponse.json({ success: true, data: [], error: 'Error al obtener categorías' }, { status: 200 });
  }
}

// POST - Crear categoría de servicio (solo admin)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden crear categorías' }, { status: 403 });
    }

    const body = await request.json();

    // Validar con Zod
    const result = categoriaServicioSchema.safeParse(body);

    if (!result.success) {
      const errores = result.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({ error: errores }, { status: 400 });
    }

    const { nombre, slug, descripcion, imagen, link, orden, visible } = result.data;

    const existing = await prisma.categoria_servicio.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Ya existe una categoría con ese slug' }, { status: 400 });
    }

    const categoria = await prisma.categoria_servicio.create({
      data: {
        nombre,
        slug,
        descripcion,
        imagen,
        link,
        orden: orden || 0,
        visible: visible ?? true,
      },
    });

    return NextResponse.json({ success: true, data: categoria }, { status: 201 });
  } catch (error) {
    console.error('Error creating categoria_servicio:', error);
    return NextResponse.json({ error: 'Error al crear categoría de servicio' }, { status: 500 });
  }
}