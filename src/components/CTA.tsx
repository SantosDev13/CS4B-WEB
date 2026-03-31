"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Consultoría personalizada",
  "Soporte técnico especializado",
  "Soluciones escalables",
  "Precios competitivos",
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

export default function CTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80')`,
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-secondary/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.2 }}
        viewport={{ once: true }}
        className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-[150px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.15 }}
        viewport={{ once: true }}
        className="absolute bottom-0 left-0 w-80 h-80 bg-accent rounded-full blur-[120px]"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Heading */}
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              ¿Listo para{" "}
              <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                transformar
              </span>{" "}
              tu empresa?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12">
              Contáctanos hoy y descubre cómo nuestras soluciones tecnológicas 
              pueden impulsar el crecimiento de tu negocio.
            </p>
          </motion.div>

          {/* Benefits List */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12"
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full"
              >
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-white text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/contacto"
              className="group inline-flex items-center gap-2 bg-accent text-primary px-8 py-4 rounded-lg font-semibold hover:bg-accent/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Contáctanos Ahora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Ver Servicios
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.p
            variants={itemVariants}
            className="mt-8 text-white/60 text-sm"
          >
            Primera consulta sin costo • Respuesta en menos de 24 horas
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
