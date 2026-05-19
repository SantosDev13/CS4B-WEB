import Link from "next/link";
import { ContactForm } from "@/components/ui";

export const dynamic = "force-static";
export const revalidate = false;

// DATOS DEL SERVICIO - Edita aquí directamente
const servicio = {
  titulo: "Transformación Digital & Arquitectura Empresarial",
  subtitulo: "Asesoría estratégica para transformar tu negocio",
  descripcion: "Te ayudamos a identificar oportunidades de mejora y diseñar la hoja de ruta perfecta para tu empresa. Nuestro equipo de expertos analiza tu situación actual y propone soluciones personalizadas.",
  imagenHero: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80",
};

// MÉTRICAS DEL SERVICIO
const metricas = [
  { valor: "10+", label: "Años de experiencia" },
  { valor: "500+", label: "Proyectos completados" },
  { valor: "98%", label: "Satisfacción del cliente" },
  { valor: "24/7", label: "Soporte disponible" },
];

export default function ConsultoriaPage() {
  const { titulo, subtitulo, descripcion } = servicio;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero con imagen de fondo */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img
            src={servicio.imagenHero}
            alt="Transformación Digital"
            className="w-full h-full object-cover"
          />
          {/* Overlay gris */}
          <div className="absolute inset-0 bg-gray-900/70" />
        </div>

        {/* Contenido */}
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {titulo}
            </h1>
            <p className="text-xl text-slate-200 mb-12">
              {subtitulo}
            </p>

            {/* Métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/20">
              {metricas.map((metrica, index) => (
                <div key={index} className="text-left">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {metrica.valor}
                  </div>
                  <div className="text-sm text-slate-300">
                    {metrica.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Descripción */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sobre el servicio</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {descripcion}
          </p>
        </div>
      </section>

      

      {/* Footer minimal */}
      <footer className="py-8 bg-slate-900 text-center">
        <Link href="/servicios" className="text-slate-400 hover:text-white">
          ← Volver a servicios
        </Link>
      </footer>
    </div>
  );
}