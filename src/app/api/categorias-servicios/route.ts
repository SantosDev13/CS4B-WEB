import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const categorias = await db.categorias_servicios.findAll(published !== 'false', limit, offset);

    return NextResponse.json({ success: true, data: categorias || [] });
  } catch (error) {
    console.error('Error fetching categorias_servicios:', error);
    return NextResponse.json(
      { categorias: [], error: 'Base de datos no disponible. Ejecuta /api/init-db' },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, slug, descripcion, imagen, link, orden } = body;

    if (!nombre || !slug) {
      return NextResponse.json(
        { error: 'Nombre y slug son requeridos' },
        { status: 400 }
      );
    }

    const existingSlug = await db.categorias_servicios.findBySlug(slug);
    if (existingSlug.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese slug' },
        { status: 400 }
      );
    }

    const categoria = await db.categorias_servicios.create({
      nombre,
      slug,
      descripcion,
      imagen,
      link,
      orden: orden || 0,
    });

    return NextResponse.json({ categoria: categoria[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating categoria_servicio:', error);
    return NextResponse.json(
      { error: 'Error al crear categoría de servicio' },
      { status: 500 }
    );
  }
}