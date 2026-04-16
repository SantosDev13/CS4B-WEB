import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import sql from "@/lib/db";
import ServicioDetailClient from "@/components/ServicioDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

interface ServicioDB {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta: string | null;
  icono: string | null;
  imagen: string | null;
  categoria: string | null;
  categoria_servicio_id: string | null;
  visible: boolean;
  categoria_nombre?: string;
  categoria_slug?: string;
  categoria_descripcion?: string;
  categoria_imagen?: string;
}

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
  
  const servicio = await getServicioBySlug(slug);
  
  if (!servicio) {
    notFound();
  }
  
  const serviciosRelacionados = await getServiciosRelacionados(servicio.id);

  return (
    <ServicioDetailClient 
      servicio={servicio} 
      serviciosRelacionados={serviciosRelacionados} 
    />
  );
}

// Removed generateStaticParams for dev mode
// Can add later for production if needed