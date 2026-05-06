import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-static";
export const revalidate = false;

// DATOS DE LOS SERVICIOS - Edita aquí la lista
const servicios = [
  {
    carpeta: "consultoria",
    titulo: "Consultoría",
    subtitulo: "Asesoría estratégica para transformar tu negocio",
    descripcion: "Te ayudamos a identificar oportunidades de mejora y diseñar la hoja de ruta perfecta para tu empresa.",
    color: "#3d79e2",
  },
  {
    carpeta: "desarrollo",
    titulo: "Desarrollo",
    subtitulo: "Software a medida para tus necesidades",
    descripcion: "Creamos soluciones de software personalizadas que se adaptan perfectamente a tus procesos de negocio.",
    color: "#10b981",
  },
  {
    carpeta: "infraestructura",
    titulo: "Infraestructura",
    subtitulo: "Infraestructura robusta y escalable",
    descripcion: "Diseñamos e implementamos la infraestructura tecnológica que tu empresa necesita para crecer.",
    color: "#8b5cf6",
  },
  {
    carpeta: "seguridad",
    titulo: "Seguridad",
    subtitulo: "Protección integral para tus datos",
    descripcion: "Protegemos tus activos más valiosos con soluciones de ciberseguridad de nivel empresarial.",
    color: "#ef4444",
  },
  {
    carpeta: "soporte",
    titulo: "Soporte",
    subtitulo: "Asistencia técnica especializada",
    descripcion: "Equipo de soporte disponible 24/7 para resolver cualquier incidencia.",
    color: "#f59e0b",
  },
];

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">
              Soluciones Profesionales
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
              Nuestros <span className="text-cyan-400">Servicios</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Descubre cómo podemos transformar tu negocio con soluciones tecnológicas integrales.
            </p>
          </div>
        </div>
      </section>

      {/* Lista de servicios - Cards horizontales de arriba a abajo */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-6">
            {servicios.map((servicio) => (
              <div
                key={servicio.carpeta}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Imagen / Miniatura */}
                  <div className="md:w-64 h-48 md:h-auto relative bg-gradient-to-br from-slate-100 to-slate-200">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-24 h-24 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${servicio.color}20` }}
                      >
                        <span
                          className="text-4xl font-bold"
                          style={{ color: servicio.color }}
                        >
                          {servicio.titulo.charAt(0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    <div
                      className="w-12 h-1 mb-3"
                      style={{ backgroundColor: servicio.color }}
                    />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {servicio.titulo}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {servicio.subtitulo}
                    </p>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                      {servicio.descripcion}
                    </p>
                    <div>
                      <Link
                        href={`/servicios/${servicio.carpeta}`}
                        className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                        style={{ color: servicio.color }}
                      >
                        Ver detalles
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}