import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import sql from "@/lib/db";

interface Props {
  params: Promise<{ slug: string }>;
}

interface ServicioDB {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  icon: string | null;
  imagen: string | null;
  categoria_servicio_id: string | null;
  visible: boolean;
  categoria_nombre?: string;
  categoria_slug?: string;
}

async function getServicioBySlug(slug: string): Promise<ServicioDB | null> {
  try {
    const result = await sql`
      SELECT s.*, cs.nombre as categoria_nombre, cs.slug as categoria_slug
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
    <>
      {/* Header con imagen de fondo */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <img 
            src={servicio.imagen || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"} 
            alt={servicio.titulo} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80" />
        </div>
        
        {/* Breadcrumb */}
        <div className="absolute top-24 left-0 right-0">
          <div className="container-custom">
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-4">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <span>/</span>
              <Link href="/servicios" className="hover:text-white transition-colors">Servicios</Link>
              {servicio.categoria_nombre && (
                <>
                  <span>/</span>
                  <Link href={`/servicios#${servicio.categoria_slug}`} className="hover:text-white transition-colors">
                    {servicio.categoria_nombre}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-white">{servicio.titulo}</span>
            </nav>
          </div>
        </div>

        <div className="relative container-custom pt-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {servicio.titulo}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            {servicio.descripcion.substring(0, 100)}...
          </p>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Descripción principal */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
                Acerca del servicio
              </h2>
              <div className="prose prose-lg max-w-none text-text-secondary">
                <p className="text-lg leading-relaxed whitespace-pre-line">
                  {servicio.descripcion}
                </p>
              </div>

              {/* ¿Por qué elegirnos? */}
              <div className="mt-12 p-8 bg-gradient-to-r from-primary to-primary/80 rounded-2xl text-white">
                <h3 className="text-xl font-bold mb-4">¿Por qué elegir CS4B?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Más de 15 años de experiencia en el mercado peruano</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Equipo técnico certificado y en constante capacitación</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Soporte técnico personalizado y respuesta rápida</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Soluciones adaptadas a las necesidades de tu empresa</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Card de contacto */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-lg font-bold text-primary mb-4">
                    ¿Interesado en este servicio?
                  </h3>
                  <p className="text-text-secondary mb-6">
                    Contáctanos y te compartimos más información sobre esta solución.
                  </p>
                  <Link 
                    href="/contacto"
                    className="block w-full text-center bg-accent text-primary font-semibold py-3 px-6 rounded-lg hover:bg-accent/90 transition-all"
                  >
                    Solicitar información
                  </Link>
                </div>

                {/* Otros servicios */}
                {serviciosRelacionados.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                      Otros servicios
                    </h4>
                    <div className="space-y-3">
                      {serviciosRelacionados.map((srv) => (
                        <Link
                          key={srv.slug}
                          href={`/servicios/${srv.slug}`}
                          className="block p-4 bg-white border border-slate-200 rounded-lg hover:border-accent hover:shadow-md transition-all"
                        >
                          <h5 className="font-semibold text-primary text-sm">
                            {srv.titulo}
                          </h5>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Volver a servicios */}
                <div className="mt-6">
                  <Link 
                    href="/servicios"
                    className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Ver todos los servicios
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            ¿Necesitas ayuda para elegir el servicio adecuado?
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Nuestro equipo está listo para ayudarte a encontrar la mejor solución para tu empresa.
          </p>
          <Link 
            href="/contacto"
            className="inline-flex items-center justify-center bg-accent text-primary font-semibold px-8 py-4 rounded-lg hover:bg-accent/90 transition-all"
          >
            Hablemos
          </Link>
        </div>
      </section>
    </>
  );
}

// Generar parámetros estáticos para SSG
export async function generateStaticParams() {
  try {
    const servicios = await db.servicios.findAll(true, 100, 0);
    return servicios.map((s) => ({ slug: s.slug }));
  } catch (error) {
    return [];
  }
}