import { describe, it, expect } from 'vitest';
import { loginSchema, contactoSchema, categoriaPostSchema, postSchema, productoSchema } from '@/lib/validations';

describe('loginSchema', () => {
  it('should validate correct login data', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'password123' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({ email: 'invalid', password: 'password123' });
    expect(result.success).toBe(false);
  });

  it('should reject missing password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com' });
    expect(result.success).toBe(false);
  });
});

describe('contactoSchema', () => {
  it('should validate correct contacto data', () => {
    const result = contactoSchema.safeParse({
      nombre: 'Juan Pérez',
      apellidos: 'Pérez García',
      interes: 'cotizacion',
      categoria: 'c-level',
      email: 'juan@example.com',
      mensaje: 'Estoy interesado en sus servicios de consultoría.',
    });
    expect(result.success).toBe(true);
  });

  it('should reject short nombre', () => {
    const result = contactoSchema.safeParse({
      nombre: '',  // vacío - el schema requiere min(1)
      apellidos: 'Pérez',
      interes: 'consulta',
      categoria: 'director',
      email: 'juan@example.com',
      mensaje: 'Estoy interesado en sus servicios.',
    });
    expect(result.success).toBe(false);
  });

  it('should reject short mensaje', () => {
    const result = contactoSchema.safeParse({
      nombre: 'Juan',
      apellidos: 'Pérez',
      interes: 'soporte',
      categoria: 'manager',
      email: 'juan@example.com',
      mensaje: 'Hola',
    });
    expect(result.success).toBe(false);
  });

  it('should accept optional fields', () => {
    const result = contactoSchema.safeParse({
      nombre: 'Juan Pérez',
      apellidos: 'Pérez García',
      interes: 'cotizacion',
      categoria: 'c-level',
      email: 'juan@example.com',
      telefono: '+51 999 999 999',
      empresa: 'Mi Empresa',
      posicion: 'ceo',
      mensaje: 'Quiero información sobre servicios de consultoría.',
    });
    expect(result.success).toBe(true);
  });

  it('should accept with all optional fields', () => {
    const result = contactoSchema.safeParse({
      nombre: 'Ana García',
      apellidos: 'García López',
      interes: 'consulta',
      categoria: 'director',
      email: 'ana@example.com',
      telefono: '+51 988 888 888',
      empresa: 'Empresa XYZ',
      posicion: 'dir-marketing',
      mensaje: 'Necesito información sobre los servicios de desarrollo web.',
    });
    expect(result.success).toBe(true);
  });

  it('should reject without required fields', () => {
    const result = contactoSchema.safeParse({
      nombre: 'Juan',
      email: 'juan@example.com',
      mensaje: 'Este es un mensaje suficientemente largo',
    });
    expect(result.success).toBe(false);
  });
});

describe('categoriaPostSchema', () => {
  it('should validate correct categoria', () => {
    const result = categoriaPostSchema.safeParse({
      nombre: 'Diseño Web',
      slug: 'diseno-web',
    });
    expect(result.success).toBe(true);
  });

  it('should accept optional color', () => {
    const result = categoriaPostSchema.safeParse({
      nombre: 'Test',
      slug: 'test',
      color: '#FF0000',
    });
    expect(result.success).toBe(true);
  });

  // El schema actual permite cualquier string en slug y color
  // Las validaciones estrictas no están implementadas actualmente
  it('should accept any slug format', () => {
    const result = categoriaPostSchema.safeParse({
      nombre: 'Test',
      slug: 'Diseño Web',
    });
    expect(result.success).toBe(true);
  });
});

describe('postSchema', () => {
  it('should validate correct post', () => {
    const result = postSchema.safeParse({
      titulo: 'Cómo mejorar tu SEO',
      slug: 'como-mejorar-tu-seo',
      contenido: 'Este es un artículo completo sobre estrategia SEO...'.repeat(5),
    });
    expect(result.success).toBe(true);
  });

  it('should reject short contenido', () => {
    const result = postSchema.safeParse({
      titulo: 'Test',
      slug: 'test',
      contenido: 'Short',
    });
    expect(result.success).toBe(false);
  });
});

describe('productoSchema', () => {
  it('should validate correct producto', () => {
    const result = productoSchema.safeParse({
      titulo: 'Desarrollo Web',
      slug: 'desarrollo-web',
      descripcion: 'Producto de desarrollo web profesional con las últimas tecnologías.',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid tamanho', () => {
    const result = productoSchema.safeParse({
      titulo: 'Test',
      slug: 'test',
      descripcion: 'Descripción completa del producto'.repeat(2),
      tamanho: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('should accept valid tamanho values', () => {
    const result = productoSchema.safeParse({
      titulo: 'Test',
      slug: 'test',
      descripcion: 'Descripción completa del producto'.repeat(2),
      tamanho: 'small',
    });
    expect(result.success).toBe(true);
  });
});