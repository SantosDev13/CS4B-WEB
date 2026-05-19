import Link from "next/link";
import { ContactForm, FAQ } from "@/components/ui";

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

// BENEFICIOS DEL SERVICIO
const beneficios = [
  {
    titulo: "Diagnóstico integral",
    descripcion: "Evaluamos tu estado actual para identificar oportunidades de mejora y diseñar una hoja de ruta personalizada.",
  },
  {
    titulo: "Diseño de arquitectura",
    descripcion: "Creamos una estructura tecnológica escalable que se adapta al crecimiento de tu empresa.",
  },
  {
    titulo: "Implementación guiada",
    descripcion: "Te acompañamos en cada paso de la transformación con metodologías probadas.",
  },
  {
    titulo: "Capacitación del equipo",
    descripcion: "Aseguramos que tu equipo adopte las nuevas herramientas y procesos efectivamente.",
  },
];

// PREGUNTAS FRECUENTES
const faqs = [
  {
    pregunta: "¿Cuánto tiempo toma un proyecto de transformación digital?",
    respuesta: "El tiempo varía según la magnitud del proyecto. Un diagnóstico inicial toma aproximadamente 2-3 semanas, mientras que la implementación completa puede variar de 3 a 12 meses dependiendo de la complejidad y los objetivos definidos.",
  },
  {
    pregunta: "¿Necesito tener una empresa grande para adoptar transformación digital?",
    respuesta: "No, la transformación digital es para empresas de cualquier tamaño. Adaptamos nuestras soluciones a las necesidades y recursos de cada cliente, desde pequeñas empresas hasta grandes corporaciones.",
  },
  {
    pregunta: "¿Qué incluye el servicio de arquitectura empresarial?",
    respuesta: "Incluye análisis de procesos actuales, diseño de la visión tecnológica, roadmap de implementación, selección de tecnologías, governance de datos y estructura organizacional necesaria para soportar la transformación.",
  },
  {
    pregunta: "¿Ofrecen soporte después de la implementación?",
    respuesta: "Sí, ofrecemos planes de soporte continuo que incluyen monitoreo, optimización, actualizaciones y asistencia técnica para garantizar el éxito a largo plazo de tu transformación digital.",
  },
  {
    pregunta: "¿Cómo se mide el retorno de inversión en transformación digital?",
    respuesta: "Definimos KPIs personalizados desde el inicio del proyecto: reducción de costos operativos, increase de productividad, mejora en experiencia del cliente, tiempos de respuesta más rápidos y otros indicadores relevantes para tu industria.",
  },
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


      {/* Beneficios */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm text-gray-500 mb-2">¿POR QUÉ ELEGIRNOS?</p>
            <h2 className="text-3xl font-bold text-gray-900">Beneficios de nuestro servicio</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{index + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {beneficio.titulo}
                </h3>
                <p className="text-gray-600 text-sm">
                  {beneficio.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario separado - debajo del hero */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¿Interesado en este servicio?
            </h2>
            <p className="text-gray-600">
              Completa el formulario y te contactaremos
            </p>
          </div>
          <ContactForm />
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



      {/* Preguntas Frecuentes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <FAQ
            subtitulo="CONTÁCTANOS"
            titulo="PREGUNTAS FRECUENTES"
            items={faqs}
          />
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