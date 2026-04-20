"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Award, Globe, Rocket, Target, Eye } from "lucide-react";
import Link from "next/link";

const stats = [
  { 
    icon: <Rocket className="w-8 h-8" />,
    value: "10+", 
    label: "AÑOS DE EXPERIENCIA" 
  },
  { 
    icon: <Globe className="w-8 h-8" />,
    value: "500+", 
    label: "CLIENTES ATENDIDOS" 
  },
  { 
    icon: <Award className="w-8 h-8" />,
    value: "20+", 
    label: "PROFESIONALES" 
  },
];

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
  return (
    <main className="min-h-screen bg-bg-light">
      {/* Hero Section - Blue Header */}
      <section className="relative pt-32 pb-24 px-6 md:px-12 overflow-hidden bg-primary">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-12">
          <div className="md:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest uppercase bg-white/10 text-white rounded-lg">
                Nuestra Historia
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-6 leading-[1.1]">
                Definiendo el <br/>
                <span className="text-white">Futuro Digital.</span>
              </h1>
              <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
                En CS4B, no solo implementamos tecnología; transformamos negocios.
                Nuestra filosofía combina honestidad estratégica con fluidez tecnológica moderna.
              </p>
            </motion.div>
          </div>

          <div className="md:w-1/3 flex justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full aspect-square bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80"
                alt="Oficina CS4B"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Blue Background */}
      <section className="bg-primary-light py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-start"
            >
              <div className="text-white mb-4">{stat.icon}</div>
              <div className="text-5xl font-extrabold text-white mb-2">{stat.value}</div>
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-white/70">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 px-6 md:px-12 bg-bg-light">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-12 rounded-xl relative overflow-hidden shadow-lg"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-primary" />
              <h3 className="text-3xl font-bold text-primary">Nuestra Misión</h3>
            </div>
            <p className="text-lg text-text-secondary leading-relaxed italic">
              "Impulsar la transformación digital de las empresas con soluciones estratégicas e innovadoras,
              optimizando procesos, desarrollando talento y generando valor sostenible.
              Nuestro compromiso es su competitividad y éxito a largo plazo."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-12 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-8 h-8 text-primary" />
              <h3 className="text-3xl font-bold text-primary">Nuestra Visión</h3>
            </div>
            <p className="text-lg text-text-secondary leading-relaxed">
              "Ser la consultora líder en transformación digital en Perú y Latinoamérica,
              reconocida por impulsar resultados tangibles, innovación sostenible y excelencia,
              ajudando a las empresas a alcanzar su máximo potencial en un entorno competitivo."
            </p>
          </motion.div>
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
              ¿Listo para transformar <br/>tu empresa?
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