import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { postSchema } from '@/lib/validations';
import { checkApiRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import type { Prisma } from '@prisma/client';

// GET - Obtener posts (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') !== 'false';
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const categoria = searchParams.get('categoria');

    // Construir where con tipos correctos
    const where: Prisma.PostWhereInput = {};
    if (publishedOnly) {
      where.publicado = true;
      where.OR = [
        { fecha_publicacion: { lte: new Date() } },
        { fecha_publicacion: null },
      ];
    }
    if (categoria) {
      where.categoriaPost = { slug: categoria };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          categoriaPost: { select: { id: true, nombre: true, slug: true, color: true } },
          autor: { select: { id: true, nombre: true, avatar: true } },
        },
        orderBy: { fecha_publicacion: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: posts, total, limit, offset });
  } catch (error) {
    console.error('Error al obtener posts:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear post (solo admin/editor)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || (authUser.rol !== 'admin' && authUser.rol !== 'editor')) {
      return NextResponse.json({ error: 'Solo administradores o editores pueden crear posts' }, { status: 403 });
    }

    // Rate limiting para evitar flood de posts
    const { allowed, remaining, resetAt } = await checkApiRateLimit(request);
    if (!allowed) {
      const response = NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde' },
        { status: 429 }
      );
      Object.entries(getRateLimitHeaders(remaining, resetAt)).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    const body = await request.json();
    
    // Validar con Zod
    const result = postSchema.safeParse(body);
    
    if (!result.success) {
      const errores = result.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({ error: errores }, { status: 400 });
    }

    const { titulo, slug, contenido, excerpt, imagen_destacada, categoria_post_id, etiquetas, publicado, fecha_publicacion, meta_title, meta_description } = result.data;

    // Verificar que el slug sea único
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'El slug ya está en uso' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        titulo,
        slug,
        contenido,
        excerpt,
        imagen_destacada,
        categoria_post_id: categoria_post_id || null,
        autor_id: authUser.id,
        etiquetas: etiquetas || [],
        publicado: publicado || false,
        fecha_publicacion: publicado ? (fecha_publicacion ? new Date(fecha_publicacion) : new Date()) : null,
        meta_title,
        meta_description,
      },
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error('Error al crear post:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}