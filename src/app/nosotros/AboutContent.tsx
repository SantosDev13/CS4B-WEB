"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Award, Users, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Enfoque Estratégico",
    description: "No solo implementamos tecnología, sino que entendemos tu negocio para ofrecer soluciones que generen impacto real.",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Resultados Medibles",
    description: "Cada proyecto tiene KPIs definidos y métricas claras para evaluar el éxito y el retorno de inversión.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Equipo Multidisciplinario",
    description: "Profesionales especializados en diferentes áreas de tecnología y negocios para cubrir todas tus necesidades.",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Experiencia Comprobada",
    description: "Más de 10 años helping empresas locales e internacionales en su transformación digital.",
  },
];

const valores = [
  {
    title: "Innovación",
    description: "Buscamos constantemente nuevas formas de resolver desafíos empresariales.",
  },
  {
    title: "Integridad",
    description: "Actuamos con transparencia y ética en cada interacción con nuestros clientes.",
  },
  {
    title: "Excelencia",
    description: "Nos esforzamos por superar expectativas en cada proyecto que ejecutamos.",
  },
  {
    title: "Compromiso",
    description: "Tu éxito es nuestro éxito. Estamos comprometidos con tus resultados.",
  },
];

const stats = [
  { value: "10+", label: "Años de Experiencia" },
  { value: "500+", label: "Clientes Atendidos" },
  { value: "1000+", label: "Proyectos Completados" },
  { value: "20+", label: "Profesionales" },
];

export default function AboutContent() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-primary overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase mb-4">
              Sobre CS4B
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Consulting Strategic For Digital Business
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Transformamos la manera en que las empresas operan y crecen en el entorno digital.
              Nuestra misión es proporcionar soluciones integrales que permitan a las organizaciones
              adaptarse proactivamente a los constantes cambios tecnológicos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-primary">Nuestra Misión</h2>
              </div>
              <p className="text-text-secondary text-lg leading-relaxed">
                Impulsamos la transformación digital de las empresas con soluciones estratégicas e innovadoras, 
                optimizando procesos, desarrollando talento y generando valor sostenible para nuestros clientes. 
                Nuestro compromiso es su competitividad y éxito a largo plazo.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-primary">Nuestra Visión</h2>
              </div>
              <p className="text-text-secondary text-lg leading-relaxed">
                Ser la consultora líder en transformación digital en Perú y Latinoamérica, 
                reconocida por impulsar resultados tangibles, innovación sostenible y excelencia, 
                ayudando a las empresas a alcanzar su máximo potencial en un entorno competitivo.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-bg-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase mb-4">
              ¿Por qué elegirnos?
            </span>
            <h2 className="text-4xl font-bold text-primary mb-6">
              Nuestra Propuesta de Valor
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Combinamos experiencia técnica con conocimiento de negocio para entregar
              soluciones que realmente impulsan el crecimiento de tu empresa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase mb-4">
              Nuestra Cultura
            </span>
            <h2 className="text-4xl font-bold text-primary mb-6">
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
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{valor.title}</h3>
                <p className="text-text-secondary">{valor.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Listo para transformar tu empresa?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Conversemos sobre cómo podemos ayudarte a alcanzar tus objetivos de transformación digital.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-3 bg-accent text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-all duration-300 hover:scale-105"
            >
              Contáctanos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}