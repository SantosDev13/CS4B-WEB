import Link from "next/link";

const posts = [
  {
    id: 1,
    title: "Cómo transformar digitalmente tu pyme en Perú",
    excerpt: "Descubre las estrategias que están usando las empresas peruanas para competir en el mercado digital. Desde la adopción de herramientas en la nube hasta la automatización de procesos.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    slug: "transformacion-digital-pyme-peru",
    date: "15 Mar 2026",
    category: "Transformación Digital",
  },
  {
    id: 2,
    title: "Microsoft 365: Todo lo que tu empresa necesita",
    excerpt: "Una guía completa sobre las herramientas de Microsoft para mejorar la productividad de tu equipo. Word, Excel, Teams y más.",
    image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=600&q=80",
    slug: "microsoft-365-guia-completa",
    date: "10 Mar 2026",
    category: "Productos",
  },
  {
    id: 3,
    title: "Ciberseguridad: Protege tu negocio en línea",
    excerpt: "Los principales amenazas cibernéticas para empresas en Perú y cómo prevenirlas. Tips de seguridad para tu infraestructura IT.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80",
    slug: "ciberseguridad-empresas-peru",
    date: "5 Mar 2026",
    category: "Seguridad",
  },
  {
    id: 4,
    title: "Cloud Computing: El futuro de los negocios",
    excerpt: "Por qué migrar a la nube es esencial para las empresas modernas. Ventajas, beneficios y casos de éxito en Perú.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    slug: "cloud-computing-futuro-negocios",
    date: "28 Feb 2026",
    category: "Tecnología",
  },
  {
    id: 5,
    title: "Cómo elegir el mejor software para tu empresa",
    excerpt: "Guía práctica para seleccionar herramientas tecnológicas que se adapten a las necesidades de tu negocio.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    slug: "elegir-software-empresa",
    date: "20 Feb 2026",
    category: "Consultoría",
  },
  {
    id: 6,
    title: "Importancia del respaldo de datos para empresas",
    excerpt: "Por qué todo negocio necesita una estrategia de backup. Protege tu información crítica contra pérdida de datos.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
    slug: "respaldo-datos-empresas",
    date: "15 Feb 2026",
    category: "Seguridad",
  },
];

const categories = [
  "Todos",
  "Transformación Digital",
  "Productos",
  "Seguridad",
  "Tecnología",
  "Consultoría",
];

export default function BlogPage() {
  return (
    <div className="pt-0">
      {/* Header con imagen de fondo */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&q=80" 
            alt="Blog de tecnología" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="relative container-custom">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Blog
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Noticias, consejos y tendencias sobre tecnología y 
            transformación digital para empresas peruanas
          </p>
        </div>
      </section>

      {/* Categories - Minimal style */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-custom py-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "Todos"
                    ? "bg-primary text-white"
                    : "bg-bg-light text-text-secondary hover:bg-primary hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid - Estilo BCG: cards con imágenes grandes */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="group">
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-medium text-white bg-primary/80 px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-text-secondary">
                      {post.date}
                    </span>
                    <h2 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-text-secondary line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Pagination - Minimal */}
          <div className="flex justify-center mt-16">
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center">
                1
              </button>
              <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-colors">
                2
              </button>
              <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-colors">
                3
              </button>
              <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Suscríbete a nuestro newsletter
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
            Recibe las últimas noticias y consejos sobre tecnología 
            directamente en tu correo.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-5 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-accent"
            />
            <button 
              type="submit" 
              className="px-8 py-4 rounded-lg bg-accent text-primary font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
