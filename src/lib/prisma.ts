import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Evitar múltiples instancias en desarrollo
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Desconectar PrismaClient
 * Llamar en proceso de shutdown para evitar conexiones huérfanas
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
  globalForPrisma.prisma = undefined;
}

// --------------------------------------------
// Validación de environment variables
// --------------------------------------------
export function validateEnv(): { valid: boolean; missing: string[] } {
  const required = ['DATABASE_URL'];
  const missing: string[] = [];
  
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  
  if (!process.env.JWT_SECRET) {
    missing.push('JWT_SECRET (usando fallback - cambiar en producción!)');
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

// Validar al importar
const envCheck = validateEnv();
if (!envCheck.valid && process.env.NODE_ENV === 'production') {
  console.error('⚠️ Variables de entorno faltantes:', envCheck.missing);
}

export default prisma;