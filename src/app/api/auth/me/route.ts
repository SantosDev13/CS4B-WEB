import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Obtener usuario actual (requiere cookie de auth)
export async function GET(request: NextRequest) {
  try {
    // Obtener el token (contiene el userId en base64)
    const sessionData = request.cookies.get('auth-token')?.value;

    if (!sessionData) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Decodificar el userId del base64
    let userId: string;
    try {
      userId = Buffer.from(sessionData, 'base64').toString('utf-8');
    } catch {
      return NextResponse.json(
        { error: "Sesión inválida" },
        { status: 401 }
      );
    }

    // Buscar usuario por ID
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true,
        avatar: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: usuario });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}