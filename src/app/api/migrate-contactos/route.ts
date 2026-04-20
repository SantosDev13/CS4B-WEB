import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Ampliar la columna servicio_interes a TEXT para permitir JSON más grande
    await sql`ALTER TABLE contactos ALTER COLUMN servicio_interes TYPE TEXT`;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Migración completada: servicio_interes ahora es TEXT' 
    });
  } catch (error: any) {
    console.error('Error en migración:', error);
    return NextResponse.json(
      { error: error.message || 'Error al ejecutar migración' },
      { status: 500 }
    );
  }
}