import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

import sql from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Obtener servicios con su categoría padre
    let query;
    if (published !== 'false') {
      query = sql`
        SELECT s.*, cs.nombre as categoria_nombre, cs.slug as categoria_slug 
        FROM servicios s 
        LEFT JOIN categorias_servicios cs ON s.categoria_servicio_id = cs.id 
        WHERE s.visible = true 
        ORDER BY s.orden ASC 
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      query = sql`
        SELECT s.*, cs.nombre as categoria_nombre, cs.slug as categoria_slug 
        FROM servicios s 
        LEFT JOIN categorias_servicios cs ON s.categoria_servicio_id = cs.id 
        ORDER BY s.orden ASC 
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const servicios = await query;

    // Transformar resultados para agregar la categoría como objeto
    const serviciosWithCategoria = servicios.map((s: any) => ({
      ...s,
      categoria_servicio: s.categoria_servicio_id ? {
        id: s.categoria_servicio_id,
        nombre: s.categoria_nombre,
        slug: s.categoria_slug
      } : null
    }));

    return NextResponse.json({ servicios: serviciosWithCategoria });
  } catch (error) {
    console.error('Error fetching servicios:', error);
    return NextResponse.json(
      { error: 'Error al obtener servicios' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, slug, descripcion, icono, imagen, categoria, categoria_servicio_id, tamanho, orden } = body as any;

    if (!titulo || !slug || !descripcion) {
      return NextResponse.json(
        { error: 'Título, slug y descripción son requeridos' },
        { status: 400 }
      );
    }

    const existingSlug = await db.servicios.findBySlug(slug);
    if (existingSlug.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe un servicio con ese slug' },
        { status: 400 }
      );
    }

    const servicio = await db.servicios.create({
      titulo,
      slug,
      descripcion,
      icono,
      imagen,
      categoria_servicio_id,
      tamanho: (tamanho as string) || 'medium',
      orden: (orden as number) || 0,
    });

    return NextResponse.json({ servicio: servicio[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating servicio:', error);
    return NextResponse.json(
      { error: 'Error al crear servicio' },
      { status: 500 }
    );
  }
}