import postgres from 'postgres';

// Conexión a PostgreSQL - usar variables de entorno en producción
// Railway proporciona DATABASE_URL automáticamente
const connectionString = process.env.DATABASE_URL || 
  'postgresql://postgres:database@@@localhost:5432/CS4B';

const sql = postgres(connectionString, {
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default sql;

// Tipos para la base de datos
export interface Usuario {
  id: string;
  email: string;
  password: string;
  nombre: string;
  rol: 'admin' | 'editor';
  avatar: string | null;
  ultimo_login: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  color: string;
  orden: number;
  created_at: Date;
}

export interface Servicio {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta: string | null;
  icono: string | null;
  imagen: string | null;
  categoria: 'cloud' | 'seguridad' | 'hardware' | 'software' | 'capacitacion' | 'consultoria';
  orden: number;
  visible: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Post {
  id: string;
  titulo: string;
  slug: string;
  contenido: string;
  excerpt: string | null;
  imagen_destacada: string | null;
  categoria_id: string | null;
  autor_id: string | null;
  etiquetas: string[];
  vistas: number;
  publicado: boolean;
  fecha_publicacion: Date | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Contacto {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  empresa: string | null;
  servicio_interes: string | null;
  mensaje: string;
  ip: string | null;
  leido: boolean;
  respondido: boolean;
  respuesta: string | null;
  created_at: Date;
}

export interface Configuracion {
  id: string;
  clave: string;
  valor: string;
  descripcion: string | null;
  updated_at: Date;
}

// Funciones helper para consultas comunes
export const db = {
  // Usuarios
  usuarios: {
    findByEmail: async (email: string) => {
      return sql<Usuario[]>`SELECT * FROM usuarios WHERE email = ${email} LIMIT 1`;
    },
    findById: async (id: string) => {
      return sql<Usuario[]>`SELECT id, email, nombre, rol, avatar, ultimo_login, created_at, updated_at FROM usuarios WHERE id = ${id} LIMIT 1`;
    },
    create: async (data: { email: string; password: string; nombre: string; rol?: string }) => {
      return sql<Usuario[]>`INSERT INTO usuarios (email, password, nombre, rol) VALUES (${data.email}, ${data.password}, ${data.nombre}, ${data.rol || 'editor'}) RETURNING *`;
    },
    updateLastLogin: async (id: string) => {
      return sql`UPDATE usuarios SET ultimo_login = NOW() WHERE id = ${id}`;
    },
  },

  // Categorías
  categorias: {
    findAll: async () => {
      return sql<Categoria[]>`SELECT * FROM categorias ORDER BY orden ASC`;
    },
    findById: async (id: string) => {
      return sql<Categoria[]>`SELECT * FROM categorias WHERE id = ${id} LIMIT 1`;
    },
    findBySlug: async (slug: string) => {
      return sql<Categoria[]>`SELECT * FROM categorias WHERE slug = ${slug} LIMIT 1`;
    },
    create: async (data: { nombre: string; slug: string; descripcion?: string; color?: string; orden?: number }) => {
      return sql<Categoria[]>`INSERT INTO categorias (nombre, slug, descripcion, color, orden) VALUES (${data.nombre}, ${data.slug}, ${data.descripcion || null}, ${data.color || '#000000'}, ${data.orden || 0}) RETURNING *`;
    },
    update: async (id: string, data: Partial<Categoria>) => {
      const fields: string[] = [];
      const values: any[] = [];
      
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'created_at') {
          fields.push(`${key} = $${values.length + 1}`);
          values.push(value);
        }
      });
      
      if (fields.length === 0) return [];
      
      values.push(id);
      return sql<Categoria[]>`UPDATE categorias SET ${sql(fields)} WHERE id = $${values.length} RETURNING *`;
    },
    delete: async (id: string) => {
      return sql`DELETE FROM categorias WHERE id = ${id}`;
    },
  },

  // Servicios
  servicios: {
    findAll: async (onlyVisible = true) => {
      if (onlyVisible) {
        return sql<Servicio[]>`SELECT * FROM servicios WHERE visible = true ORDER BY orden ASC`;
      }
      return sql<Servicio[]>`SELECT * FROM servicios ORDER BY orden ASC`;
    },
    findById: async (id: string) => {
      return sql<Servicio[]>`SELECT * FROM servicios WHERE id = ${id} LIMIT 1`;
    },
    findBySlug: async (slug: string) => {
      return sql<Servicio[]>`SELECT * FROM servicios WHERE slug = ${slug} LIMIT 1`;
    },
    findByCategoria: async (categoria: string) => {
      return sql<Servicio[]>`SELECT * FROM servicios WHERE categoria = ${categoria} AND visible = true ORDER BY orden ASC`;
    },
    create: async (data: Partial<Servicio>) => {
      const allowedFields = ['titulo', 'slug', 'descripcion', 'descripcion_corta', 'icono', 'imagen', 'categoria', 'orden', 'visible'];
      
      const insertData: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(data)) {
        if (!allowedFields.includes(key)) continue;
        if (key === 'id' || key === 'created_at' || key === 'updated_at') continue;
        if (value === undefined) continue;
        
        insertData[key] = value;
      }
      
      const fields = Object.keys(insertData);
      const values = Object.values(insertData);
      
      if (fields.length === 0) return [];
      
      const fieldList = fields.join(', ');
      const valuePlaceholders = fields.map((_, i) => `$${i + 1}`).join(', ');
      
      const query = `INSERT INTO servicios (${fieldList}) VALUES (${valuePlaceholders}) RETURNING *`;
      const result = await sql.unsafe(query, values);
      return result as Servicio[];
    },
    update: async (id: string, data: Partial<Servicio>) => {
      const fields: string[] = [];
      const values: any[] = [];
      
      for (const [key, value] of Object.entries(data)) {
        if (key === 'id' || key === 'created_at' || key === 'updated_at') continue;
        if (value === undefined) continue;
        
        fields.push(`${key} = $${values.length + 1}`);
        values.push(value);
      }
      
      if (fields.length === 0) return [];
      
      values.push(id);
      const setClause = fields.join(', ');
      return sql<Servicio[]>`UPDATE servicios SET ${setClause} WHERE id = $${values.length} RETURNING *`;
    },
    delete: async (id: string) => {
      return sql`DELETE FROM servicios WHERE id = ${id}`;
    },
  },

  // Posts
  posts: {
    findAll: async (publishedOnly = true, limit = 10, offset = 0) => {
      if (publishedOnly) {
        return sql<Post[]>`SELECT * FROM posts WHERE publicado = true AND (fecha_publicacion IS NULL OR fecha_publicacion <= NOW()) ORDER BY fecha_publicacion DESC LIMIT ${limit} OFFSET ${offset}`;
      }
      return sql<Post[]>`SELECT * FROM posts ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    },
    findById: async (id: string) => {
      return sql<Post[]>`SELECT * FROM posts WHERE id = ${id} LIMIT 1`;
    },
    findBySlug: async (slug: string) => {
      return sql<Post[]>`SELECT * FROM posts WHERE slug = ${slug} LIMIT 1`;
    },
    findByCategoria: async (categoriaId: string, limit = 10, offset = 0) => {
      return sql<Post[]>`SELECT * FROM posts WHERE categoria_id = ${categoriaId} AND publicado = true ORDER BY fecha_publicacion DESC LIMIT ${limit} OFFSET ${offset}`;
    },
    count: async (publishedOnly = true) => {
      const result = publishedOnly 
        ? await sql<{count: number}[]>`SELECT COUNT(*) as count FROM posts WHERE publicado = true`
        : await sql<{count: number}[]>`SELECT COUNT(*) as count FROM posts`;
      return result[0]?.count || 0;
    },
    create: async (data: Partial<Post>) => {
      const allowedFields = ['titulo', 'slug', 'contenido', 'excerpt', 'imagen_destacada', 'categoria_id', 'autor_id', 'etiquetas', 'publicado', 'fecha_publicacion', 'meta_title', 'meta_description'];
      
      const insertData: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(data)) {
        if (!allowedFields.includes(key)) continue;
        if (key === 'id' || key === 'created_at' || key === 'updated_at') continue;
        if (value === undefined) continue;
        
        // Handle special types
        if (key === 'etiquetas' && Array.isArray(value)) {
          insertData[key] = JSON.stringify(value);
        } else {
          insertData[key] = value;
        }
      }
      
      const fields = Object.keys(insertData);
      const values = Object.values(insertData);
      
      if (fields.length === 0) return [];
      
      const fieldList = fields.join(', ');
      const valuePlaceholders = fields.map((_, i) => `$${i + 1}`).join(', ');
      
      // Use simple query with typed parameters
      const query = `INSERT INTO posts (${fieldList}) VALUES (${valuePlaceholders}) RETURNING *`;
      const result = await sql.unsafe(query, values);
      return result as Post[];
    },
    update: async (id: string, data: Partial<Post>) => {
      const allowedFields = ['titulo', 'slug', 'contenido', 'excerpt', 'imagen_destacada', 'categoria_id', 'etiquetas', 'publicado', 'fecha_publicacion', 'meta_title', 'meta_description'];
      
      const updateData: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(data)) {
        if (!allowedFields.includes(key)) continue;
        if (key === 'id' || key === 'created_at' || key === 'updated_at') continue;
        if (value === undefined) continue;
        
        // Handle special types
        if (key === 'etiquetas' && Array.isArray(value)) {
          updateData[key] = JSON.stringify(value);
        } else {
          updateData[key] = value;
        }
      }
      
      const fields = Object.keys(updateData);
      const values = Object.values(updateData);
      
      if (fields.length === 0) return [];
      
      const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
      const allValues = [...values, id];
      
      const query = `UPDATE posts SET ${setClause} WHERE id = $${allValues.length} RETURNING *`;
      const result = await sql.unsafe(query, allValues);
      return result as Post[];
    },
    delete: async (id: string) => {
      return sql`DELETE FROM posts WHERE id = ${id}`;
    },
    incrementViews: async (id: string) => {
      return sql`UPDATE posts SET vistas = vistas + 1 WHERE id = ${id}`;
    },
  },

  // Contactos
  contactos: {
    findAll: async (limit = 20, offset = 0) => {
      return sql<Contacto[]>`SELECT * FROM contactos ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    },
    findUnread: async () => {
      return sql<Contacto[]>`SELECT * FROM contactos WHERE leido = false ORDER BY created_at DESC`;
    },
    findById: async (id: string) => {
      return sql<Contacto[]>`SELECT * FROM contactos WHERE id = ${id} LIMIT 1`;
    },
    search: async (search: string, status: string, limit = 20, offset = 0) => {
      // Build parameterized query step by step using sql template
      let baseQuery = sql<Contacto[]>`SELECT * FROM contactos WHERE 1=1`;
      
      // Add search filter if provided
      if (search && search.trim()) {
        const searchTerm = `%${search.trim().toLowerCase()}%`;
        baseQuery = sql<Contacto[]>`${baseQuery} AND (LOWER(nombre) LIKE ${searchTerm} OR LOWER(email) LIKE ${searchTerm} OR LOWER(empresa) LIKE ${searchTerm})`;
      }
      
      // Add status filter
      if (status === "no_leidos") {
        baseQuery = sql<Contacto[]>`${baseQuery} AND leido = false`;
      } else if (status === "leidos") {
        baseQuery = sql<Contacto[]>`${baseQuery} AND leido = true`;
      } else if (status === "respondidos") {
        baseQuery = sql<Contacto[]>`${baseQuery} AND respondido = true`;
      } else if (status === "pendientes") {
        baseQuery = sql<Contacto[]>`${baseQuery} AND respondido = false`;
      }
      
      // Add order and pagination
      return sql<Contacto[]>`${baseQuery} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    },
    countUnread: async () => {
      const result = await sql<{count: number}[]>`SELECT COUNT(*) as count FROM contactos WHERE leido = false`;
      return result[0]?.count || 0;
    },
    countAll: async () => {
      const result = await sql<{count: number}[]>`SELECT COUNT(*) as count FROM contactos`;
      return result[0]?.count || 0;
    },
    countResponded: async () => {
      const result = await sql<{count: number}[]>`SELECT COUNT(*) as count FROM contactos WHERE respondido = true`;
      return result[0]?.count || 0;
    },
    create: async (data: { nombre: string; email: string; telefono?: string; empresa?: string; servicio_interes?: string; mensaje: string; ip?: string }) => {
      return sql<Contacto[]>`INSERT INTO contactos (nombre, email, telefono, empresa, servicio_interes, mensaje, ip) VALUES (${data.nombre}, ${data.email}, ${data.telefono || null}, ${data.empresa || null}, ${data.servicio_interes || null}, ${data.mensaje}, ${data.ip || null}) RETURNING *`;
    },
    markAsRead: async (id: string) => {
      return sql`UPDATE contactos SET leido = true WHERE id = ${id}`;
    },
    respond: async (id: string, respuesta: string) => {
      return sql`UPDATE contactos SET respondido = true, respuesta = ${respuesta} WHERE id = ${id}`;
    },
    delete: async (id: string) => {
      return sql`DELETE FROM contactos WHERE id = ${id}`;
    },
  },

  // Configuraciones
  configuraciones: {
    findAll: async () => {
      return sql<Configuracion[]>`SELECT * FROM configuraciones ORDER BY clave ASC`;
    },
    findByClave: async (clave: string) => {
      return sql<Configuracion[]>`SELECT * FROM configuraciones WHERE clave = ${clave} LIMIT 1`;
    },
    upsert: async (clave: string, valor: string, descripcion?: string) => {
      return sql<Configuracion[]>`INSERT INTO configuraciones (clave, valor, descripcion) VALUES (${clave}, ${valor}, ${descripcion || null}) ON CONFLICT (clave) DO UPDATE SET valor = ${valor}, updated_at = NOW() RETURNING *`;
    },
    delete: async (clave: string) => {
      return sql`DELETE FROM configuraciones WHERE clave = ${clave}`;
    },
  },
};
