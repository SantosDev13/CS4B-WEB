"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Licencias Microsoft",
    subtitle: "Todo el poder de Microsoft 365 para tu empresa",
    description: "Obtén las licencias que tu empresa necesita con soporte especializado y precios competitivos. Maximiza la productividad de tu equipo.",
    image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=1920&q=80",
    cta: "Ver licencias",
    link: "/servicios#licencias-microsoft",
  },
  {
    id: 2,
    title: "Antivirus y Seguridad",
    subtitle: "Protege tu infraestructura tecnológica",
    description: "Soluciones de seguridad empresarial de vanguardia. Mantén tus datos seguros contra amenazas cibernéticas con monitoreo 24/7.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&q=80",
    cta: "Ver seguridad",
    link: "/servicios#antivirus",
  },
  {
    id: 3,
    title: "Hardware y Equipos",
    subtitle: "Equipamiento tecnológico de calidad",
    description: "Computadoras, servidores, impresoras y más. Equipamos tu oficina con las mejores marcas del mercado.",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1920&q=80",
    cta: "Ver equipos",
    link: "/servicios#hardware",
  },
  {
    id: 4,
    title: "Desarrollo de Software",
    subtitle: "Software a medida para tu negocio",
    description: "Creamos aplicaciones web, sistemas ERP/CRM y apps móviles que se adaptan perfectamente a tus procesos empresariales.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=80",
    cta: "Ver servicios",
    link: "/servicios#desarrollo-software",
  },
  {
    id: 5,
    title: "Consultoría IT",
    subtitle: "Transformación digital para tu empresa",
    description: "Asesoría especializada para planificar y ejecutar tu estrategia de transformación digital con resultados medibles.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80",
    cta: "Hablar con un experto",
    link: "/servicios#consultoria-it",
  },
  {
    id: 6,
    title: "Capacitación",
    subtitle: "Entrenamiento para tu equipo",
    description: "Maximiza la productividad de tu equipo con capacitación en Microsoft 365, ciberseguridad y herramientas de productividad.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=80",
    cta: "Ver capacitación",
    link: "/servicios#capacitacion",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary pt-20">
      {/* Carousel Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-secondary/40" />

      {/* Additional overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/4 -left-20 w-96 h-96 bg-secondary rounded-full blur-[150px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent rounded-full blur-[120px]"
      />

      {/* Carousel Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-secondary font-medium mb-4 tracking-wider uppercase text-sm"
              >
                {slides[currentSlide].subtitle}
              </motion.p>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1]"
              >
                {slides[currentSlide].title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                {slides[currentSlide].description}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Link
                  href={slides[currentSlide].link}
                  className="group inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-secondary/25"
                >
                  {slides[currentSlide].cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-3 mt-16">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                className={`relative h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "w-12 bg-white" : "w-3 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Ver ${slide.title}`}
              >
                {index === currentSlide && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-secondary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
