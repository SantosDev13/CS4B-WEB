// ============================================
// POSTS API - CS4B WEB
// ============================================

import { apiFetch, type ApiResponse } from "./api";

export interface Post {
  id: string;
  titulo: string;
  slug: string;
  contenido: string;
  excerpt?: string;
  imagen_destacada?: string;
  categoria_post_id?: string;
  categoria?: string;
  categoria_slug?: string;
  etiquetas?: string[];
  publicado: boolean;
  fecha_publicacion?: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePostInput {
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

export interface UpdatePostInput extends Partial<CreatePostInput> {}

// --------------------------------------------
// CRUD OPERATIONS
// --------------------------------------------

export const postsApi = {
  /**
   * Obtener todos los posts (público)
   */
  getAll: async (params?: {
    published?: boolean;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<Post[]>> => {
    const query = new URLSearchParams();
    if (params?.published !== undefined) query.set("published", String(params.published));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.page) query.set("page", String(params.page));

    const endpoint = `/api/posts${query.toString() ? `?${query}` : ""}`;
    return apiFetch<Post[]>(endpoint);
  },

  /**
   * Obtener un post por slug
   */
  getBySlug: async (slug: string): Promise<ApiResponse<Post>> => {
    return apiFetch<Post>(`/api/posts/${slug}`);
  },

  /**
   * Crear un nuevo post
   */
  create: async (data: CreatePostInput): Promise<ApiResponse<Post>> => {
    return apiFetch<Post>("/api/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

/**
   * Actualizar un post
   */
  update: async (id: string, data: UpdatePostInput): Promise<ApiResponse<Post>> => {
    return apiFetch<Post>(`/api/posts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Eliminar un post
   */
  delete: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    return apiFetch<{ success: boolean }>(`/api/posts/${id}`, {
      method: "DELETE",
    });
  },
};