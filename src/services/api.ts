// ============================================
// SERVICES API - CS4B WEB
// ============================================
//
// Esta carpeta contiene las llamadas a la API del servidor.
// Centralizan la lógica de fetching para mejor mantenimiento.
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
// FETCH HELPER
// --------------------------------------------

/**
 * Realiza una petición HTTP a la API del servidor.
 * Incluye credenciales automáticamente y parsea JSON.
 * 
 * @param endpoint - Ruta del API (ej: "/api/productos")
 * @param options - Opciones adicionales de fetch (method, body, headers, etc.)
 * @returns Promise<ApiResponse<T>> - Respuesta tipada o error
 * 
 * @example
 * ```ts
 * const { data, error } = await apiFetch<Producto[]>('/api/productos');
 * if (error) console.error(error);
 * else console.log(data);
 * ```
 */
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
      const error = await res.json().catch(() => ({ error: "Error desconocido" }));
      return { error: error.error || "Error en la solicitud" };
    }

    const data = await res.json();
    return { data };
  } catch (err) {
    console.error(`[apiFetch] Error en ${endpoint}:`, err);
    return { error: "Error de conexión" };
  }
}