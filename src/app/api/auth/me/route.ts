import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET - Obtener usuario actual (requiere cookie de auth con JWT válido)
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Verificar JWT token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      // Token inválido o expirado - limpiar cookie
      const response = NextResponse.json(
        { error: "Sesión expirada" },
        { status: 401 }
      );
      response.cookies.set('auth-token', '', { maxAge: 0, path: '/' });
      return response;
    }

    // Buscar usuario en DB para obtener datos actualizados
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
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