import { db } from "@/lib/db";
import sql from "@/lib/db";
import ServiciosPageClient from "@/components/ServiciosPageClient";
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

async function getCategoriasConServicios(): Promise<CategoriaWithServicios[]> {
  try {
    const categorias = await db.categorias_servicios.findAll(true);

    if (!categorias || categorias.length === 0) {
      return [];
    }

    const categoriasWithServicios: CategoriaWithServicios[] = [];

    for (const cat of categorias) {
      try {
        const servicios = await db.servicios.findByCategoria(cat.id, true);
        categoriasWithServicios.push({
          ...cat,
          servicios: servicios?.map((s: any) => ({
            id: s.id,
            titulo: s.titulo,
            slug: s.slug,
            descripcion: s.descripcion,
            descripcion_corta: s.descripcion_corta,
            icono: s.icono,
            imagen: s.imagen,
            tamanho: s.tamanho,
          })) || [],
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

  let allServicios: any[] = [];
  try {
    const result = await sql`
      SELECT s.*, cs.nombre as categoria_nombre, cs.slug as categoria_slug
      FROM servicios s
      LEFT JOIN categorias_servicios cs ON s.categoria_servicio_id = cs.id
      WHERE s.visible = true
      ORDER BY s.orden ASC
    `;
    allServicios = result.map((s: any) => ({
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