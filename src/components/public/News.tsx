"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";

interface Post {
  id: string;
  titulo: string;
  slug: string;
  contenido: string;
  excerpt: string | null;
  imagen_destacada: string | null;
  categoria_id: string | null;
  categoria?: {
    nombre: string;
    slug: string;
    color: string;
  };
  fecha_publicacion: string | null;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function News() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts?published=true&limit=3");
      const data = await res.json();
      
      if (data.posts) {
        setPosts(data.posts);
      } else if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("es-ES", { 
      day: "2-digit", 
      month: "short", 
      year: "numeric" 
    });
  };

  const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";

  return (
    <section id="noticias" className="py-24 bg-bg-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase mb-4">
            Latest Insights
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6">
            Últimas{" "}
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              noticias
            </span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Mantente informado sobre las últimas tendencias tecnológicas y 
            noticias relevantes para tu negocio.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-20"
          >
            <p className="text-xl text-gray-500 mb-4">No hay publicaciones disponibles</p>
            <p className="text-gray-400 mb-8">Pronto tendremos nuevas noticias para ti</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-4 transition-all"
            >
              Ver Todas las Noticias
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        ) : (
          /* News Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {posts.map((post) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link href={`/blog/${post.slug}`}>
                  <article className="h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-secondary/30 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                        style={{ backgroundImage: `url('${post.imagen_destacada || defaultImage}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      
                      {/* Category Badge */}
                      {post.categoria && (
                        <span 
                          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-3 py-1 rounded-full"
                          style={{ color: post.categoria.color }}
                        >
                          {post.categoria.nombre}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-text-muted text-sm mb-4">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.fecha_publicacion)}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                        {post.titulo}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-4">
                        {post.excerpt || post.contenido.substring(0, 100) + "..."}
                      </p>

                      {/* Read More */}
                      <div className="flex items-center gap-2 text-secondary font-medium text-sm group-hover:gap-3 transition-all">
                        Leer artículo
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* View All Button - Only show if there are posts */}
        {!loading && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-secondary transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-secondary/25"
            >
              Ver Todas las Noticias
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
