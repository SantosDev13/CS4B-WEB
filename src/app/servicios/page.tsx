import Link from "next/link";

const services = [
  {
    id: "licencias-microsoft",
    title: "Licencias Microsoft",
    description: "Obtén las licencias que tu empresa necesita con soporte especializado y precios competitivos. Trabajamos con todo el portfolio de Microsoft para maximizar la productividad de tu equipo.",
    features: [
      "Microsoft 365 para empresas",
      "Windows 10/11 Professional",
      "Azure Cloud Services",
      "Exchange Server",
      "SQL Server",
      "Soporte técnico especializado",
    ],
    image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&q=80",
  },
  {
    id: "antivirus",
    title: "Antivirus y Seguridad",
    description: "Protege tu infraestructura tecnológica con soluciones de seguridad empresarial de vanguardia. Mantén tus datos seguros contra amenazas cibernéticas.",
    features: [
      "Antivirus empresariales",
      "Firewall y protección perimetral",
      "Gestión de identidades",
      "Protección contra ransomware",
      "Monitoreo 24/7",
      "Auditorías de seguridad",
    ],
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
  },
  {
    id: "hardware",
    title: "Hardware y Equipos",
    description: "Equipamiento tecnológico de calidad para equipar tu oficina o empresa con las mejores marcas del mercado.",
    features: [
      "Computadoras y laptops",
      "Servidores y networking",
      "Impresoras y multifuncionales",
      "Equipos de videoconferencia",
      "Accesorios y periféricos",
      "Mantenimiento preventivo",
    ],
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
  },
  {
    id: "desarrollo-software",
    title: "Desarrollo de Software",
    description: "Software a medida para optimizar tus procesos empresariales y impulsar tu transformación digital.",
    features: [
      "Aplicaciones web",
      "Sistemas ERP/CRM",
      "Apps móviles (iOS/Android)",
      "Integraciones y APIs",
      "Automatización de procesos",
      "Mantenimiento y soporte",
    ],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  },
  {
    id: "consultoria-it",
    title: "Consultoría IT",
    description: "Asesoría especializada para planificar y ejecutar tu estrategia de transformación digital con resultados medibles.",
    features: [
      "Auditoría de sistemas",
      "Planificación estratégica IT",
      "Arquitectura de soluciones",
      "Gestión de proyectos",
      "Optimización de costos",
      "Capacitación de equipos",
    ],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
  {
    id: "capacitacion",
    title: "Capacitación",
    description: "Entrenamiento para tu equipo en las herramientas tecnológicas que usan diario para maximizar su productividad.",
    features: [
      "Microsoft 365",
      "Herramientas de productividad",
      "Ciberseguridad básica",
      "Gestión de proyectos",
      "Análisis de datos",
      "Programación básica",
    ],
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
  },
];

export default function ServiciosPage() {
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

      {/* Services List - Estilo BCG: alternando imagen y texto */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                id={service.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                    {service.title}
                  </h2>
                  <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-text-secondary">
                        <svg className="w-5 h-5 text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href="/contacto" 
                    className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-4 transition-all"
                  >
                    Solicitar información
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>

                {/* Image - Estilo BCG */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
            Contáctanos y te asesoramos para encontrar la solución 
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
