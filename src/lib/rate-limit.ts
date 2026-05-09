import { NextRequest, NextResponse } from 'next/server';

// ============================================
// RATE LIMITING - Simple in-memory implementation
// ============================================
// Nota: En producción, usar Redis o rate-limiting-middleware
// Este implementation es para desarrollo single-instance

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Configuración por defecto - exportada para tests
export const DEFAULT_LIMIT = 5; // 5 intentos
export const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutos

// Almacén en memoria - exportado para tests
export const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Generar ключ para rate limiting
 * Usa IP + endpoint como ключ
 */
export function getRateLimitKey(request: NextRequest, endpoint: string): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    || request.headers.get('x-real-ip') 
    || 'unknown';
  return `${ip}:${endpoint}`;
}

/**
 * Verificar si excedió el límite
 */
export function checkRateLimit(key: string, limit: number = DEFAULT_LIMIT, windowMs: number = DEFAULT_WINDOW_MS): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    // Nuevo window
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    // Límite excedido
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  // Incrementar
  entry.count++;
  rateLimitStore.set(key, entry);
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Middleware para aplicar rate limiting a una route
 */
export function withRateLimit(
  request: NextRequest,
  options: { limit?: number; windowMs?: number } = {}
) {
  const { limit = DEFAULT_LIMIT, windowMs = DEFAULT_WINDOW_MS } = options;
  
  const endpoint = request.nextUrl.pathname;
  const key = getRateLimitKey(request, endpoint);
  const result = checkRateLimit(key, limit, windowMs);

  return { key, ...result };
}

/**
 * Limpiar entradas antigua del store (llamar periódicamente)
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup cada 5 minutos
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}

// ============================================
// API route para rate limiting de /api/auth
// ============================================

export async function checkAuthRateLimit(request: NextRequest): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
}> {
  // Rate limit más estricto para login: 5 intentos cada 15 minutos
  const { allowed, remaining, resetAt } = withRateLimit(request, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  return { allowed, remaining, resetAt };
}

// ============================================
// Rate limiting genérico para endpoints públicos
// ============================================

/**
 * Rate limit para endpoints públicos de escritura
 * 10 peticiones por minuto (más permisivo que auth)
 */
export async function checkApiRateLimit(request: NextRequest): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
}> {
  const { allowed, remaining, resetAt } = withRateLimit(request, {
    limit: 10,
    windowMs: 60 * 1000, // 1 minuto
  });

  return { allowed, remaining, resetAt };
}

export function getRateLimitHeaders(remaining: number, resetAt: number): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(DEFAULT_LIMIT),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': new Date(resetAt).toISOString(),
  };
}