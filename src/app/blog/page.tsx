import Link from "next/link";
import prisma from "@/lib/prisma";
import { categorizeError } from "@/lib/utils";

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
async function fetchPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { publicado: true },
      include: {
        categoriaPost: { select: { nombre: true, slug: true, color: true } },
      },
      orderBy: { fecha_publicacion: 'desc' },
      take: 20,
    });
    
    return posts.map((post: any) => ({
      ...post,
      categoria: post.categoriaPost,
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Función para obtener todas las categorías
async function fetchCategorias() {
  try {
    const categorias = await prisma.categoriaPost.findMany({
      orderBy: { orden: 'asc' },
    });
    return categorias;
  } catch (error) {
    const categorized = categorizeError(error);
    console.error(`[${categorized.code}] Error fetching categorias:`, categorized.message);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await fetchPosts();
  const categorias = await fetchCategorias();

  return (
    <div className="min-h-screen bg-bg-light pt-0">
      {/* Header */}
      <section className="relative bg-primary py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&q=80"
            alt="Blog"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Blog
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl">
            Noticias, articulos y consejos sobre tecnologia y negocio
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-primary">Inicio</Link>
            <span className="text-text-secondary">Blog</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <main className="flex-1">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-text-secondary">
                  No hay posts publicados aun.
                </p>
              </div>
            ) : (
              <div className="grid gap-8">
                {posts.map((post: any) => (
                  <article key={post.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
                    {post.imagen_destacada && (
                      <div className="aspect-video">
                        <img
                          src={post.imagen_destacada}
                          alt={post.titulo}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {post.categoria && (
                        <span 
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                          style={{ backgroundColor: post.categoria.color + '20', color: post.categoria.color }}
                        >
                          {post.categoria.nombre}
                        </span>
                      )}
                      <h2 className="text-xl font-bold text-primary mb-2 hover:text-secondary transition-colors">
                        <Link href={`/blog/${post.slug}`}>
                          {post.titulo}
                        </Link>
                      </h2>
                      <p className="text-text-secondary mb-4 line-clamp-2">
                        {post.excerpt || post.contenido?.substring(0, 150) + '...'}
                      </p>
                      <div className="flex items-center justify-between text-sm text-text-muted">
                        <span>
                          {post.fecha_publicacion 
                            ? new Date(post.fecha_publicacion).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })
                            : new Date(post.created_at).toLocaleDateString('es-PE')}
                        </span>
                        <Link href={`/blog/${post.slug}`} className="text-secondary hover:underline">
                          Leer más
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80">
            <div className="bg-white rounded-xl border p-6 sticky top-24">
              <h3 className="font-semibold text-primary mb-4">Categorias</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/blog"
                    className="block px-3 py-2 rounded-lg hover:bg-bg-light transition-colors text-text-secondary hover:text-primary"
                  >
                    Todos
                  </Link>
                </li>
                {categorias.map((categoria: any) => (
                  <li key={categoria.id}>
                    <Link 
                      href={`/blog?categoria=${categoria.slug}`}
                      className="block px-3 py-2 rounded-lg hover:bg-bg-light transition-colors text-text-secondary hover:text-primary"
                    >
                      {categoria.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer CTA */}
      <section className="bg-primary py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            ¿Quieres escribir en nuestro blog?
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Comparte tus conocimientos y experiencias con nuestra comunidad.
          </p>
          <Link 
            href="/contacto"
            className="inline-flex items-center justify-center bg-accent text-primary font-semibold px-8 py-4 rounded-lg hover:bg-accent/90 transition-all hover:scale-105"
          >
            Contáctanos
          </Link>
        </div>
      </section>
    </div>
  );
}