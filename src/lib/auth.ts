import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está configurado en las variables de entorno. Agrega JWT_SECRET en tu archivo .env');
}

// Type assertion since we throw if not defined
const JWT_SECRET_ASSERTED = JWT_SECRET as string;
const JWT_EXPIRES_IN = '1d';

export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'editor';
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a password against a hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create a JWT token for a user
 */
export function createToken(user: { id: string; email: string; nombre: string; rol: string }): string {
  const payload = {
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    rol: user.rol,
  };
  
  return jwt.sign(payload, JWT_SECRET_ASSERTED, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): { id: string; email: string; nombre: string; rol: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET_ASSERTED) as { id: string; email: string; nombre: string; rol: string };
  } catch {
    return null;
  }
}

/**
 * Get authenticated user from request
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    // Verify JWT token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return null;
    }

    return {
      id: decoded.id,
      email: decoded.email,
      nombre: decoded.nombre,
      rol: decoded.rol as 'admin' | 'editor',
    };
  } catch (error) {
    console.error('Error en getAuthUser:', error);
    return null;
  }
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await getAuthUser(request);
  
  if (!user) {
    throw new Error('No autorizado');
  }
  
  return user;
}