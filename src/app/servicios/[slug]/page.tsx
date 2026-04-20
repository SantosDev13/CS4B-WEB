import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import sql from "@/lib/db";
import ServicioDetailClient from "@/components/ServicioDetail";
import CategoriaServiciosPage from "@/components/CategoriaServicios";

interface Props {
  params: Promise<{ slug: string }>;
}

interface ServicioDB {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta?: string | null;
  icono?: string | null;
  imagen?: string | null;
  categoria?: string | null;
  categoria_servicio_id?: string | null;
  visible: boolean;
  categoria_nombre?: string;
  categoria_slug?: string;
  categoria_descripcion?: string;
  categoria_imagen?: string;
}

interface CategoriaWithServicios {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
  link: string | null;
  visible: boolean;
  servicios: {
    id: string;
    titulo: string;
    slug: string;
    descripcion: string;
    descripcion_corta: string | null;
    icono: string | null;
    imagen: string | null;
    tamanho: string;
  }[];
}

// Buscar categoría por slug
async function getCategoriaBySlug(slug: string): Promise<CategoriaWithServicios | null> {
  try {
    const categorias = await sql<CategoriaWithServicios[]>`
      SELECT * FROM categorias_servicios WHERE slug = ${slug} AND visible = true LIMIT 1
    `;
    
    if (categorias.length === 0) return null;
    
    const categoria = categorias[0];
    
    // Obtener servicios de esta categoría
    const servicios = await sql<any[]>`
      SELECT * FROM servicios WHERE categoria_servicio_id = ${categoria.id} AND visible = true ORDER BY orden ASC
    `;
    
    return {
      ...categoria,
      servicios: servicios.map((s: any) => ({
        id: s.id,
        titulo: s.titulo,
        slug: s.slug,
        descripcion: s.descripcion,
        descripcion_corta: s.descripcion_corta,
        icono: s.icono,
        imagen: s.imagen,
        tamanho: s.tamanho,
      })),
    };
  } catch (error) {
    console.error("Error fetching categoria:", error);
    return null;
  }
}

// Buscar servicio por slug
async function getServicioBySlug(slug: string): Promise<ServicioDB | null> {
  try {
    const result = await sql`
      SELECT s.*, cs.nombre as categoria_nombre, cs.slug as categoria_slug, cs.descripcion as categoria_descripcion, cs.imagen as categoria_imagen
      FROM servicios s
      LEFT JOIN categorias_servicios cs ON s.categoria_servicio_id = cs.id
      WHERE s.slug = ${slug} AND s.visible = true
      LIMIT 1
    `;
    
    if (result.length === 0) return null;
    return result[0] as ServicioDB;
  } catch (error) {
    console.error("Error fetching servicio:", error);
    return null;
  }
}

async function getServiciosRelacionados(excludeId: string, limit = 3): Promise<{slug: string, titulo: string}[]> {
  try {
    const result = await sql`
      SELECT slug, titulo 
      FROM servicios 
      WHERE id != ${excludeId} AND visible = true 
      ORDER BY RANDOM() 
      LIMIT ${limit}
    `;
    return result.map((s: any) => ({ slug: s.slug, titulo: s.titulo }));
  } catch (error) {
    return [];
  }
}

export default async function ServicioPage({ params }: Props) {
  const { slug } = await params;
  
  // Primero buscar si es una categoría
  const categoria = await getCategoriaBySlug(slug);
  
  if (categoria) {
    // Es una categoría - mostrar página de categoría
    return <CategoriaServiciosPage categoria={categoria} />;
  }
  
  // No es categoría, buscar si es un servicio
  const servicio = await getServicioBySlug(slug);
  
  if (!servicio) {
    notFound();
  }
  
  const serviciosRelacionados = await getServiciosRelacionados(servicio.id);

  // Transformar para el componente cliente - hacer todos los campos opcionales con undefined
  const servicioTransformado = {
    ...servicio,
    descripcion_corta: servicio.descripcion_corta ?? undefined,
    icono: servicio.icono ?? undefined,
    imagen: servicio.imagen ?? undefined,
    categoria: servicio.categoria ?? undefined,
    categoria_servicio_id: servicio.categoria_servicio_id ?? undefined,
    categoria_nombre: servicio.categoria_nombre ?? undefined,
    categoria_slug: servicio.categoria_slug ?? undefined,
    categoria_descripcion: servicio.categoria_descripcion ?? undefined,
    categoria_imagen: servicio.categoria_imagen ?? undefined,
  };

  return (
    <ServicioDetailClient 
      servicio={servicioTransformado} 
      serviciosRelacionados={serviciosRelacionados} 
    />
  );
}

// Removed generateStaticParams for dev mode
// Can add later for production if needed