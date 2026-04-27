import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { contactoSchema, serviciosSeleccionadosSchema } from '@/lib/validations';
import type { Prisma } from '@prisma/client';

// GET - Obtener contactos (solo admin/editor)
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'todos';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Construir filtros con tipos correctos
    const where: Prisma.ContactoWhereInput = {};
    
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { empresa: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status === 'no_leidos') where.leido = false;
    else if (status === 'leidos') where.leido = true;
    else if (status === 'respondidos') where.respondido = true;
    else if (status === 'pendientes') where.respondido = false;

    const [contactos, totalNoLeidos, total, totalRespondidos] = await Promise.all([
      prisma.contacto.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.contacto.count({ where: { leido: false } }),
      prisma.contacto.count(),
      prisma.contacto.count({ where: { respondido: true } }),
    ]);

    return NextResponse.json({
      contactos,
      totalNoLeidos,
      total,
      totalRespondidos,
    });
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear contacto (público - formulario de contacto)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar con Zod - extraer solo los campos del schema
    const result = contactoSchema.safeParse(body);
    
    if (!result.success) {
      const errores = result.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({ error: errores }, { status: 400 });
    }

    const { nombre, email, telefono, empresa, servicio_interes, mensaje } = result.data;
    
    // Validar servicios seleccionados si existen
    let servicioInteres = servicio_interes;
    if (body.servicios_seleccionados && Array.isArray(body.servicios_seleccionados) && body.servicios_seleccionados.length > 0) {
      const serviciosResult = serviciosSeleccionadosSchema.safeParse(body.servicios_seleccionados);
      if (serviciosResult.success) {
        servicioInteres = JSON.stringify(body.servicios_seleccionados);
      }
    }

    // Obtener IP del cliente
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               '0.0.0.0';

    const contacto = await prisma.contacto.create({
      data: {
        nombre,
        email,
        telefono,
        empresa,
        servicio_interes: servicioInteres,
        mensaje,
        ip,
      },
    });

    return NextResponse.json({ success: true, message: 'Mensaje enviado correctamente', contacto }, { status: 201 });
  } catch (error) {
    console.error('Error al crear contacto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}