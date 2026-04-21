import { describe, it, expect } from 'vitest';
import { cn, truncate, slugify, isValidEmail, formatPhone, generateId } from '@/lib/utils';

describe('cn', () => {
  it('should merge class names', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    const result = cn('foo', false && 'bar', 'baz');
    expect(result).toBe('foo baz');
  });
});

describe('truncate', () => {
  it('should not truncate short text', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('should truncate long text with ellipsis', () => {
    expect(truncate('hello world', 5)).toBe('he...');
  });
});

describe('slugify', () => {
  it('should convert to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should remove special characters', () => {
    expect(slugify('Hola Mundo!')).toBe('hola-mundo');
  });

  it('should remove accents', () => {
    expect(slugify('España')).toBe('espana');
  });
});

describe('isValidEmail', () => {
  it('should validate correct emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.org')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('no@domain')).toBe(false);
  });
});

describe('formatPhone', () => {
  it('should format Peru numbers', () => {
    expect(formatPhone('51999999999')).toBe('+51 999 999 999');
  });

  it('should keep other formats', () => {
    expect(formatPhone('1234567')).toBe('1234567');
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should return non-empty string', () => {
    expect(generateId().length).toBeGreaterThan(0);
  });
});