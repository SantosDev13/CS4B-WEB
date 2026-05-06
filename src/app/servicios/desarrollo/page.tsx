import Link from "next/link";
import { ContactForm } from "@/components/ui";

export const dynamic = "force-static";
export const revalidate = false;

// DATOS DEL SERVICIO - Edita aquí directamente
const servicio = {
  titulo: "Desarrollo",
  subtitulo: "Software a medida para tus necesidades",
  descripcion: "Creamos soluciones de software personalizadas que se adaptan perfectamente a tus procesos de negocio. Desde aplicaciones web hasta sistemas enterprise, nuestro equipo entrega código de calidad.",
  color: "#10b981",
};

export default function DesarrolloPage() {
  const { titulo, subtitulo, descripcion, color } = servicio;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-1 mx-auto mb-6" style={{ backgroundColor: color }} />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {titulo}
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              {subtitulo}
            </p>
            <Link
              href="#contacto"
              className="inline-block px-8 py-3 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: color, color: "white" }}
            >
              Solicitar información
            </Link>
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

      {/* Sección de contacto */}
      <section id="contacto" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">¿Interesado?</h2>
            <p className="text-gray-600">Contáctanos para discutir tu proyecto</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-xl">
            <ContactForm />
          </div>
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