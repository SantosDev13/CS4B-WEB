"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Users, Award, Globe, Rocket, Target, Eye, TrendingUp, Star } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

// Contenido para los tabs de Misión/Visión/Propósito
const contentSections = [
  {
    id: "mision",
    label: "Misión",
    description: "Impulsar la transformación digital de las empresas con soluciones estratégicas e innovadoras, optimizando procesos, desarrollando talento y generando valor sostenible. Nuestro compromiso es su competitividad y éxito a largo plazo.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
  {
    id: "vision",
    label: "Visión",
    description: "Ser la consultora líder en transformación digital en Perú y Latinoamérica, reconocida por impulsar resultados tangibles, innovación sostenible y excelencia, ayudando a las empresas a alcanzar su máximo potencial en un entorno competitivo.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  },
  {
    id: "proposito",
    label: "Nuestro Propósito",
    description: "Empoderamos a las empresas peruanas y latinoamericanas para transformar su potencial a través de la innovación, la tecnología y la estrategia, ayudándoles a adaptarse y liderar en un mercado digital en constante evolución, siempre enfocados en generar valorsostenible y un impacto social positivo.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  },
];


1
const valores = [
  { title: "Innovación", description: "Buscamos constantemente nuevas formas de resolver desafíos empresariales." },
  { title: "Integridad", description: "Actuamos con transparencia y ética en cada interacción." },
  { title: "Excelencia", description: "Nos esforzamos por superar expectativas en cada proyecto." },
  { title: "Compromiso", description: "Tu éxito es nuestro éxito. Estamos comprometidos con tus resultados." },
];

// Galería de imágenes
const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    alt: "Equipo collaborando",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    alt: "Oficina moderna",
    className: "md:col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1531973576160-7125cd663c86?w=400&q=80",
    alt: "Reunión de equipo",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1497366754035-f200968a9e5e?w=400&q=80",
    alt: "Espacio de trabajo",
    className: "",
  },
];

export default function AboutContent() {
  const [activeTab, setActiveTab] = useState("mision");
  const currentContent = contentSections.find((c) => c.id === activeTab)!;
  return (
    <main className="min-h-screen bg-bg-light">
      {/* Hero Section - Imagen de Fondo */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
            alt="Consultoría empresarial"
            className="w-full h-full object-cover"
          />
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Navbar overlay - para que se vea sobre la imagen */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

        {/* Contenido */}
        <div className="relative z-10 container mx-auto px-6 md:px-12 pt-32 pb-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Título */}
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-white tracking-tight mb-8 leading-relaxed">
                Transformamos empresas mediante tecnología, estrategia e innovación digital.
              </h1>

              {/* Botones apilados */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 bg-accent text-primary px-8 py-4 rounded-xl text-base font-bold hover:bg-white hover:scale-105 transition-all"
                >
                  AGENDAR CONSULTORÍA
                </Link>
                <Link
                  href="/servicios"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white border-2 border-white/60 hover:border-white hover:bg-white/10 transition-all"
                >
                  CONOCE NUESTRAS SOLUCIONES
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Marquee - Carrusel infinito */}
      <section className="bg-primary py-12 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <p className="text-white/50 text-sm text-center uppercase tracking-widest">
            Empresas que confían en nosotros
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Gradiente lateral izquierdo */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-primary to-transparent z-10" />
          {/* Gradiente lateral derecho */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-primary to-transparent z-10" />

          {/* Track animado - doble repetición para efecto infinito */}
          <motion.div
            className="flex gap-16 items-center"
            animate={{
              x: ["0%", "-50%"]
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {/* Primera tanda de logos */}
            {[
              { name: "Microsoft", logo: "/Microsoft.webp" },
              { name: "Kaspersky", logo: "/kaspersky.png" },
              { name: "ESET", logo: "/eset-1024x569.png" },
              { name: "Lenovo", logo: "/Lenovo.png" },
              { name: "Microsoft", logo: "/Microsoft.webp" },
              { name: "Kaspersky", logo: "/kaspersky.png" },
              { name: "ESET", logo: "/eset-1024x569.png" },
              { name: "Lenovo", logo: "/Lenovo.png" },
              { name: "Microsoft", logo: "/Microsoft.webp" },
              { name: "Kaspersky", logo: "/kaspersky.png" },
              { name: "ESET", logo: "/eset-1024x569.png" },
              { name: "Lenovo", logo: "/Lenovo.png" }
            ].map((partner, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 h-16 w-40 flex items-center justify-center"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Texto izquierda + métricas derecha */}
      <section className="py-40 px-6 md:px-12 bg-bg-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Texto a la izquierda */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-accent font-semibold text-sm tracking-wider uppercase mb-4 block">
                  ¿Por qué elegirnos?
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight">
                  Transformación digital con resultados comprobados
                </h2>
              </motion.div>
            </div>

            {/* Métricas a la derecha */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "10+", label: "Años de Experiencia" },
                  { value: "500+", label: "Clientes Atendidos" },
                  { value: "250+", label: "Proyectos Entregados" },
                  { value: "98%", label: "Satisfacción del Cliente" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                  >
                    <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-primary font-bold text-sm mb-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section - Tabs dinámico */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Lado izquierdo: Botones + Descripción */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <span className="text-accent font-semibold text-sm tracking-wider uppercase mb-4 block">
                Nuestra Esencia
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-primary">
                Qué nos define
              </h2>
            </motion.div>

            {/* Botones pill */}
            <div className="flex flex-wrap gap-3 mb-8">
              {contentSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${activeTab === section.id
                      ? "bg-primary text-white shadow-lg"
                      : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                    }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Descripción con transición */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-text-secondary text-lg leading-relaxed">
                  {currentContent.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Lado derecho: Imagen con transición */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeTab}
                src={currentContent.image}
                alt={currentContent.label}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            {/* Overlay para mejor contraste */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* Leadership Spotlight - CEO + Video */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center"
          >
            {/* CEO Portrait */}
            <div className="md:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute -inset-4 bg-primary/5 rounded-xl transition-all duration-500 group-hover:bg-primary/10"></div>
                <img
                  alt="Raul - CEO"
                  className="relative rounded-xl w-full h-[600px] object-cover shadow-sm"
                  src="/raul.jpg"
                />
                <div className="mt-8">
                  <h4 className="text-3xl font-bold text-primary">Raul</h4>
                  <p className="text-primary font-bold tracking-widest uppercase text-xs mt-2">Fundador & CEO</p>
                  <p className="mt-6 text-text-secondary leading-relaxed">
                    Raul lidera CS4B con una visión para la transformación digital.
                    Con más de 15 años de experiencia en tecnología empresarial,
                    ha encabezado proyectos de transformación digital para las empresas más importantes del país.
                  </p>
                  {/* Logros del CEO */}
                  <div className="mt-6 p-4 bg-primary/5 rounded-xl border-l-4 border-primary">
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Nuestro CEO fue uno de los tres finalistas en la categoría
                      <span className="font-bold"> «Arquitecto Empresarial»</span> en el año 2023,
                      organizada por el podcast <span className="font-semibold">«Hablemos de Arquitectura Empresarial»</span>.
                      Una experiencia increíble haber sido reconocido como finalista en esta prestigioso ceremonia. 🏆✨
                    </p>
                    <p className="text-sm text-text-muted mt-3">
                      Agradecimiento especial a <span className="font-semibold">Israel Tavares Martínez</span> & <span className="font-semibold">Carlos Adán Moctezuma Figueroa</span> de México
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Video Section */}
            <div className="md:col-span-7">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg"
              >
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/M0G_psFPuDk?start=7"
                  title="Video de nuestro CEO"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6 md:px-12 bg-bg-light">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
              Nuestra Cultura
            </span>
            <h2 className="text-4xl font-bold text-primary">
              Valores que Nos Definen
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((valor, index) => (
              <motion.div
                key={valor.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{valor.title}</h3>
                <p className="text-text-secondary text-sm">{valor.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Gallery - Bento Style */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="md:w-1/2">
              <h2 className="text-5xl font-extrabold text-primary tracking-tighter mb-4">
                Conoce CS4B
              </h2>
              <p className="text-text-secondary max-w-md">
                Nuestro workspace es un ecosistema diseñado para impulsar la colaboración y la excelencia tecnológica.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[800px]">
            {galleryImages.map((img, index) => (
              <motion.div
                key={img.alt}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-gray-100 rounded-xl overflow-hidden ${img.className || 'md:col-span-1'}`}
              >
                <img
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  src={img.src}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-12 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter mb-6 leading-tight">
              ¿Listo para transformar <br />tu empresa?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Conversemos sobre cómo podemos ayudarte a alcanzar tus objetivos de transformación digital.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-3 bg-white text-primary px-10 py-4 rounded-xl text-lg font-bold hover:bg-secondary hover:text-white transition-colors"
            >
              Iniciar Conversación
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}