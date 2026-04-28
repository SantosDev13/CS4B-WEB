// ============================================
// SERVICES INDEX - CS4B WEB
// ============================================
//
// Punto de entrada para todos los servicios API.
//
// Uso típico:
//   import { serviciosApi, postsApi, contactosApi } from "@/services";

export { apiFetch, type ApiResponse, type PaginatedResponse } from "./api";
export { serviciosApi, type Servicio, type CreateServicioInput, type UpdateServicioInput } from "./serviciosApi";
export { postsApi, type Post, type CreatePostInput, type UpdatePostInput } from "./postsApi";
export { contactosApi, type Contacto, type CreateContactoInput, type UpdateContactoInput } from "./contactosApi";