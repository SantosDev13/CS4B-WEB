import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'cs4b-secret-key-change-in-production';

export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'editor';
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Obtener token de cookie o header
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
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
