"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Target, Leaf, Users, Lightbulb, Cpu, BarChart3 } from "lucide-react";
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
  { title: "Estrategia adaptable y personalizada", description: "Diseñamos soluciones que se adaptan a cada contexto y necesidad única.", icon: Target, color: "text-blue-600", bg: "bg-blue-100" },
  { title: "Foco en la sostenibilidad y el impacto social", description: "Comprometidos con generar valor jangka panjang para comunidad y medio ambiente.", icon: Leaf, color: "text-green-600", bg: "bg-green-100" },
  { title: "Cultura colaborativa e inclusiva", description: "Fomentamos equipos diversos que aportan perspectivas únicas.", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
  { title: "Innovación centrada en el valor", description: "Cada solución busca impactar métricas reales del negocio.", icon: Lightbulb, color: "text-amber-600", bg: "bg-amber-100" },
  { title: "Tecnología como motor de transformación", description: "Usamos herramientas de vanguardia para generar resultados.", icon: Cpu, color: "text-cyan-600", bg: "bg-cyan-100" },
  { title: "Liderazgo impulsado por datos", description: "Decisiones basadas en evidencia y análisis preciso.", icon: BarChart3, color: "text-rose-600", bg: "bg-rose-100" },
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

              <hr />

      {/* Info del Gerente + video */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Lado izquierdo: Foto + Info del Gerente */}
            <div className="flex gap-8 items-start">
              {/* Foto del Gerente */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-1/2"
              >
                <img
                  alt="Raul - Gerente General"
                  className="w-full h-[500px] rounded-xl object-cover shadow-lg"
                  src="/raul.jpg"
                />
              </motion.div>

              {/* Info del gerente a la derecha de la foto */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <h1 className="text-5xl font-bold text-primary">Raul</h1>
                <h2 className="text-primary font-bold tracking-widest uppercase text-xl mt-1 mb-4">Gerente General</h2>
                <h3>
                  Raul lidera CS4B con una visión para la transformación digital.
                  Con más de 15 años de experiencia en tecnología empresarial,
                  ha encabezado proyectos de transformación digital para las empresas más importantes del país.
                </h3>
              </motion.div>
            </div>

            {/* Lado derecho: Video + Título + Descripción */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col"
            >
              {/* Video */}
              <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg mb-6">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/M0G_psFPuDk?start=7"
                  title="Video de nuestro CEO"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              {/* Título y descripción del video */}
              <div>
                <h3 className="text-2xl font-bold text-primary mb-3">Finalista en la categoría Arquitecto Empresarial en 2023,
                    organizado por el podcast Hablemos de Arquitectura Empresarial
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  Descubre cómo Raul guía a CS4B en su misión de transformar empresas mediante tecnología e innovación digital en Perú y Latinoamérica.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section - Minimalista */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
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

          {/* Grid minimal - solo cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valores.map((valor, index) => (
              <motion.div
                key={valor.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 rounded-2xl hover:bg-primary/5 transition-colors"
              >
                <div className={`w-14 h-14 rounded-2xl ${valor.bg} flex items-center justify-center mb-5 group-hover:opacity-80 transition-opacity`}>
                  <valor.icon className={`w-7 h-7 ${valor.color}`} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{valor.title}</h3>
                <p className="text-text-secondary leading-relaxed">{valor.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo - Cards con hover */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
              Nuestro Equipo
            </span>
            <h2 className="text-4xl font-bold text-primary">
              Las personas detrás de CS4B
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Raul",
                role: "CEO - FUNDADOR",
                image: "/raul.jpg",
                bio: "Liderando la transformación digital con más de 15 años de experiencia.",
              },
              {
                name: "Ivan",
                role: "DIRECTOR DE OPERACIONES",
                image: "/ivan.jpg",
                bio: "Asegurando la excelencia operativa en cada proyecto.",
              },
              {
                name: "Luis",
                role: "DIRECTOR DE TECNOLOGÍA",
                image: "/luis.jpeg",
                bio: "Innovación tecnológica al servicio de nuestros clientes.",
              },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-xl overflow-hidden"
              >
                {/* Imagen */}
                <img
                  alt={member.name}
                  className="w-full h-[400px] object-cover"
                  src={member.image}
                />
                {/* Overlay con hover */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                  <div className="text-center">
                    <p className="text-white font-medium">{member.bio}</p>
                  </div>
                </div>
                {/* Nombre y rol debajo */}
                <div className="bg-bg-light p-4 text-center">
                  <h3 className="text-xl font-bold text-primary">{member.name}</h3>
                  <p className="text-primary font-bold tracking-widest uppercase text-xs mt-1">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Destacado para /nosotros */}
      <section className="py-24 px-6 md:px-12 bg-primary relative overflow-hidden">
        {/* Pattern de fondo sutil */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Borde dorado decorativo arriba */}
            <div className="w-24 h-1 bg-accent mx-auto mb-8 rounded-full" />
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para transformar tu empresa?
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Conversemos sobre cómo podemos ayudarte a alcanzar tus objetivos de transformación digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-accent text-primary px-8 py-4 rounded-xl font-semibold hover:bg-white hover:scale-105 transition-all shadow-lg shadow-accent/30"
              >
                Agendar Consultoría
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/servicios"
                className="inline-flex items-center gap-2 bg-white/10 text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                Ver Servicios
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}