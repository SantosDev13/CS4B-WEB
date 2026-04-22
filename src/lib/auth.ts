import { NextRequest } from 'next/server';

export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'editor';
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Obtener token de cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    // Decodificar token (formato: base64("id:rol"))
    let sessionData: string;
    try {
      sessionData = Buffer.from(token, 'base64').toString('utf-8');
    } catch {
      return null;
    }

    const [userId, rol] = sessionData.split(':');

    if (!userId || !rol) {
      return null;
    }

    // Retornar usuario directamente desde el token
    // No necesitamos consultar DB para validar
    return {
      id: userId,
      email: '',
      nombre: '',
      rol: rol as 'admin' | 'editor',
    };
  } catch (error) {
    console.error('Error en getAuthUser:', error);
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await getAuthUser(request);
  
  if (!user) {
    throw new Error('No autorizado');
  }
  
  return user;
}