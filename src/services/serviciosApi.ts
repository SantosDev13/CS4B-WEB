// ============================================
// SERVICIOS API - CS4B WEB
// ============================================

import { apiFetch, type ApiResponse } from "./api";

export interface Servicio {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta?: string;
  icono?: string;
  imagen?: string;
  categoria_servicio_id?: string;
  categoria?: string;
  categoria_slug?: string;
  tamanho?: "small" | "medium" | "large";
  orden?: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateServicioInput {
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta?: string;
  icono?: string;
  imagen?: string;
  categoria_servicio_id?: string;
  tamanho?: "small" | "medium" | "large";
  orden?: number;
  visible?: boolean;
}

export interface UpdateServicioInput extends Partial<CreateServicioInput> {}

// --------------------------------------------
// CRUD OPERATIONS
// --------------------------------------------

export const serviciosApi = {
  /**
   * Obtener todos los servicios (público)
   */
  getAll: async (params?: {
    published?: boolean;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<Servicio[]>> => {
    const query = new URLSearchParams();
    if (params?.published !== undefined) query.set("published", String(params.published));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.page) query.set("page", String(params.page));

    const endpoint = `/api/servicios${query.toString() ? `?${query}` : ""}`;
    return apiFetch<Servicio[]>(endpoint);
  },

  /**
   * Obtener un servicio por ID
   */
  getById: async (id: string): Promise<ApiResponse<Servicio>> => {
    return apiFetch<Servicio>(`/api/servicios/${id}`);
  },

  /**
   * Obtener un servicio por slug
   */
  getBySlug: async (slug: string): Promise<ApiResponse<Servicio>> => {
    return apiFetch<Servicio>(`/api/servicios/${slug}`);
  },

  /**
   * Crear un nuevo servicio
   */
  create: async (data: CreateServicioInput): Promise<ApiResponse<Servicio>> => {
    return apiFetch<Servicio>("/api/servicios", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Actualizar un servicio
   */
  update: async (id: string, data: UpdateServicioInput): Promise<ApiResponse<Servicio>> => {
    return apiFetch<Servicio>(`/api/servicios/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Eliminar un servicio
   */
  delete: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    return apiFetch<{ success: boolean }>(`/api/servicios/${id}`, {
      method: "DELETE",
    });
  },
};