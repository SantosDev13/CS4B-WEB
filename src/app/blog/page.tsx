import Link from "next/link";
import { db } from "@/lib/db";

// Tipos
interface Post {
  id: string;
  titulo: string;
  slug: string;
  contenido: string;
  excerpt: string | null;
  imagen_destacada: string | null;
  categoria_id: string | null;
  publicado: boolean;
  fecha_publicacion: Date | null;
  created_at: Date;
  categoria?: {
    nombre: string;
    slug: string;
    color: string;
  };
}

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  color: string;
}

// Función para obtener posts
async function getPosts() {
  try {
    const posts = await db.posts.findAll(true, 20, 0);
    
    // Obtener categoría para cada post
    const postsWithCategoria = await Promise.all(
      posts.map(async (post) => {
        let categoria = null;
        if (post.categoria_id) {
          const categorias = await db.categorias.findById(post.categoria_id);
          if (categorias[0]) {
            categoria = {
              nombre: categorias[0].nombre,
              slug: categorias[0].slug,
              color: categorias[0].color,
            };
          }
        }
        return { ...post, categoria };
      })
    );
    
    return postsWithCategoria;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Función para obtener categorías
async function getCategorias() {
  try {
    return await db.categorias.findAll();
  } catch (error) {
    console.error("Error fetching categorias:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  const categorias = await getCategorias();

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="pt-0">
      {/* Header con imagen de fondo - combinado con navbar */}
      <section className="relative h-[60vh] min-h-[500px] flex flex-col justify-end">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&q=80" 
            alt="Blog de tecnología" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="relative container-custom pb-12">
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
            <Link
              href="/blog"
              className="px-5 py-2 rounded-full text-sm font-medium transition-colors bg-primary text-white"
            >
              Todos
            </Link>
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?categoria=${cat.slug}`}
                className="px-5 py-2 rounded-full text-sm font-medium transition-colors bg-bg-light text-text-secondary hover:bg-primary hover:text-white"
              >
                {cat.nombre}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid - Estilo BCG: cards con imágenes grandes */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">No hay publicaciones disponibles</p>
              <p className="text-gray-400 mt-2">Pronto we'll have new content</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4">
                      <img 
                        src={post.imagen_destacada || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80"}
                        alt={post.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {post.categoria && (
                        <div className="absolute top-4 left-4">
                          <span 
                            className="text-xs font-medium text-white px-3 py-1 rounded-full"
                            style={{ backgroundColor: post.categoria.color }}
                          >
                            {post.categoria.nombre}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-text-secondary">
                        {formatDate(post.fecha_publicacion)}
                      </span>
                      <h2 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">
                        {post.titulo}
                      </h2>
                      <p className="text-text-secondary line-clamp-2">
                        {post.excerpt || post.contenido.substring(0, 150) + "..."}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* Pagination - Simple */}
          {posts.length > 0 && (
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
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
