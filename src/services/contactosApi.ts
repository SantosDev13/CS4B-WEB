// ============================================
// CONTACTOS API - CS4B WEB
// ============================================

import { apiFetch, type ApiResponse } from "./api";

export interface Contacto {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  servicio_interes?: string;
  mensaje: string;
  leido: boolean;
  respondido: boolean;
  respuesta?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactoInput {
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  servicio_interes?: string;
  mensaje: string;
}

export interface UpdateContactoInput {
  leido?: boolean;
  respondido?: boolean;
  respuesta?: string;
}

// --------------------------------------------
// CRUD OPERATIONS
// --------------------------------------------

export const contactosApi = {
  /**
   * Obtener todos los contactos
   */
  getAll: async (): Promise<ApiResponse<Contacto[]>> => {
    return apiFetch<Contacto[]>("/api/contactos");
  },

  /**
   * Crear un nuevo contacto
   */
  create: async (data: CreateContactoInput): Promise<ApiResponse<Contacto>> => {
    return apiFetch<Contacto>("/api/contactos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

/**
   * Actualizar un contacto (marcar como leído, responder)
   */
  update: async (id: string, data: UpdateContactoInput): Promise<ApiResponse<Contacto>> => {
    return apiFetch<Contacto>(`/api/contactos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Eliminar un contacto
   */
  delete: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    return apiFetch<{ success: boolean }>(`/api/contactos/${id}`, {
      method: "DELETE",
    });
  },
};