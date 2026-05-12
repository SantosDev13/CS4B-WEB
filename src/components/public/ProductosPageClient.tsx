"use client";

import Link from "next/link";
import ProductoCard from "@/components/public/ProductoCard";
import { Search, Filter, ChevronRight } from "lucide-react";

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
    // Precio
    precio?: number | null;
    precio_anterior?: number | null;
    tipo_moneda?: string;
    mostrar_precio?: boolean;
  }[];
}

interface ProductosPageClientProps {
  categorias: CategoriaWithProductos[];
  allProductos: any[];
}

export default function ProductosPageClient({ categorias, allProductos }: ProductosPageClientProps) {
  const totalProductos = categorias.reduce((acc, cat) => acc + cat.productos.length, 0);

  if (categorias.length === 0) {
    return (
      <div className="min-h-screen bg-bg-light pt-0">
        <section className="relative bg-primary py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
              alt="Oficina corporativa"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/85 bg-gradient-to-r from-primary/90 to-primary/70" />
          </div>
          <div className="container-custom relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Todos nuestros productos
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl">
              Encuentra la solución perfecta para tu empresa.
            </p>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container-custom text-center">
            <p className="text-lg text-text-secondary">
              No hay productos disponibles actualmente.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light pt-0">
      {/* Header */}
      <section className="relative bg-primary py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt="Oficina corporativa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Todos nuestros productos
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl">
            Encuentra la solución perfecta para tu empresa.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-primary">Inicio</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-text-secondary">Productos</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border p-4 sticky top-24">
              <h2 className="font-semibold text-primary mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Categorías
              </h2>
              <ul className="space-y-1">
                {categorias.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/productos/${cat.slug}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-bg-light transition-colors text-text-secondary hover:text-primary"
                    >
                      <span className="text-sm">{cat.nombre}</span>
                      <span className="text-xs bg-bg-light px-2 py-0.5 rounded-full">
                        {cat.productos.length}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            
            {/* Categorías */}
            {categorias.map((categoria) => (
              <section key={categoria.id} id={`cat-${categoria.slug}`} className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <Link
                    href={`/productos/${categoria.slug}`}
                    className="text-2xl font-bold text-primary flex items-center gap-3 hover:text-secondary transition-colors"
                  >
                    {categoria.nombre}
                    <span className="text-sm font-normal text-text-muted bg-white px-3 py-1 rounded-full border">
                      {categoria.productos.length} productos
                    </span>
                  </Link>
                </div>

                {categoria.productos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoria.productos.map((producto) => (
                      <ProductoCard
                        key={producto.id}
                        producto={{
                          ...producto,
                          categoria_nombre: categoria.nombre,
                          categoria_slug: categoria.slug,
                        }}
                        categoriaNombre={categoria.nombre}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border p-8 text-center">
                    <p className="text-text-muted">No hay productos en esta categoría</p>
                  </div>
                )}
              </section>
            ))}

            {/* Otros productos */}
            {allProductos.filter((p: any) => !p.categoria_nombre).length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-primary mb-4">Otros productos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allProductos
                    .filter((p: any) => !p.categoria_nombre)
                    .map((producto: any) => (
                      <ProductoCard
                        key={producto.id}
                        producto={producto}
                      />
                    ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      {/* CTA final */}
      <section className="bg-primary py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
            Contáctanos y te asesoramos.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center bg-accent text-primary font-semibold px-8 py-4 rounded-lg hover:bg-accent/90 transition-all hover:scale-105"
          >
            Hablemos de tu proyecto
          </Link>
        </div>
      </section>
    </div>
  );
}