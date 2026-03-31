import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET - Obtener categorías (público)
export async function GET() {
  try {
    const categorias = await db.categorias.findAll();
    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear categoría (solo admin)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.rol !== 'admin') {
      return NextResponse.json(
        { error: 'Solo administradores pueden crear categorías' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { nombre, slug, descripcion, color, orden } = body;

    if (!nombre || !slug) {
      return NextResponse.json(
        { error: 'Nombre y slug son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el slug sea único
    const existing = await db.categorias.findBySlug(slug);
    if (existing[0]) {
      return NextResponse.json(
        { error: 'El slug ya está en uso' },
        { status: 400 }
      );
    }

    const categoria = await db.categorias.create({
      nombre,
      slug,
      descripcion,
      color,
      orden,
    });

    return NextResponse.json(categoria[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
