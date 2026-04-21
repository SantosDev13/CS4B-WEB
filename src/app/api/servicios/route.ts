import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { servicioSchema } from '@/lib/validations';

// GET - Obtener servicios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') !== 'false';
    const categoria = searchParams.get('categoria');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    if (publishedOnly) where.visible = true;
    if (categoria) where.categoria_servicio_id = categoria;

    const servicios = await prisma.servicio.findMany({
      where,
      include: {
        categoria: { select: { id: true, nombre: true, slug: true } },
      },
      orderBy: { orden: 'asc' },
      skip: offset,
      take: limit,
    });

    const serviciosTransformados = servicios.map((s: any) => ({
      ...s,
      categoria_nombre: s.categoria?.nombre,
      categoria_slug: s.categoria?.slug,
      categoria_servicio: s.categoria ? {
        id: s.categoria.id,
        nombre: s.categoria.nombre,
        slug: s.categoria.slug,
      } : null,
    }));

    return NextResponse.json({ success: true, data: serviciosTransformados });
  } catch (error) {
    console.error('Error fetching servicios:', error);
    return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 });
  }
}

// POST - Crear servicio (solo admin)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden crear servicios' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validar con Zod
    const result = servicioSchema.safeParse(body);
    
    if (!result.success) {
      const errores = result.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({ error: errores }, { status: 400 });
    }

    const { titulo, slug, descripcion, descripcion_corta, icono, imagen, categoria_servicio_id, tamanho, orden } = result.data;

    // Verificar slug único
    const existing = await prisma.servicio.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Ya existe un servicio con ese slug' }, { status: 400 });
    }

    const servicio = await prisma.servicio.create({
      data: {
        titulo,
        slug,
        descripcion,
        descripcion_corta,
        icono,
        imagen,
        categoria_servicio_id: categoria_servicio_id || null,
        tamanho: tamanho || 'medium',
        orden: orden || 0,
      },
    });

    return NextResponse.json({ success: true, data: servicio }, { status: 201 });
  } catch (error) {
    console.error('Error creating servicio:', error);
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 });
  }
}