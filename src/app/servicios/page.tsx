import Link from "next/link";
import { db } from "@/lib/db";
import sql from "@/lib/db";

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
    icon: string | null;
    imagen: string | null;
    tamanho: string;
  }[];
}

async function getCategoriasConServicios(): Promise<CategoriaWithServicios[]> {
  try {
    // Obtener categorías padre visibles
    const categorias = await db.categorias_servicios.findAll(true);
    
    if (!categorias || categorias.length === 0) {
      console.log("No hay categorías en BD");
      return [];
    }
    
    // Para cada categoría, obtener sus servicios visibles
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
            icon: s.icono,
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

  if (categorias.length === 0) {
    return (
      <div className="pt-0">
        <section className="relative h-[50vh] min-h-[400px] flex items-center">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80" 
              alt="Servicios de tecnología" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/85" />
          </div>
          <div className="relative container-custom">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Nuestros Servicios
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Soluciones integrales de tecnología para impulsar la 
              transformación digital de tu empresa en Perú
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

  return (
    <div className="pt-0">
      {/* Header con imagen de fondo */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80" 
            alt="Servicios de tecnología" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="relative container-custom">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Nuestros Servicios
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Soluciones integrales de tecnología para impulsar la 
            transformación digital de tu empresa en Perú
          </p>
        </div>
      </section>

      {/* Categorías con Servicios */}
      {categorias.map((categoria, catIndex) => (
        <section 
          key={categoria.id} 
          id={categoria.slug}
          className={`py-24 ${catIndex % 2 === 0 ? 'bg-white' : 'bg-bg-light'}`}
        >
          <div className="container-custom">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
              catIndex % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}>
              {/* Imagen al lado derecho */}
              <div className={catIndex % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  {categoria.imagen ? (
                    <img 
                      src={categoria.imagen}
                      alt={categoria.nombre}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-6xl font-bold">{categoria.nombre.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className={catIndex % 2 === 1 ? 'lg:order-2' : ''}>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  {categoria.nombre}
                </h2>
                {categoria.descripcion && (
                  <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                    {categoria.descripcion}
                  </p>
                )}

                {/* Lista de servicios de esta categoría */}
                {categoria.servicios.length > 0 && (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    {categoria.servicios.slice(0, 6).map((servicio, i) => (
                      <li key={servicio.id} className="flex items-center gap-3 text-text-secondary">
                        <svg className="w-5 h-5 text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <Link 
                          href={`/servicios/${servicio.slug}`}
                          className="hover:text-accent transition-colors"
                        >
                          {servicio.titulo}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Link "Ver más detalles" */}
                {categoria.link && (
                  <Link 
                    href={categoria.link}
                    className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-4 transition-all"
                  >
                    Ver más detalles
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
            Contáctanos y te asesoramos para encontrar la 
            perfecta para tu empresa.
          </p>
          <Link 
            href="/contacto" 
            className="inline-flex items-center justify-center bg-accent text-primary font-semibold px-8 py-4 rounded-lg hover:bg-accent/90 transition-all"
          >
            Hablemos de tu proyecto
          </Link>
        </div>
      </section>
    </div>
  );
}