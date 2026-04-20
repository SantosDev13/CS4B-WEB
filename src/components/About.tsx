"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Imágenes de referencia (placeholder - el cliente puede proporcionar sus propias imágenes)
const gridImages = [
  {
    src: "/about/team-meeting.jpg",
    alt: "Equipo profesional trabajando conjuntamente",
  },
  {
    src: "/about/office-building.jpg",
    alt: "Arquitectura moderna corporativa",
  },
  {
    src: "/about/technology.jpg",
    alt: "Profesional interactuando con interfaz digital",
  },
  {
    src: "/about/handshake.jpg",
    alt: "Acuerdo comercial en sala de juntas",
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Layout: 2 columnas en desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Columna Izquierda: Contenido */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-8 max-w-xl"
          >
            {/* Etiqueta */}
            <div className="space-y-4">
              <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase">
                Propuesta de Valor
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-primary leading-tight">
                Consulting Strategic For Digital Business - CS4B
              </h1>
            </div>

            {/* Descripción */}
            <div className="space-y-6 text-text-secondary leading-relaxed">
              <p>
                En CS4B Digital Business transformamos la manera en que las empresas 
                operan y crecen en el entorno digital. Nuestra misión es proporcionar 
                soluciones integrales que permitan a las organizaciones adaptarse 
                proactivamente a los constantes cambios tecnológicos.
              </p>
              <p>
                Con más de 10 años de experiencia en el mercado peruano e internacional, 
                hemos ayudado a más de 500 empresas a optimizar sus procesos, implementar 
                tecnologías de vanguardia y alcanzar sus objetivos estratégicos.
              </p>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-3 bg-gradient-to-br from-primary to-primary-light text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Saber Más
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

        {/* cada pagina de categoria-servicio, se linkea mediante su slug correspondiente */}
          {/* Columna Derecha: Grid de Imágenes Interactivo */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {/* Grid Item 1 - Desarrollo de Software */}
            <motion.a
              href="/servicios/desarrollo-software" // Enlace a la página de servicios correspondiente
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=750&fit=crop"
                alt="Equipo profesional trabajando conjuntamente"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              {/* Etiqueta del nombre de servicio - aparece al pasar el mouse */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <span className="bg-accent/90 text-primary px-4 py-2 rounded-lg font-bold text-sm text-center">
                  Desarrollo de Software
                </span>
              </div>
            </motion.a>

            {/* Grid Item 2 - Arquitectura empresarial (staggered offset) */}
            <motion.a
              href="/servicios/arquitectura-empresarial"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 mt-8 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=750&fit=crop"
                alt="Arquitectura moderna corporativa"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              {/* Service name label - appears on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <span className="bg-accent/90 text-primary px-4 py-2 rounded-lg font-bold text-sm text-center">
                  Arquitectura Empresarial
                </span>
              </div>
            </motion.a>

            {/* Grid Item 3 - Hardware y equipos (negative margin) */}
            <motion.a
              href="/servicios/hardware"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 -mt-8 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <img
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=750&fit=crop"
                alt="Profesional interactuando con tecnología"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              {/* Service name label - appears on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <span className="bg-accent/90 text-primary px-4 py-2 rounded-lg font-bold text-sm text-center">
                  Hardware y Equipos
                </span>
              </div>
            </motion.a>

            {/* Grid Item 4 - Docencia y Capacitación */}
            <motion.a
              href="/servicios/docencia-y-capacitacion"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=750&fit=crop"
                alt="Acuerdo comercial"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              {/* Service name label - appears on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <span className="bg-accent/90 text-primary px-4 py-2 rounded-lg font-bold text-sm text-center">
                  Docencia y Capacitación
                </span>
              </div>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}