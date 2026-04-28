// ============================================
// CONSTANTS - CS4B WEB
// ============================================
//
// Constantes globales de la aplicación.
// Valores que pueden cambiar entre entornos.
//
// --------------------------------------------
// APP CONFIG
// --------------------------------------------
export const APP = {
  name: "CS4B Digital Business",
  tagline: "Consultoría estratégica para la transformación digital",
  shortName: "CS4B",
} as const;

// --------------------------------------------
// STORAGE KEYS
// --------------------------------------------
export const STORAGE_KEYS = {
  cart: "cs4b_cart",
  auth: "cs4b_auth",
  theme: "cs4b_theme",
} as const;

// --------------------------------------------
// API ENDPOINTS (para referencia)
// --------------------------------------------
export const API_ENDPOINTS = {
  auth: "/api/auth",
  authMe: "/api/auth/me",
  authMigrate: "/api/auth/migrate-passwords",
  servicios: "/api/servicios",
  categoriasServicios: "/api/categorias-servicios",
  posts: "/api/posts",
  categoriasPosts: "/api/categorias_posts",
  contactos: "/api/contactos",
  configuraciones: "/api/configuraciones",
  health: "/api/health",
} as const;

// --------------------------------------------
// REGEX PATTERNS
// --------------------------------------------
export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  slug: /^[a-z0-9-]+$/,
  phone: /^\+?[\d\s-]+$/,
} as const;

// --------------------------------------------
// PAGINATION DEFAULTS
// --------------------------------------------
export const PAGINATION = {
  defaultLimit: 10,
  maxLimit: 100,
  defaultPage: 1,
} as const;

// --------------------------------------------
// ROUTES (para referencia)
// --------------------------------------------
export const ROUTES = {
  home: "/",
  about: "/nosotros",
  services: "/servicios",
  blog: "/blog",
  contact: "/contacto",
  login: "/login",
  admin: "/admin",
} as const;

// --------------------------------------------
// LIMITS
// --------------------------------------------
export const LIMITS = {
  excerpt: 500,
  metaTitle: 200,
  metaDescription: 300,
  shortDescription: 200,
} as const;