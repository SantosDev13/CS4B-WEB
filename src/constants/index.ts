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

// --------------------------------------------
// CONTACTO FORM - Opciones del formulario
// --------------------------------------------
export const CONTACTO_INTERES_OPTIONS = [
  { id: "cotizacion", label: "Cotización" },
  { id: "consulta", label: "Consulta" },
  { id: "soporte", label: "Soporte" },
  { id: "otro", label: "Otro" },
] as const;

export const CONTACTO_CATEGORIAS = [
  { id: "c-level", label: "C-level" },
  { id: "director", label: "Director" },
  { id: "manager", label: "Manager" },
  { id: "otros", label: "Otros" },
] as const;

export const CONTACTO_POSICIONES: Record<string, readonly { id: string; label: string }[]> = {
  "c-level": [
    { id: "cco", label: "Chief Communications Officer" },
    { id: "compliance-officer", label: "Chief Compliance Officer" },
    { id: "cdo", label: "Chief Data Officer" },
    { id: "cdo-digital", label: "Chief Digital Officer" },
    { id: "ceo", label: "Chief Executive Officer / Director General" },
    { id: "cxo", label: "Chief Experience Officer" },
    { id: "cfo", label: "Chief Financial Officer" },
    { id: "chro", label: "Chief Human Resources Officer" },
    { id: "ciso", label: "Chief Information Security Officer" },
    { id: "cio-innovation", label: "Chief Innovation Officer" },
    { id: "cio-investment", label: "Chief Investment Officer" },
    { id: "clo", label: "Chief Legal Officer" },
    { id: "cmo", label: "Chief Marketing Officer" },
    { id: "coo", label: "Chief Operating Officer" },
    { id: "cro", label: "Chief Revenue Officer" },
    { id: "cro-risk", label: "Chief Risk Officer" },
    { id: "cto", label: "Chief Technology Officer" },
    { id: "cso", label: "Chief Strategy Officer" },
    { id: "presidente", label: "Presidente" },
  ],
  "director": [
    { id: "dir-ciberseguridad", label: "Ciberseguridad" },
    { id: "dir-compliance", label: "Compliance" },
    { id: "dir-compras", label: "Compras" },
    { id: "dir-comunicacion", label: "Comunicacion y Medios" },
    { id: "dir-data", label: "Data e Inteligencia de Negocios" },
    { id: "dir-innovacion", label: "Estrategia de Innovación" },
    { id: "dir-experiencia", label: "Experiencia de Cliente" },
    { id: "dir-finanzas", label: "Finanzas" },
    { id: "dir-legal", label: "Legal" },
    { id: "dir-logistica", label: "Logistica" },
    { id: "dir-marketing", label: "Marketing" },
    { id: "dir-operaciones", label: "Operaciones" },
    { id: "dir-rrhh", label: "Recursos Humanos" },
    { id: "dir-riesgos", label: "Riesgos" },
    { id: "dir-tecnologia", label: "Tecnología y Sistemas de Información" },
    { id: "dir-transformacion", label: "Transformacion Digital" },
    { id: "dir-ventas", label: "Ventas" }
  ],
  "manager": [
    { id: "mgr-ciberseguridad", label: "Ciberseguridad" },
    { id: "mgr-compliance", label: "Compliance" },
    { id: "mgr-compras", label: "Compras" },
    { id: "mgr-comunicacion", label: "Comunicacion y Medios" },
    { id: "mgr-data", label: "Data e Inteligencia de Negocios" },
    { id: "mgr-innovacion", label: "Estrategia de Innovación" },
    { id: "mgr-experiencia", label: "Experiencia de Cliente" },
    { id: "mgr-finanzas", label: "Finanzas" },
    { id: "mgr-legal", label: "Legal" },
    { id: "mgr-logistica", label: "Logistica" },
    { id: "mgr-marketing", label: "Marketing" },
    { id: "mgr-operaciones", label: "Operaciones" },
    { id: "mgr-rrhh", label: "Recursos Humanos" },
    { id: "mgr-riesgos", label: "Riesgos" },
    { id: "mgr-tecnologia", label: "Tecnología y Sistemas de Información" },
    { id: "mgr-transformacion", label: "Transformacion Digital" },
    { id: "mgr-ventas", label: "Ventas" }
  ],
  "otros": [
    { id: "asesor", label: "Asesor" },
    { id: "asistente", label: "Asistente" },
    { id: "estudiante", label: "Estudiante" },
    { id: "jefe-proyecto", label: "Jefe de proyecto" },
    { id: "tecnico", label: "Técnico" }
  ]
} as const;

// --------------------------------------------
// SERVICIOS - Definiciones de servicios
// --------------------------------------------
export const SERVICIOS = [
  {
    carpeta: "consultoria",
    titulo: "Consultoría",
    subtitulo: "Asesoría estratégica para transformar tu negocio",
    descripcion: "Te ayudamos a identificar oportunidades de mejora y diseñar la hoja de ruta perfecta para tu empresa.",
    color: "#3d79e2",
  },
  {
    carpeta: "desarrollo",
    titulo: "Desarrollo",
    subtitulo: "Software a medida para tus necesidades",
    descripcion: "Creamos soluciones de software personalizadas que se adaptan perfectamente a tus procesos de negocio.",
    color: "#10b981",
  },
  {
    carpeta: "infraestructura",
    titulo: "Infraestructura",
    subtitulo: "Infraestructura robusta y escalable",
    descripcion: "Diseñamos e implementamos la infraestructura tecnológica que tu empresa necesita para crecer.",
    color: "#8b5cf6",
  },
  {
    carpeta: "seguridad",
    titulo: "Seguridad",
    subtitulo: "Protección integral para tus datos",
    descripcion: "Protegemos tus activos más valiosos con soluciones de ciberseguridad de nivel empresarial.",
    color: "#ef4444",
  },
  {
    carpeta: "soporte",
    titulo: "Soporte",
    subtitulo: "Asistencia técnica especializada",
    descripcion: "Equipo de soporte disponible 24/7 para resolver cualquier incidencia.",
    color: "#f59e0b",
  },
] as const;

export type ServicioCarpeta = typeof SERVICIOS[number]["carpeta"];