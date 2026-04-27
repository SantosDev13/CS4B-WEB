import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Health Check Endpoint
 * GET /api/health
 * 
 * Retorna el estado de la aplicación:
 * - status: "healthy" | "unhealthy"
 * - timestamp: fecha actual
 * - checks: verificación de servicios
 */

export async function GET() {
  const start = Date.now();
  const checks: Record<string, { status: string; message?: string; duration?: number }> = {};
  
  let allHealthy = true;

  // 1. Check Database
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    checks.database = {
      status: 'healthy',
      duration: Date.now() - dbStart,
    };
  } catch (error) {
    checks.database = {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
    allHealthy = false;
  }

  // 2. Check Environment
  const missingEnvVars: string[] = [];
  if (!process.env.DATABASE_URL) missingEnvVars.push('DATABASE_URL');
  if (!process.env.JWT_SECRET) missingEnvVars.push('JWT_SECRET');
  
  checks.environment = {
    status: missingEnvVars.length === 0 ? 'healthy' : 'warning',
    message: missingEnvVars.length > 0 
      ? `Missing: ${missingEnvVars.join(', ')}` 
      : undefined,
  };

  // Response
  const response = {
    status: allHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    responseTime: Date.now() - start,
    checks,
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
  };

  return NextResponse.json(response, {
    status: allHealthy ? 200 : 503,
  });
}