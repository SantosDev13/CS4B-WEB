import prisma from "@/lib/prisma";
import ServiciosPageClient from "@/components/public/ServiciosPageClient";
import { Suspense } from "react";

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

async function getCategoriasConServicios() {
  try {
    // Usar Prisma - import directo
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const categorias = await prisma.categoria_servicio.findMany({
      where: { visible: true },
      orderBy: { orden: 'asc' },
    });

    if (!categorias || categorias.length === 0) {
      return [];
    }

    const categoriasWithServicios: CategoriaWithServicios[] = [];

    for (const cat of categorias) {
      try {
        const servicios = await prisma.servicio.findMany({
          where: { categoria_servicio_id: cat.id, visible: true },
          orderBy: { orden: 'asc' },
        });
        
        categoriasWithServicios.push({
          ...cat,
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
        });
      } catch (err) {
        console.error(`Error fetching servicios for categoria ${cat.id}:`, err);
        categoriasWithServicios.push({
          ...cat,
          servicios: [],
        });
      }
    }

    return categoriasWithServicios;
  } catch (error) {
    console.error("Error fetching categorias con servicios:", error);
    return [];
  }
}

export default async function ServiciosPage() {
  let categorias: CategoriaWithServicios[] = [];

  try {
    categorias = await getCategoriasConServicios();
  } catch (error) {
    console.error("Error loading categorias:", error);
  }

  // Obtener todos los servicios para el listado general
  let allServicios: any[] = [];
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const result = await prisma.$queryRaw`
      SELECT s.*, cs.nombre as categoria_nombre, cs.slug as categoria_slug
      FROM servicios s
      LEFT JOIN categorias_servicios cs ON s.categoria_servicio_id = cs.id
      WHERE s.visible = true
      ORDER BY s.orden ASC
    `;
    
    allServicios = (result as any[]).map((s) => ({
      ...s,
      categoria_nombre: s.categoria_nombre,
      categoria_slug: s.categoria_slug,
    }));
  } catch (e) {
    console.error("Error fetching all servicios:", e);
  }

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ServiciosPageClient categorias={categorias} allServicios={allServicios} />
    </Suspense>
  );
}