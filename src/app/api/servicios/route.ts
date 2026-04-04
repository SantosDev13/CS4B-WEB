import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET - Obtener servicios (público)
export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/servicios - Iniciando...");
    
    const { searchParams } = new URL(request.url);
    const visible = searchParams.get('visible') !== 'false';
    const categoria = searchParams.get('categoria');

    console.log("Params:", { visible, categoria });

    let servicios;

    if (categoria) {
      servicios = await db.servicios.findByCategoria(categoria);
    } else {
      servicios = await db.servicios.findAll(visible);
    }

    console.log("Servicios encontrados:", servicios.length);
    return NextResponse.json(servicios);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST - Crear servicio (solo admin)
export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/servicios - Iniciando...");
    
    const authUser = await getAuthUser(request);
    console.log("Auth user:", authUser);
    
    if (!authUser || authUser.rol !== 'admin') {
      console.log("No autorizado");
      return NextResponse.json(
        { error: 'Solo administradores pueden crear servicios' },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log("Body recibido:", JSON.stringify(body, null, 2));

    const { titulo, slug, descripcion, descripcion_corta, icono, imagen, categoria, orden, visible } = body;

    if (!titulo || !slug || !descripcion || !categoria) {
      return NextResponse.json(
        { error: 'Título, slug, descripción y categoría son requeridos' },
        { status: 400 }
      );
    }

    // Validar longitud de campos
    if (slug.length > 50) {
      return NextResponse.json(
        { error: 'El slug debe tener máximo 50 caracteres' },
        { status: 400 }
      );
    }

    if (categoria.length > 50) {
      return NextResponse.json(
        { error: 'La categoría debe tener máximo 50 caracteres' },
        { status: 400 }
      );
    }

    console.log("Validaciones pasadas, buscando slug existente...");

    // Verificar que el slug sea único
    const existing = await db.servicios.findBySlug(slug);
    if (existing[0]) {
      return NextResponse.json(
        { error: 'El slug ya está en uso' },
        { status: 400 }
      );
    }

    console.log("Creando servicio...");
    const servicio = await db.servicios.create({
      titulo,
      slug,
      descripcion,
      descripcion_corta: descripcion_corta || null,
      icono: icono || null,
      imagen: imagen || null,
      categoria,
      orden: orden || 0,
      visible: visible !== false,
    });

    console.log("Servicio creado:", servicio[0]?.id);
    return NextResponse.json(servicio[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: (error as Error).message },
      { status: 500 }
    );
  }
}
