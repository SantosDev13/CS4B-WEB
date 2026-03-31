"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

const news = [
  {
    id: 1,
    title: "Transformación Digital: El Futuro de las Empresas Peruanas",
    excerpt: "Cómo las pequeñas y medianas empresas están adoptando tecnologías emergentes para competir en el mercado global.",
    date: "28 Mar 2026",
    category: "Tendencias",
    slug: "transformacion-digital-futuro",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
  },
  {
    id: 2,
    title: "Microsoft 365: Maximiza la Productividad de tu Equipo",
    excerpt: "Guía completa sobre las herramientas que Microsoft 365 ofrece para mejorar la colaboración empresarial.",
    date: "25 Mar 2026",
    category: "Productos",
    slug: "microsoft-365-productividad",
    image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&q=80"
  },
  {
    id: 3,
    title: "Ciberseguridad: Protege tu Negocio en el Entorno Digital",
    excerpt: "Las mejores prácticas y soluciones para mantener seguros los datos de tu empresa contra amenazas cibernéticas.",
    date: "22 Mar 2026",
    category: "Seguridad",
    slug: "ciberseguridad-proteccion",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"
  },
];

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

        {/* News Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {news.map((item) => (
            <motion.article
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link href={`/blog/${item.slug}`}>
                <article className="h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-secondary/30 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    
                    {/* Category Badge */}
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-text-muted text-sm mb-4">
                      <Calendar className="w-4 h-4" />
                      {item.date}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-4">
                      {item.excerpt}
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

        {/* View All Button */}
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
      </div>
    </section>
  );
}
