import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
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
    const categoria = await prisma.categoria_servicio.findUnique({
      where: { slug, visible: true },
    });
    
    if (!categoria) return null;
    
    // Obtener servicios de esta categoría
    const servicios = await prisma.servicio.findMany({
      where: { categoria_servicio_id: categoria.id, visible: true },
      orderBy: { orden: 'asc' },
    });
    
    return {
      ...categoria,
      servicios: servicios.map((s) => ({
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
    const servicio = await prisma.servicio.findUnique({
      where: { slug, visible: true },
      include: {
        categoria: { select: { nombre: true, slug: true, descripcion: true, imagen: true } },
      },
    });
    
    if (!servicio) return null;
    
    return {
      id: servicio.id,
      titulo: servicio.titulo,
      slug: servicio.slug,
      descripcion: servicio.descripcion,
      descripcion_corta: servicio.descripcion_corta,
      icono: servicio.icono,
      imagen: servicio.imagen,
      visible: servicio.visible,
      categoria_servicio_id: servicio.categoria_servicio_id,
      categoria_nombre: servicio.categoria?.nombre || undefined,
      categoria_slug: servicio.categoria?.slug || undefined,
      categoria_descripcion: servicio.categoria?.descripcion || undefined,
      categoria_imagen: servicio.categoria?.imagen || undefined,
    };
  } catch (error) {
    console.error("Error fetching servicio:", error);
    return null;
  }
}

async function getServiciosRelacionados(excludeId: string, limit = 3): Promise<{slug: string, titulo: string}[]> {
  try {
    const servicios = await prisma.servicio.findMany({
      where: { id: { not: excludeId }, visible: true },
      select: { slug: true, titulo: true },
      take: limit,
      orderBy: { orden: 'asc' },
    });
    return servicios.map((s) => ({ slug: s.slug, titulo: s.titulo }));
  } catch (error) {
    return [];
  }
}

export default async function ServicioPage({ params }: Props) {
  const { slug } = await params;
  
  // Primero buscar si es una categoría
  const categoria = await getCategoriaBySlug(slug);
  
  if (categoria) {
    return <CategoriaServiciosPage categoria={categoria} />;
  }
  
  // No es categoría, buscar si es un servicio
  const servicio = await getServicioBySlug(slug);
  
  if (!servicio) {
    notFound();
  }
  
  const serviciosRelacionados = await getServiciosRelacionados(servicio.id);

  const servicioTransformado = {
    ...servicio,
    descripcion_corta: servicio.descripcion_corta ?? undefined,
    icono: servicio.icono ?? undefined,
    imagen: servicio.imagen ?? undefined,
    categoria: servicio.categoria ?? undefined,
    categoria_servicio_id: servicio.categoria_servicio_id ?? undefined,
  };

  return (
    <ServicioDetailClient 
      servicio={servicioTransformado} 
      serviciosRelacionados={serviciosRelacionados} 
    />
  );
}