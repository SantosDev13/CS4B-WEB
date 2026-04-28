// ============================================
// SERVICIOS API - CS4B WEB
// ============================================
//
// Esta carpeta contiene las llamadas a la API del servidor.
//centralizan la lógica de fetching para mejor mantenimiento.
//
// Uso típico:
//   import { serviciosApi } from "@/services/serviciosApi";
//   const servicios = await serviciosApi.getAll();

// --------------------------------------------
// TIPOS COMPARTIDOS
// --------------------------------------------
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --------------------------------------------
// HELPERS
// --------------------------------------------
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }
  return "";
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(endpoint, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Error unknown" }));
      return { error: error.error || "Error en la solicitud" };
    }

    const data = await res.json();
    return { data };
  } catch (err) {
    return { error: "Error de conexión" };
  }
}