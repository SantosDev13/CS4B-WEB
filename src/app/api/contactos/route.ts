import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET - Obtener contactos (solo admin/editor)
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'todos';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let contactos;
    
    // Si hay búsqueda o filtro, usar búsqueda en BD
    if (search || status !== 'todos') {
      contactos = await db.contactos.search(search, status, limit, offset);
    } else {
      contactos = await db.contactos.findAll(limit, offset);
    }

    const totalNoLeidos = await db.contactos.countUnread();
    const total = await db.contactos.countAll();
    const totalRespondidos = await db.contactos.countResponded();

    return NextResponse.json({
      contactos,
      totalNoLeidos,
      total,
      totalRespondidos,
    });
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear contacto (público - formulario de contacto)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, empresa, servicio_interes, mensaje, servicios_seleccionados } = body;

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: 'Nombre, email y mensaje son requeridos' },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Obtener IP del cliente
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               '0.0.0.0';

    // Procesar servicios seleccionados - convertir a string JSON si existe
    let servicioInteres = servicio_interes;
    
    if (servicios_seleccionados && Array.isArray(servicios_seleccionados) && servicios_seleccionados.length > 0) {
      // Guardar como JSON: [{ id, titulo, categoria }, ...]
      servicioInteres = JSON.stringify(servicios_seleccionados);
    }

    const contacto = await db.contactos.create({
      nombre,
      email,
      telefono,
      empresa,
      servicio_interes: servicioInteres,
      mensaje,
      ip,
    });

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado correctamente',
      contacto: contacto[0]
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear contacto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
