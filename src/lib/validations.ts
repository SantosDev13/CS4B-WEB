import { z } from 'zod';

// ============================================
// SCHEMAS DE VALIDACIÓN - CS4B WEB
// ============================================

// --------------------------------------------
// AUTH
// --------------------------------------------
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// --------------------------------------------
// CONTACTOS
// --------------------------------------------
export const contactoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  empresa: z.string().optional(),
  servicio_interes: z.string().optional(),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

export const contactoUpdateSchema = z.object({
  leido: z.boolean().optional(),
  respondido: z.boolean().optional(),
  respuesta: z.string().optional(),
});

export type ContactoInput = z.infer<typeof contactoSchema>;
export type ContactoUpdateInput = z.infer<typeof contactoUpdateSchema>;

// --------------------------------------------
 // CATEGORÍAS DE POSTS (Blog)
 // --------------------------------------------
 export const categoriaPostSchema = z.object({
   nombre: z.string().min(2, 'El nombre es requerido'),
   slug: z.string().min(2, 'El slug es requerido').regex(/^[a-z0-9-]+$/, 'El slug debe tener solo letras minúsculas, números y guiones'),
   descripcion: z.string().optional(),
   color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color inválido').optional(),
   orden: z.number().int().optional(),
 });

 export const categoriaPostUpdateSchema = categoriaPostSchema.partial();

 export type CategoriaPostInput = z.infer<typeof categoriaPostSchema>;
 export type CategoriaPostUpdateInput = z.infer<typeof categoriaPostUpdateSchema>;

// --------------------------------------------
 // CATEGORÍAS DE SERVICIOS
 // --------------------------------------------
 export const categoriaServicioSchema = z.object({
   nombre: z.string().min(2, 'El nombre es requerido'),
   slug: z.string().min(2, 'El slug es requerido').regex(/^[a-z0-9-]+$/, 'El slug debe tener solo letras minúsculas, números y guiones'),
   descripcion: z.string().optional(),
   imagen: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
   link: z.string().url('URL inválida').optional().or(z.literal('')),
   orden: z.number().int().optional(),
   visible: z.boolean().optional(),
 });

 export const categoriaServicioUpdateSchema = categoriaServicioSchema.partial();

 export type CategoriaServicioInput = z.infer<typeof categoriaServicioSchema>;
 export type CategoriaServicioUpdateInput = z.infer<typeof categoriaServicioUpdateSchema>;

// --------------------------------------------
// POSTS
// --------------------------------------------
export const postSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres').regex(/^[a-z0-9-]+$/, 'El slug debe tener solo letras minúsculas, números y guiones'),
  contenido: z.string().min(50, 'El contenido debe tener al menos 50 caracteres'),
  excerpt: z.string().max(500, 'El excerpt debe tener máximo 500 caracteres').optional(),
  imagen_destacada: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
  categoria_post_id: z.string().uuid('ID de categoría inválido').optional().or(z.literal('')),
  etiquetas: z.array(z.string()).optional(),
  publicado: z.boolean().optional(),
  fecha_publicacion: z.string().optional(),
  meta_title: z.string().max(200, 'Meta title máximo 200 caracteres').optional(),
  meta_description: z.string().max(300, 'Meta description máximo 300 caracteres').optional(),
});

export const postUpdateSchema = postSchema.partial();

export type PostInput = z.infer<typeof postSchema>;
export type PostUpdateInput = z.infer<typeof postUpdateSchema>;

// --------------------------------------------
// SERVICIOS
// --------------------------------------------
export const servicioSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres').regex(/^[a-z0-9-]+$/, 'El slug debe tener solo letras minúsculas, números y guiones'),
  descripcion: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  descripcion_corta: z.string().max(200, 'Descripción corta máximo 200 caracteres').optional(),
  icono: z.string().optional(),
  imagen: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
  categoria_servicio_id: z.string().uuid('ID de categoría inválido').optional().or(z.literal('')),
  tamanho: z.enum(['small', 'medium', 'large']).optional(),
  orden: z.number().int().optional(),
  visible: z.boolean().optional(),
});

export const servicioUpdateSchema = servicioSchema.partial();

export type ServicioInput = z.infer<typeof servicioSchema>;
export type ServicioUpdateInput = z.infer<typeof servicioUpdateSchema>;

// --------------------------------------------
 // CONFIGURACIONES
 // --------------------------------------------
 export const configuracionSchema = z.object({
   clave: z.string().min(1, 'La clave es requerida'),
   valor: z.string().min(1, 'El valor es requerido'),
   descripcion: z.string().optional(),
 });

 export const configuracionUpdateSchema = configuracionSchema.partial();

 export type ConfiguracionInput = z.infer<typeof configuracionSchema>;
 export type ConfiguracionUpdateInput = z.infer<typeof configuracionUpdateSchema>;

// --------------------------------------------
// SERVICIOS SELECCIONADOS (del carrito)
// --------------------------------------------
export const servicioSeleccionadoSchema = z.object({
  id: z.string().uuid('ID de servicio inválido'),
  titulo: z.string().min(1, 'El título es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  categoria: z.string().optional(),
  categoriaSlug: z.string().optional(),
});

export const serviciosSeleccionadosSchema = z.array(servicioSeleccionadoSchema);

export type ServicioSeleccionado = z.infer<typeof servicioSeleccionadoSchema>;
export type ServiciosSeleccionados = z.infer<typeof serviciosSeleccionadosSchema>;