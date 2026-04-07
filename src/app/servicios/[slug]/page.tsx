import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

// Datos estáticos de los servicios
const serviciosData: Record<string, {
  titulo: string;
  descripcion: string;
  descripcion_corta: string;
  categoria: string;
  features: string[];
  image: string;
}> = {
  "transformacion-digital": {
    titulo: "Transformación Digital & Arquitectura Empresarial",
    descripcion: "Diseñamos e implementamos la hoja de ruta tecnológica para tu empresa, asegurando que cada inversión en tecnología impulse el crecimiento del negocio. Nuestro equipo de expertos te acompaña en cada etapa de la transformación, desde el diagnóstico inicial hasta la implementación y seguimiento de resultados.\n\nUtilizamos metodologías probadas y mejores prácticas de arquitectura empresarial para crear soluciones escalables y sostenibles que se adaptan a las necesidades específicas de tu industria y mercado.",
    descripcion_corta: "Diseñamos e implementamos la hoja de ruta tecnológica para tu empresa",
    categoria: "consultoria",
    features: [
      "Diagnóstico digital empresarial",
      "Arquitectura de soluciones escalables",
      "Hoja de ruta de transformación",
      "Gestión del cambio organizacional",
      "Estrategia de datos y analytics",
      "Optimización de procesos",
    ],
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
  },
  "licencias-microsoft": {
    titulo: "Licencias Microsoft",
    descripcion: "Obtén las licencias que tu empresa necesita con soporte especializado y precios competitivos. Trabajamos con todo el portfolio de Microsoft para maximizar la productividad de tu equipo.\n\nComo partner autorizado de Microsoft, garantizamos licencias originales con soporte técnico especializado y asesoría para optimizar tu inversión en tecnología.",
    descripcion_corta: "Obtén las licencias que tu empresa necesita con soporte especializado",
    categoria: "software",
    features: [
      "Microsoft 365 para empresas",
      "Windows 10/11 Professional",
      "Azure Cloud Services",
      "Exchange Server",
      "SQL Server",
      "Soporte técnico especializado",
    ],
    image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=1200&q=80",
  },
  "antivirus-seguridad": {
    titulo: "Antivirus y Seguridad",
    descripcion: "Protege tu infraestructura tecnológica con soluciones de seguridad empresarial de vanguardia. Mantén tus datos seguros contra amenazas cibernéticas en un mundo cada vez más conectado.\n\nNuestro equipo de seguridad implementa soluciones integral que protegen todos los puntos de tu infraestructura, desde endpoints hasta servidores y redes.",
    descripcion_corta: "Protege tu infraestructura tecnológica con soluciones de seguridad empresarial",
    categoria: "seguridad",
    features: [
      "Antivirus empresariales",
      "Firewall y protección perimetral",
      "Gestión de identidades",
      "Protección contra ransomware",
      "Monitoreo 24/7",
      "Auditorías de seguridad",
    ],
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
  },
  "hardware-equipos": {
    titulo: "Hardware y Equipos",
    descripcion: "Equipamiento tecnológico de calidad para equipar tu oficina o empresa con las mejores marcas del mercado. Desde computadoras personales hasta servidores enterprise.\n\nTe asesoramos en la selección del equipo adecuado para cada necesidad, gestionamos la adquisición e implementación, y ofrecemos soporte post-venta.",
    descripcion_corta: "Equipamiento tecnológico de calidad de las mejores marcas",
    categoria: "hardware",
    features: [
      "Computadoras y laptops",
      "Servidores y networking",
      "Impresoras y multifuncionales",
      "Equipos de videoconferencia",
      "Mantenimiento preventivo",
      "Accesorios y periféricos",
    ],
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=80",
  },
  "desarrollo-software": {
    titulo: "Desarrollo de Software",
    descripcion: "Software a medida para optimizar tus procesos empresariales y impulsar tu transformación digital. Creamos soluciones que se adaptan exactamente a tus necesidades.\n\nNuestro equipo de desarrolladores utiliza tecnologías modernas y metodologías ágiles para entregar productos de alta calidad en tiempos óptimos.",
    descripcion_corta: "Software a medida para optimizar tus procesos empresariales",
    categoria: "software",
    features: [
      "Aplicaciones web",
      "Sistemas ERP/CRM",
      "Apps móviles (iOS/Android)",
      "Integraciones y APIs",
      "Automatización de procesos",
      "Mantenimiento y soporte",
    ],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
  },
  "consultoria-it": {
    titulo: "Consultoría IT",
    descripcion: "Asesoría especializada para planificar y ejecutar tu estrategia de transformación digital con resultados medibles. Te ayudamos a tomar decisiones informadas sobre tecnología.\n\nCon más de 15 años de experiencia en el mercado peruano, entendemos los desafíos específicos de las empresas locales y cómo abordarlos con soluciones tecnológicas efectivas.",
    descripcion_corta: "Asesoría especializada para planificar tu estrategia de transformación digital",
    categoria: "consultoria",
    features: [
      "Auditoría de sistemas",
      "Planificación estratégica IT",
      "Arquitectura de soluciones",
      "Gestión de proyectos",
      "Optimización de costos",
      "Capacitación de equipos",
    ],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
  },
  "capacitacion": {
    titulo: "Docencia y Capacitación",
    descripcion: "Entrenamiento para tu equipo en las herramientas tecnológicas que usan diario para maximizar su productividad. Programas adaptados a tu industria y nivel de los participantes.\n\nNuestros programas de capacitación son prácticos y orientados a resultados, asegurando que tu equipo pueda aplicar inmediatamente lo aprendido.",
    descripcion_corta: "Entrenamiento para maximizar la productividad de tu equipo",
    categoria: "capacitacion",
    features: [
      "Microsoft 365",
      "Herramientas de productividad",
      "Ciberseguridad básica",
      "Gestión de proyectos",
      "Análisis de datos",
      "Programación básica",
    ],
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80",
  },
};

// Lista de slugs válidos
const slugsValidos = Object.keys(serviciosData);

// Servicios relacionados (para mostrar en sidebar)
const serviciosRelacionados = [
  { slug: "licencias-microsoft", titulo: "Licencias Microsoft", descripcion_corta: "Licencias originales Microsoft" },
  { slug: "antivirus-seguridad", titulo: "Antivirus y Seguridad", descripcion_corta: "Soluciones de seguridad" },
  { slug: "hardware-equipos", titulo: "Hardware y Equipos", descripcion_corta: "Equipos de última generación" },
];

export default async function ServicioPage({ params }: Props) {
  const { slug } = await params;

  // Validar que el slug existe
  if (!slugsValidos.includes(slug)) {
    notFound();
  }

  const servicio = serviciosData[slug];

  return (
    <>
      {/* Header con imagen de fondo */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <img 
            src={servicio.image} 
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
            {servicio.descripcion_corta}
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

              {/* Características */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-primary mb-6">
                  ¿Qué incluye este servicio?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicio.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg"
                    >
                      <svg className="w-5 h-5 text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>
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
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                    Otros servicios
                  </h4>
                  <div className="space-y-3">
                    {serviciosRelacionados.filter(s => s.slug !== slug).map((srv) => (
                      <Link
                        key={srv.slug}
                        href={`/servicios/${srv.slug}`}
                        className="block p-4 bg-white border border-slate-200 rounded-lg hover:border-accent hover:shadow-md transition-all"
                      >
                        <h5 className="font-semibold text-primary text-sm">
                          {srv.titulo}
                        </h5>
                        <p className="text-xs text-text-secondary mt-1">
                          {srv.descripcion_corta}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

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
  return slugsValidos.map((slug) => ({ slug }));
}