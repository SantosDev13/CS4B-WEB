import { NextResponse } from 'next/server';
import sql from '@/lib/db';

// GET - Verificar estado de la base de datos
export async function GET() {
  try {
    // Verificar conexión y crear tablas si no existen
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    const tables = result.map(r => r.table_name);
    
    return NextResponse.json({ 
      connected: true, 
      tables,
      message: tables.length > 0 ? 'Base de datos conectada' : 'Sin tablas'
    });
  } catch (error) {
    console.error('Error de conexión:', error);
    return NextResponse.json({ 
      connected: false, 
      error: 'No se puede conectar a la base de datos' 
    }, { status: 500 });
  }
}

// POST - Inicializar tablas de la base de datos
export async function POST() {
  try {
    // Tabla de usuarios
    await sql`
      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        rol VARCHAR(50) DEFAULT 'editor',
        avatar TEXT,
        ultimo_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Tabla de categorías
    await sql`
      CREATE TABLE IF NOT EXISTS categorias (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        descripcion TEXT,
        color VARCHAR(20) DEFAULT '#000000',
        orden INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Tabla de servicios
    await sql`
      CREATE TABLE IF NOT EXISTS servicios (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        titulo VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        descripcion TEXT NOT NULL,
        descripcion_corta VARCHAR(500),
        icono VARCHAR(500),
        imagen VARCHAR(500),
        categoria VARCHAR(50) NOT NULL,
        orden INTEGER DEFAULT 0,
        visible BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Tabla de posts
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        titulo VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        contenido TEXT NOT NULL,
        excerpt VARCHAR(500),
        imagen_destacada VARCHAR(500),
        categoria_id UUID REFERENCES categorias(id),
        autor_id UUID REFERENCES usuarios(id),
        etiquetas TEXT[] DEFAULT '{}',
        vistas INTEGER DEFAULT 0,
        publicado BOOLEAN DEFAULT false,
        fecha_publicacion TIMESTAMP,
        meta_title VARCHAR(200),
        meta_description VARCHAR(300),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Tabla de contactos
    await sql`
      CREATE TABLE IF NOT EXISTS contactos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefono VARCHAR(50),
        empresa VARCHAR(255),
        servicio_interes VARCHAR(100),
        mensaje TEXT NOT NULL,
        ip VARCHAR(50),
        leido BOOLEAN DEFAULT false,
        respondido BOOLEAN DEFAULT false,
        respuesta TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Tabla de configuraciones
    await sql`
      CREATE TABLE IF NOT EXISTS configuraciones (
        clave VARCHAR(100) PRIMARY KEY,
        valor TEXT NOT NULL,
        descripcion TEXT,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Insertar datos por defecto si no existen
    // Usuario admin por defecto (password: admin123)
    const adminExists = await sql`SELECT id FROM usuarios WHERE email = 'admin@cs4b.com'`;
    if (adminExists.length === 0) {
      await sql`
        INSERT INTO usuarios (email, password, nombre, rol) 
        VALUES ('admin@cs4b.com', '$2a$10$rVqKxXw6b5L8Y3Z4N6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0', 'Administrador', 'admin')
      `;
    }

    // Categorías por defecto
    const catExists = await sql`SELECT id FROM categorias`;
    if (catExists.length === 0) {
      await sql`
        INSERT INTO categorias (nombre, slug, descripcion, color, orden) VALUES
        ('Tecnología', 'tecnologia', 'Artículos sobre tecnología e innovación', '#3FA9F5', 1),
        ('Negocios', 'negocios', 'Artículos sobre gestión empresarial', '#B6E356', 2),
        ('Transformación Digital', 'transformacion-digital', 'Artículos sobre transformación digital', '#FF6B6B', 3)
      `;
    }

    // Servicios por defecto
    const servExists = await sql`SELECT id FROM servicios`;
    if (servExists.length === 0) {
      await sql`
        INSERT INTO servicios (titulo, slug, descripcion, descripcion_corta, categoria, orden, visible) VALUES
        ('Licencias Microsoft', 'licencias-microsoft', 'Adquiere licencias Microsoft originales para tu empresa. Office 365, Windows, Azure y más con soporte especializado.', 'Licencias originales Microsoft', 'software', 1, true),
        ('Antivirus y Seguridad', 'antivirus-seguridad', 'Protege tu infraestructura con soluciones de seguridad empresarial.', 'Soluciones de seguridad', 'seguridad', 2, true),
        ('Hardware y Equipos', 'hardware-equipos', 'Equipos de computación y servidores de las mejores marcas.', 'Equipos de última generación', 'hardware', 3, true),
        ('Desarrollo de Software', 'desarrollo-software', 'Desarrollo de aplicaciones web y móviles personalizadas.', 'Software a medida', 'software', 4, true),
        ('Consultoría IT', 'consultoria-it', 'Asesoría especializada en tecnología para transformar digitalmente tu empresa.', 'Expertos en transformación digital', 'consultoria', 5, true),
        ('Capacitación', 'capacitacion', 'Capacitación y certificaciones en tecnologías Microsoft.', 'Certificaciones profesionales', 'capacitacion', 6, true)
      `;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Base de datos inicializada correctamente' 
    });
  } catch (error) {
    console.error('Error al inicializar base de datos:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al inicializar la base de datos' 
    }, { status: 500 });
  }
}