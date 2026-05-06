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
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellidos: z.string().min(1, 'Los apellidos son requeridos'),
  interes: z.string().min(1, 'Selecciona tu interés'),
  categoria: z.string().min(1, 'Selecciona una categoría'),
  posicion: z.string().optional(),
  empresa: z.string().optional(),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
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
   nombre: z.string().min(1, 'El nombre es requerido'),
   slug: z.string().min(1, 'El slug es requerido'),
   descripcion: z.string().optional(),
   color: z.string().optional(),
   orden: z.number().int().optional(),
 });

 export const categoriaPostUpdateSchema = categoriaPostSchema.partial();

 export type CategoriaPostInput = z.infer<typeof categoriaPostSchema>;
 export type CategoriaPostUpdateInput = z.infer<typeof categoriaPostUpdateSchema>;

// --------------------------------------------
  // CATEGORÍAS DE PRODUCTOS
  // --------------------------------------------
  export const categoriaProductoSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    slug: z.string().min(1, 'El slug es requerido'),
    descripcion: z.string().optional(),
    imagen: z.string().optional(),
    link: z.string().optional(),
    orden: z.number().int().optional(),
    visible: z.boolean().optional(),
  });

  export const categoriaProductoUpdateSchema = categoriaProductoSchema.partial();

  export type CategoriaProductoInput = z.infer<typeof categoriaProductoSchema>;
  export type CategoriaProductoUpdateInput = z.infer<typeof categoriaProductoUpdateSchema>;

// --------------------------------------------
// POSTS
// --------------------------------------------
export const postSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres').regex(/^[a-z0-9-]+$/, 'El slug debe tener solo letras min��sculas, números y guiones'),
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
// PRODUCTOS
// --------------------------------------------
export const productoSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres').regex(/^[a-z0-9-]+$/, 'El slug debe tener solo letras minúsculas, números y guiones'),
  descripcion: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  descripcion_corta: z.string().max(200, 'Descripción corta máximo 200 caracteres').optional(),
  icono: z.string().optional(),
  imagen: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
  categoria_producto_id: z.string().uuid('ID de categoría inválido').optional().or(z.literal('')),
  tamanho: z.enum(['small', 'medium', 'large']).optional(),
  orden: z.number().int().optional(),
  visible: z.boolean().optional(),
});

export const productoUpdateSchema = productoSchema.partial();

export type ProductoInput = z.infer<typeof productoSchema>;
export type ProductoUpdateInput = z.infer<typeof productoUpdateSchema>;

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
// PRODUCTOS SELECCIONADOS (del carrito)
// --------------------------------------------
export const productoSeleccionadoSchema = z.object({
  id: z.string().uuid('ID de producto inválido'),
  titulo: z.string().min(1, 'El título es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  categoria: z.string().optional(),
  categoriaSlug: z.string().optional(),
});

export const productosSeleccionadosSchema = z.array(productoSeleccionadoSchema);

export type ProductoSeleccionado = z.infer<typeof productoSeleccionadoSchema>;
export type ProductosSeleccionados = z.infer<typeof productosSeleccionadosSchema>;