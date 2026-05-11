import prisma from "@/lib/prisma";
import ProductosPageClient from "@/components/public/ProductosPageClient";
import { Suspense } from "react";

interface CategoriaWithProductos {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
  link: string | null;
  visible: boolean;
  productos: {
    id: string;
    titulo: string;
    slug: string;
    descripcion: string;
    descripcion_corta: string | null;
    icono: string | null;
    imagen: string | null;
    tamanho: string;
    precio?: number | null;
    precio_anterior?: number | null;
    tipo_moneda?: string;
    mostrar_precio?: boolean;
  }[];
}

async function fetchCategoriasConProductos() {
  try {
    // Usar Prisma - import directo
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const categorias = await prisma.categoria_producto.findMany({
      where: { visible: true },
      orderBy: { orden: 'asc' },
    });

    if (!categorias || categorias.length === 0) {
      return [];
    }

    const categoriasWithProductos: CategoriaWithProductos[] = [];

    for (const cat of categorias) {
      try {
        const productos = await prisma.producto.findMany({
          where: { categoria_producto_id: cat.id, visible: true },
          orderBy: { orden: 'asc' },
        });
        
        categoriasWithProductos.push({
          ...cat,
          productos: productos.map((p) => ({
            id: p.id,
            titulo: p.titulo,
            slug: p.slug,
            descripcion: p.descripcion,
            descripcion_corta: p.descripcion_corta,
            icono: p.icono,
            imagen: p.imagen,
            tamanho: p.tamanho,
            // Convertir Decimals a números
            precio: p.precio ? Number(p.precio) : null,
            precio_anterior: p.precio_anterior ? Number(p.precio_anterior) : null,
            tipo_moneda: p.tipo_moneda,
            mostrar_precio: p.mostrar_precio,
          })),
        });
      } catch (err) {
        console.error(`Error fetching productos for categoria ${cat.id}:`, err);
        categoriasWithProductos.push({
          ...cat,
          productos: [],
        });
      }
    }

    return categoriasWithProductos;
  } catch (error) {
    console.error("Error fetching categorias con productos:", error);
    return [];
  }
}

export default async function ProductosPage() {
  let categorias: CategoriaWithProductos[] = [];

  try {
    categorias = await fetchCategoriasConProductos();
  } catch (error) {
    console.error("Error loading categorias:", error);
  }

  // Obtener todos los productos para el listado general
  let allProductos: any[] = [];
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const result = await prisma.$queryRaw`
      SELECT p.*, cp.nombre as categoria_nombre, cp.slug as categoria_slug
      FROM productos p
      LEFT JOIN categorias_productos cp ON p.categoria_producto_id = cp.id
      WHERE p.visible = true
      ORDER BY p.orden ASC
    `;
    
    allProductos = (result as any[]).map((p) => ({
      ...p,
      // Convertir Decimals a números
      precio: p.precio ? Number(p.precio) : null,
      precio_anterior: p.precio_anterior ? Number(p.precio_anterior) : null,
      categoria_nombre: p.categoria_nombre,
      categoria_slug: p.categoria_slug,
    }));
  } catch (e) {
    console.error("Error fetching all productos:", e);
  }

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ProductosPageClient categorias={categorias} allProductos={allProductos} />
    </Suspense>
  );
}