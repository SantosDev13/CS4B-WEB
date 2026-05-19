import Link from "next/link";
import { ArrowRight } from "lucide-react";

const servicios = [
  {
    numero: "01",
    titulo: "Transformación Digital & Arquitectura Empresarial",
    descripcion:
      "Te acompañamos en la definición de tu visión empresarial y el diseño de hojas de ruta personalizadas. Analizamos tu situación actual, identificamos oportunidades de crecimiento y desarrollamos estrategias que se traducen en resultados tangibles.",
    color: "text-blue-500",
    bg: "from-blue-500/20 to-blue-600/10",
    link: "/servicios/transformacion-digital",
    imagen: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
  {
    numero: "02",
    titulo: "Desarrollo de Software",
    descripcion:
      "Creamos soluciones tecnológicas a la medida de tu negocio. Desde aplicaciones web hasta sistemas empresariales complejos, nuestro equipo de desarrolladores transforma tus necesidades en herramientas digitales que optimizan tus procesos.",
    color: "text-emerald-500",
    bg: "from-emerald-500/20 to-emerald-600/10",
    link: "/servicios/desarrollo",
    imagen: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  },
  {
    numero: "03",
    titulo: "Infraestructura Tecnológica",
    descripcion:
      "Diseñamos e implementamos la base tecnológica que tu empresa necesita para escalar. Servidores, redes, nube y soluciones de almacenamiento diseñadas para garantizar rendimiento, seguridad y disponibilidad.",
    color: "text-violet-500",
    bg: "from-violet-500/20 to-violet-600/10",
    link: "/servicios/infraestructura",
    imagen: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
  },
  {
    numero: "04",
    titulo: "Ciberseguridad",
    descripcion:
      "Protegemos tus activos más valiosos con soluciones integrales de seguridad. Evaluamos vulnerabilidades, implementamos controles y vigilamos continuamente tu infraestructura para mantener tus datos a salvo.",
    color: "text-red-500",
    bg: "from-red-500/20 to-red-600/10",
    link: "/servicios/seguridad",
    imagen: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
  },
  {
    numero: "05",
    titulo: "Soporte Técnico",
    descripcion:
      "Tu equipo merece asistencia inmediata cuando surg problemas. Nuestro servicio de soporte técnico está disponible 24/7 para resolver incidencias, mantener tus sistemas funcionando y minimizar el downtime.",
    color: "text-amber-500",
    bg: "from-amber-500/20 to-amber-600/10",
    link: "/servicios/soporte",
    imagen: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
  },
];

export default function ServiciosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 bg-slate-900 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Nuestros Servicios</h1>
        <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
          Soluciones tecnológicas integrales para hacer crecer tu negocio
        </p>
      </section>

      {/* Lista de servicios */}
      <section>
        {servicios.map((servicio, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={servicio.numero}
              className="group py-24 px-8 border-b border-gray-100 hover:bg-gray-50/80 hover:shadow-md transition-all duration-300"
            >
              <div className={`max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                {/* Izquierda: Número, Título, Descripción */}
                <div className="flex-1 text-center md:text-left">
                  <span className="text-6xl font-bold text-gray-200 group-hover:text-lime-500/30 transition-colors">
                    {servicio.numero}
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900 group-hover:text-lime-500 mt-2 transition-colors duration-300">
                    {servicio.titulo}
                  </h2>
                  <p className="text-gray-600 mt-4 leading-relaxed">
                    {servicio.descripcion}
                  </p>
                  <Link
                    href={servicio.link}
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-lime-500 text-white font-medium rounded-lg opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hover:bg-lime-600"
                  >
                    Ver servicio
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Derecha: Imagen */}
                <div className="w-full md:w-96 h-80 rounded-xl overflow-hidden">
                  <img
                    src={servicio.imagen}
                    alt={servicio.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}