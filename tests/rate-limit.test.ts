import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  checkRateLimit, 
  getRateLimitKey, 
  cleanupRateLimitStore,
  DEFAULT_LIMIT,
  DEFAULT_WINDOW_MS,
  rateLimitStore,
} from '@/lib/rate-limit';

// Mock NextRequest
const createMockRequest = (pathname: string, ip?: string) => {
  return {
    headers: new Map([
      ['x-forwarded-for', ip || '127.0.0.1'],
    ]),
    nextUrl: {
      pathname,
    },
  } as any;
};

describe('rate-limit', () => {
  beforeEach(() => {
    // Limpiar el store antes de cada test
    rateLimitStore.clear();
  });

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const result = checkRateLimit('test-key');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(DEFAULT_LIMIT - 1);
    });

    it('should track request count', () => {
      checkRateLimit('test-key');
      const result = checkRateLimit('test-key');
      // After 2 requests, remaining = limit - 2 = 5 - 2 = 3
      expect(result.remaining).toBe(DEFAULT_LIMIT - 2);
    });

    it('should block after limit exceeded', () => {
      for (let i = 0; i < DEFAULT_LIMIT; i++) {
        checkRateLimit('test-key');
      }
      
      const result = checkRateLimit('test-key');
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should allow different keys independently', () => {
      for (let i = 0; i < DEFAULT_LIMIT; i++) {
        checkRateLimit('key-1');
      }
      
      const key1Blocked = checkRateLimit('key-1');
      const key2Allowed = checkRateLimit('key-2');
      
      expect(key1Blocked.allowed).toBe(false);
      expect(key2Allowed.allowed).toBe(true);
    });

    it('should respect custom limit', () => {
      const result = checkRateLimit('test-key', 3);
      // Custom limit of 3 means remaining starts at 2
      expect(result.remaining).toBe(2);
    });
  });

  describe('getRateLimitKey', () => {
    it('should combine IP and pathname', () => {
      const request = createMockRequest('/api/test', '192.168.1.1');
      const key = getRateLimitKey(request, '/api/test');
      expect(key).toBe('192.168.1.1:/api/test');
    });

    it('should use default IP if not provided', () => {
      const request = createMockRequest('/api/test');
      const key = getRateLimitKey(request, '/api/test');
      expect(key).toContain(':/api/test');
    });
  });

  describe('cleanupRateLimitStore', () => {
    it('should remove expired entries', () => {
      // Agregar una entrada que ya expiró
      rateLimitStore.set('expired-key', {
        count: 1,
        resetAt: Date.now() - 1000,
      });
      
      cleanupRateLimitStore();
      
      // La entrada debería estar eliminada
      expect(rateLimitStore.size).toBe(0);
    });
  });
});