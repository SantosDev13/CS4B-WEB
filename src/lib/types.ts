// ============================================
// TIPOS PARA EL PROYECTO CS4B-WEB
// ============================================

// --------------------------------------------
// USUARIO
// --------------------------------------------
export interface UsuarioWithoutPassword {
  id: string;
  email: string;
  nombre: string;
  rol: string;
  avatar: string | null;
}

export interface AuthUserResponse {
  id: string;
  email: string;
  nombre: string;
  rol: string;
  avatar: string | null;
}

// --------------------------------------------
// POST
// --------------------------------------------
export interface CategoriaPostBasic {
  id: string;
  nombre: string;
  slug: string;
  color: string;
}

export interface AutorBasic {
  id: string;
  nombre: string;
  avatar: string | null;
}

export interface PostWithRelations {
  id: string;
  titulo: string;
  slug: string;
  contenido: string;
  excerpt: string | null;
  imagen_destacada: string | null;
  etiquetas: string[];
  vistas: number;
  publicado: boolean;
  fecha_publicacion: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  categoria_post_id: string | null;
  autor_id: string | null;
  categoriaPost: CategoriaPostBasic | null;
  autor: AutorBasic | null;
}

export interface PostCreateInput {
  titulo: string;
  slug: string;
  contenido: string;
  excerpt?: string;
  imagen_destacada?: string;
  categoria_post_id?: string;
  etiquetas?: string[];
  publicado?: boolean;
  fecha_publicacion?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface PostUpdateInput {
  titulo?: string;
  slug?: string;
  contenido?: string;
  excerpt?: string;
  imagen_destacada?: string;
  categoria_post_id?: string;
  etiquetas?: string[];
  publicado?: boolean;
  fecha_publicacion?: string;
  meta_title?: string;
  meta_description?: string;
}

// --------------------------------------------
// PRODUCTO
// --------------------------------------------
export interface CategoriaProductoBasic {
  id: string;
  nombre: string;
  slug: string;
}

export interface ProductoWithRelations {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta: string | null;
  icono: string | null;
  imagen: string | null;
  tamanho: string;
  orden: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
  categoria_producto_id: string | null;
  categoria_nombre?: string;
  categoria_slug?: string;
  categoria: CategoriaProductoBasic | null;
}

export interface ProductoCreateInput {
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta?: string;
  icono?: string;
  imagen?: string;
  categoria_producto_id?: string;
  tamanho?: 'small' | 'medium' | 'large';
  orden?: number;
  visible?: boolean;
}

// --------------------------------------------
// CONTACTO
// --------------------------------------------
export interface ContactoWithRelations {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  empresa: string | null;
  servicio_interes: string | null;
  mensaje: string;
  ip: string | null;
  leido: boolean;
  responded: boolean;
  respuesta: string | null;
  created_at: string;
}

export interface ContactoUpdateInput {
  leido?: boolean;
  respondidio?: boolean;
  respuesta?: string;
}

// --------------------------------------------
// CATEGORÍA PRODUCTO
// --------------------------------------------
export interface Categoria_producto {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
  link: string | null;
  orden: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

// --------------------------------------------
// CATEGORÍA POST
// --------------------------------------------
export interface Categoria_post {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  color: string;
  orden: number;
  created_at: string;
}