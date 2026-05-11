import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { productoSchema } from '@/lib/validations';
import type { Prisma } from '@prisma/client';

// GET - Obtener productos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') !== 'false';
    const categoria = searchParams.get('categoria');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Prisma.ProductoWhereInput = {};
    if (publishedOnly) where.visible = true;
    if (categoria) where.categoria_producto_id = categoria;

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        include: {
          categoria: { select: { id: true, nombre: true, slug: true } },
        },
        orderBy: { orden: 'asc' },
        skip: offset,
        take: limit,
      }),
      prisma.producto.count({ where }),
    ]);

    // Transformar respuesta para incluir campos calculados
    const productosTransformados = productos.map((p) => ({
      ...p,
      categoria_nombre: p.categoria?.nombre,
      categoria_slug: p.categoria?.slug,
      categoria_producto: p.categoria ? {
        id: p.categoria.id,
        nombre: p.categoria.nombre,
        slug: p.categoria.slug,
      } : null,
    }));

    const response = NextResponse.json({ success: true, data: productosTransformados, total, limit, offset });
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
    return response;
  } catch (error) {
    console.error('Error fetching productos:', error);
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

// POST - Crear producto (solo admin)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores pueden crear productos' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validar con Zod
    const result = productoSchema.safeParse(body);
    
    if (!result.success) {
      const errores = result.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({ error: errores }, { status: 400 });
    }

    const { titulo, slug, descripcion, descripcion_corta, icono, imagen, categoria_producto_id, tamanho, orden, precio, precio_anterior, tipo_moneda, mostrar_precio } = result.data;

    // Verificar slug único
    const existing = await prisma.producto.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Ya existe un producto con ese slug' }, { status: 400 });
    }

    const producto = await prisma.producto.create({
      data: {
        titulo,
        slug,
        descripcion,
        descripcion_corta,
        icono,
        imagen,
        categoria_producto_id: categoria_producto_id || null,
        tamanho: tamanho || 'medium',
        orden: orden || 0,
        // Precio
        precio: precio ?? null,
        precio_anterior: precio_anterior ?? null,
        tipo_moneda: tipo_moneda || 'PEN',
        mostrar_precio: mostrar_precio ?? true,
      },
    });

    return NextResponse.json({ success: true, data: producto }, { status: 201 });
  } catch (error) {
    console.error('Error creating producto:', error);
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}