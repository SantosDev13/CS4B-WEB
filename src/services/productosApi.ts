// ============================================
// PRODUCTOS API - CS4B WEB
// ============================================

import { apiFetch, type ApiResponse } from "./api";

export interface Producto {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta?: string;
  icono?: string;
  imagen?: string;
  categoria_producto_id?: string;
  categoria?: string;
  categoria_slug?: string;
  tamanho?: "small" | "medium" | "large";
  orden?: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductoInput {
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta?: string;
  icono?: string;
  imagen?: string;
  categoria_producto_id?: string;
  tamanho?: "small" | "medium" | "large";
  orden?: number;
  visible?: boolean;
}

export interface UpdateProductoInput extends Partial<CreateProductoInput> {}

// --------------------------------------------
// CRUD OPERATIONS
// --------------------------------------------

export const productosApi = {
  /**
   * Obtener todos los productos (público)
   */
  getAll: async (params?: {
    published?: boolean;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<Producto[]>> => {
    const query = new URLSearchParams();
    if (params?.published !== undefined) query.set("published", String(params.published));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.page) query.set("page", String(params.page));

    const endpoint = `/api/productos${query.toString() ? `?${query}` : ""}`;
    return apiFetch<Producto[]>(endpoint);
  },

  /**
   * Obtener un producto por ID
   */
  getById: async (id: string): Promise<ApiResponse<Producto>> => {
    return apiFetch<Producto>(`/api/productos/${id}`);
  },

  /**
   * Obtener un producto por slug
   */
  getBySlug: async (slug: string): Promise<ApiResponse<Producto>> => {
    return apiFetch<Producto>(`/api/productos/${slug}`);
  },

  /**
   * Crear un nuevo producto
   */
  create: async (data: CreateProductoInput): Promise<ApiResponse<Producto>> => {
    return apiFetch<Producto>("/api/productos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Actualizar un producto
   */
  update: async (id: string, data: UpdateProductoInput): Promise<ApiResponse<Producto>> => {
    return apiFetch<Producto>(`/api/productos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Eliminar un producto
   */
  delete: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    return apiFetch<{ success: boolean }>(`/api/productos/${id}`, {
      method: "DELETE",
    });
  },
};