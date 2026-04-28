import { describe, it, expect, beforeEach } from 'vitest';
import { hashPassword, comparePassword, createToken, verifyToken } from '@/lib/auth';

describe('auth', () => {
  const testPassword = 'testPassword123';
  let hashedPassword: string;

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      hashedPassword = await hashPassword(testPassword);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).toMatch(/^\$2[ab]\$\d{2}\$/);
    });

    it('should produce different hashes for same password', async () => {
      const hash1 = await hashPassword(testPassword);
      const hash2 = await hashPassword(testPassword);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const result = await comparePassword(testPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const result = await comparePassword('wrongPassword', hashedPassword);
      expect(result).toBe(false);
    });

    it('should return false for invalid hash', async () => {
      const result = await comparePassword(testPassword, 'invalid-hash');
      expect(result).toBe(false);
    });
  });

  describe('createToken', () => {
    it('should create a JWT token', () => {
      const token = createToken({
        id: 'user-1',
        email: 'test@example.com',
        nombre: 'Test User',
        rol: 'admin',
      });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const token = createToken({
        id: 'user-1',
        email: 'test@example.com',
        nombre: 'Test User',
        rol: 'admin',
      });

      const decoded = verifyToken(token);
      expect(decoded).toBeDefined();
      expect(decoded?.id).toBe('user-1');
      expect(decoded?.email).toBe('test@example.com');
      expect(decoded?.rol).toBe('admin');
    });

    it('should return null for invalid token', () => {
      const decoded = verifyToken('invalid-token');
      expect(decoded).toBeNull();
    });

    it('should return null for tampered token', () => {
      const token = createToken({
        id: 'user-1',
        email: 'test@example.com',
        nombre: 'Test User',
        rol: 'admin',
      });

      const tamperedToken = token.slice(0, -5) + 'xxxxx';
      const decoded = verifyToken(tamperedToken);
      expect(decoded).toBeNull();
    });
  });
});