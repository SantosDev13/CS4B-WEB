import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductoDetailClient from "@/components/public/ProductoDetail";
import CategoriaProductosPage from "@/components/public/CategoriaProductos";

interface Props {
  params: Promise<{ slug: string }>;
}

interface ProductoDB {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta?: string | null;
  icono?: string | null;
  imagen?: string | null;
  categoria?: string | null;
  categoria_producto_id?: string | null;
  visible: boolean;
  categoria_nombre?: string;
  categoria_slug?: string;
  categoria_descripcion?: string;
  categoria_imagen?: string;
  // Precio
  precio?: number | null;
  precio_anterior?: number | null;
  tipo_moneda?: string;
  mostrar_precio?: boolean;
}

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
  }[];
}

// Buscar categoría por slug
async function fetchCategoriaBySlug(slug: string): Promise<CategoriaWithProductos | null> {
  try {
    const categoria = await prisma.categoria_producto.findUnique({
      where: { slug, visible: true },
    });
    
    if (!categoria) return null;
    
    // Obtener productos de esta categoría
    const productos = await prisma.producto.findMany({
      where: { categoria_producto_id: categoria.id, visible: true },
      orderBy: { orden: 'asc' },
    });
    
    return {
      ...categoria,
      productos: productos.map((p) => ({
        id: p.id,
        titulo: p.titulo,
        slug: p.slug,
        descripcion: p.descripcion,
        descripcion_corta: p.descripcion_corta,
        icono: p.icono,
        imagen: p.imagen,
      })),
    };
  } catch (error) {
    console.error("Error fetching categoria:", error);
    return null;
  }
}

// Buscar producto por slug
async function fetchProductoBySlug(slug: string): Promise<ProductoDB | null> {
  try {
    const producto = await prisma.producto.findUnique({
      where: { slug, visible: true },
      include: {
        categoria: { select: { nombre: true, slug: true, descripcion: true, imagen: true } },
      },
    });
    
    if (!producto) return null;
    
    return {
      id: producto.id,
      titulo: producto.titulo,
      slug: producto.slug,
      descripcion: producto.descripcion,
      descripcion_corta: producto.descripcion_corta,
      icono: producto.icono,
      imagen: producto.imagen,
      visible: producto.visible,
      categoria_producto_id: producto.categoria_producto_id,
      categoria_nombre: producto.categoria?.nombre || undefined,
      categoria_slug: producto.categoria?.slug || undefined,
      categoria_descripcion: producto.categoria?.descripcion || undefined,
      categoria_imagen: producto.categoria?.imagen || undefined,
      // Precio
      precio: producto.precio ? Number(producto.precio) : null,
      precio_anterior: producto.precio_anterior ? Number(producto.precio_anterior) : null,
      tipo_moneda: producto.tipo_moneda,
      mostrar_precio: producto.mostrar_precio,
    };
  } catch (error) {
    console.error("Error fetching producto:", error);
    return null;
  }
}

async function fetchProductosRelacionados(excludeId: string, limit = 3): Promise<{slug: string, titulo: string}[]> {
  try {
    const productos = await prisma.producto.findMany({
      where: { id: { not: excludeId }, visible: true },
      select: { slug: true, titulo: true },
      take: limit,
      orderBy: { orden: 'asc' },
    });
    return productos.map((p) => ({ slug: p.slug, titulo: p.titulo }));
  } catch (error) {
    return [];
  }
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  
  // Primero buscar si es una categoría
  const categoria = await fetchCategoriaBySlug(slug);
  
  if (categoria) {
    return <CategoriaProductosPage categoria={categoria} />;
  }
  
  // No es categoría, buscar si es un producto
  const producto = await fetchProductoBySlug(slug);
  
  if (!producto) {
    notFound();
  }
  
  const productosRelacionados = await fetchProductosRelacionados(producto.id);

  const productoTransformado = {
    ...producto,
    descripcion_corta: producto.descripcion_corta ?? undefined,
    icono: producto.icono ?? undefined,
    imagen: producto.imagen ?? undefined,
    categoria: producto.categoria ?? undefined,
    categoria_producto_id: producto.categoria_producto_id ?? undefined,
  };

  return (
    <ProductoDetailClient 
      producto={productoTransformado} 
      productosRelacionados={productosRelacionados} 
    />
  );
}