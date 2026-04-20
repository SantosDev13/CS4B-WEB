import Link from "next/link";
import { db } from "@/lib/db";
import sql from "@/lib/db";
import { Search, Filter, ChevronRight } from "lucide-react";

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

  // Obtener todos los servicios para el listado general
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

if (categorias.length === 0) {
    return (
      <div className="min-h-screen bg-bg-light pt-0">
        {/* Header - Grande con imagen de fondo */}
        <section className="relative bg-primary py-20 md:py-28 overflow-hidden">
          {/* Imagen de fondo */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80" 
              alt="Oficina corporativa"
              className="w-full h-full object-cover"
            />
            {/* Overlay oscuro para legibilidad */}
            <div className="absolute inset-0 bg-primary/85 bg-gradient-to-r from-primary/90 to-primary/70" />
          </div>
          
          {/* Contenido */}
          <div className="container-custom relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Todos nuestros servicios
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl">
              Encuentra la solución perfecta para tu empresa. Ofrecemos servicios de consultoría IT, desarrollo de software, infraestructura y más.
            </p>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container-custom text-center">
            <p className="text-lg text-text-secondary">
              No hay servicios disponibles actualmente. Vuelve pronto.
            </p>
          </div>
        </section>
      </div>
    );
  }

  // Contar total de servicios
  const totalServicios = categorias.reduce((acc, cat) => acc + cat.servicios.length, 0);

  return (
      <div className="min-h-screen bg-bg-light pt-0">
      {/* Header - Grande con imagen de fondo */}
      <section className="relative bg-primary py-20 md:py-28 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80" 
            alt="Oficina corporativa"
            className="w-full h-full object-cover"
          />
          {/* Overlay oscuro para legibilidad */}
          <div className="absolute inset-0 bg-primary/85 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        
        {/* Contenido */}
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Todos nuestros servicios
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl">
            Encuentra la solución perfecta para tu empresa. Ofrecemos servicios de consultoría IT, desarrollo de software, infraestructura y más.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-primary">Inicio</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-text-secondary">Servicios</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar con categorías */}
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
                        href={`/servicios/${cat.slug}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-bg-light transition-colors text-text-secondary hover:text-primary"
                      >
                        <span className="text-sm">{cat.nombre}</span>
                        <span className="text-xs bg-bg-light px-2 py-0.5 rounded-full">
                          {cat.servicios.length}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* Info bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-text-secondary">
                Mostrando <span className="font-semibold text-primary">{totalServicios}</span> servicios
              </p>
            </div>

            {/* Categorías como secciones estilo e-commerce */}
            {categorias.map((categoria, catIndex) => (
              <section 
                key={categoria.id} 
                id={`cat-${categoria.slug}`}
                className="mb-12"
              >
                {/* Título de categoría con enlace a página individual */}
                <div className="flex items-center justify-between mb-4">
                  <Link 
                    href={`/servicios/${categoria.slug}`}
                    className="text-2xl font-bold text-primary flex items-center gap-3 hover:text-secondary transition-colors"
                  >
                    {categoria.nombre}
                    <span className="text-sm font-normal text-text-muted bg-white px-3 py-1 rounded-full border">
                      {categoria.servicios.length} servicios
                    </span>
                  </Link>
                </div>

                {/* Grid de servicios */}
                {categoria.servicios.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoria.servicios.map((servicio) => (
                      <Link
                        key={servicio.id}
                        href={`/servicios/${servicio.slug}`}
                        className="group bg-white rounded-xl border hover:shadow-lg transition-all duration-300 overflow-hidden"
                      >
                        {/* Imagen del servicio */}
                        <div className="aspect-[16/10] bg-gradient-to-br from-primary to-primary-light relative overflow-hidden">
                          {servicio.imagen ? (
                            <img
                              src={servicio.imagen}
                              alt={servicio.titulo}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-white/30 text-5xl font-bold">
                                {servicio.titulo.charAt(0)}
                              </span>
                            </div>
                          )}
                          {/* Overlay con botón */}
                          <div className="absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-sm">
                              Ver detalles
                            </span>
                          </div>
                        </div>

                        {/* Contenido del card */}
                        <div className="p-4">
                          <h3 className="font-semibold text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-1">
                            {servicio.titulo}
                          </h3>
                          <p className="text-sm text-text-secondary line-clamp-2">
                            {servicio.descripcion_corta || servicio.descripcion?.substring(0, 100) + '...'}
                          </p>
                          
                          {/* Footer del card */}
                          <div className="mt-4 pt-3 border-t flex items-center justify-between">
                            <span className="text-xs text-text-muted">
                              {categoria.nombre}
                            </span>
                            <span className="text-xs text-secondary font-medium">
                              Ver más →
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border p-8 text-center">
                    <p className="text-text-muted">
                      No hay servicios en esta categoría
                    </p>
                  </div>
                )}
              </section>
            ))}

            {/* Servicios sin categoría */}
            {allServicios.filter(s => !s.categoria_nombre).length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Otros servicios
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allServicios.filter(s => !s.categoria_nombre).map((servicio: any) => (
                    <Link
                      key={servicio.id}
                      href={`/servicios/${servicio.slug}`}
                      className="group bg-white rounded-xl border hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      <div className="aspect-[16/10] bg-gradient-to-br from-cyan-500 to-blue-600 relative">
                        {servicio.imagen ? (
                          <img
                            src={servicio.imagen}
                            alt={servicio.titulo}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white/30 text-5xl font-bold">
                              {servicio.titulo.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-primary mb-2 group-hover:text-secondary">
                          {servicio.titulo}
                        </h3>
                        <p className="text-sm text-text-secondary line-clamp-2">
                          {servicio.descripcion_corta || servicio.descripcion?.substring(0, 80) + '...'}
                        </p>
                      </div>
                    </Link>
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
            Contáctanos y te asesoramos para encontrar la 
            solución perfecta para tu empresa.
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