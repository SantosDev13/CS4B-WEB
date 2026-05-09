import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import DOMPurify from "isomorphic-dompurify";
import { cookies } from "next/headers";
import { categorizeError } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

// Función para generar metadata dinámica
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const post = await prisma.post.findUnique({ where: { slug } });
    
    if (!post) {
      return { title: "Post no encontrado | CS4B" };
    }
    
    return {
      title: `${post.titulo} | CS4B Blog`,
      description: post.excerpt || post.contenido.substring(0, 160),
    };
  } catch (error) {
    return { title: "Blog | CS4B" };
  }
}

// Función para obtener un post por slug
async function fetchPostBySlug(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        categoriaPost: { select: { id: true, nombre: true, slug: true, color: true } },
        autor: { select: { nombre: true, avatar: true } },
      },
    });
    
    if (!post) return null;
    
    // Verificar si el usuario ya vio este post (cookie expira en 1 hora)
    const cookieStore = await cookies();
    const viewedPosts = cookieStore.get("viewed_posts")?.value || "";
    const viewedList = viewedPosts ? JSON.parse(viewedPosts) : [];
    
    // Solo incrementar si no ha sido visto recently
    if (!viewedList.includes(post.id)) {
      await prisma.post.update({
        where: { id: post.id },
        data: { vistas: { increment: 1 } },
      });
      
      // Actualizar cookie con el post visto
      const newViewedList = [...viewedList, post.id].slice(-20); // Guardar max 20 posts
      cookieStore.set("viewed_posts", JSON.stringify(newViewedList), {
        httpOnly: true,
        maxAge: 3600, // 1 hora
        path: "/",
      });
    }
    
    return {
      ...post,
      categoria: post.categoriaPost,
      autor: post.autor,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Función para obtener posts relacionados
async function fetchRelatedPosts(categoriaId: string, currentSlug: string) {
  try {
    const posts = await prisma.post.findMany({
      where: { 
        categoria_post_id: categoriaId,
        slug: { not: currentSlug },
        publicado: true,
      },
      take: 3,
      orderBy: { fecha_publicacion: 'desc' },
    });
    return posts;
  } catch (error) {
    return [];
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  
  if (!post) {
    notFound();
  }
  
  const relatedPosts = post.categoria_post_id ? await fetchRelatedPosts(post.categoria_post_id, slug) : [];
  
  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("es-ES", { 
      day: "2-digit", 
      month: "numeric", 
      year: "numeric" 
    }).replace(/\//g, " . ");
  };

  const shareUrl = `https://cs4digitalbusiness.com/blog/${slug}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="pt-0">
      {/* Header con imagen de fondo */}
      <section className="relative h-[50vh] min-h-[400px] flex flex-col justify-end">
        <div className="absolute inset-0">
          <img 
            src={post.imagen_destacada || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&q=80"} 
            alt={post.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80" />
        </div>
        <div className="relative container-custom pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Noticias</Link>
          </nav>

          {/* Meta tags */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {post.categoria && (
              <Link
                href={`/blog?categoria=${post.categoria.slug}`}
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: post.categoria.color }}
              >
                {post.categoria.nombre}
              </Link>
            )}
            <span className="text-white/70 text-sm">
              {post.vistas + 1} vistas
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-4xl">
            {post.titulo}
          </h1>
          
          <div className="flex items-center gap-4 text-white/80">
            <span>{formatDate(post.fecha_publicacion)}</span>
            {post.autor && (
              <>
                <span>•</span>
                <span>{post.autor.nombre}</span>
              </>
            )}
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-3 mt-6">
            <span className="text-sm text-white/70">Compartir:</span>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[#0077b5] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="bg-gray-50">
        <div className="container-custom py-12">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden mb-8">
              <img 
                src={post.imagen_destacada || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&q=80"} 
                alt={post.titulo}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            </div>

            {post.excerpt && (
              <blockquote className="border-l-4 border-primary pl-6 py-2 my-8">
                <p className="text-xl md:text-2xl text-gray-700 font-medium italic">
                  {post.excerpt}
                </p>
              </blockquote>
            )}
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="bg-white">
        <div className="container-custom py-12">
          <div className="max-w-3xl mx-auto">
            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.contenido) }}
            />

            {/* Author info */}
            {post.autor && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold">{post.autor.nombre.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{post.autor.nombre}</p>
                    <p className="text-sm text-gray-500">Autor</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Volver al blog */}
            <div className="mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary font-medium hover:text-secondary transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a Noticias
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Posts relacionados */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Noticias Relacionadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <div className="relative aspect-[16/10]">
                      <img 
                        src={relatedPost.imagen_destacada || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80"}
                        alt={relatedPost.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.titulo}
                      </h3>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                        {relatedPost.excerpt || relatedPost.contenido.substring(0, 80) + "..."}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}