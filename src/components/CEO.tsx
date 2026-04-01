"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  credentials: string[];
  linkedin: string;
  image: string;
  twitter?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Raúl Castiglione",
    role: "CEO Founder - CS4B Digital Solutions",
    description: "Potenciamos el futuro de las empresas a través de la transformación digital. Nuestro compromiso es ayudar a las organizaciones a adaptarse proactivamente a los cambios del entorno digital, logrando resultados medibles que impulsan su crecimiento sostenible.",
    credentials: ["MSc(c) Digital Transformation", "TOGAF® Certified", "Cobit 2019® Certified", "Enterprise Architect"],
    linkedin: "https://www.linkedin.com/in/raulcastiglione/",
    twitter: "https://x.com/RaulCastiglione",
    image: "/raul.jpg"
  },
  {
    name: "Iván Izquierdo Salas",
    role: "Product Management | Business Agile",
    description: "Especialista en Arquitectura Empresarial con enfoque en gestión de productos y metodologías ágiles. Lidera la implementación de soluciones innovadoras alineadas con los objetivos estratégicos de negocio.",
    credentials: ["CSPO", "CS@SP", "TOGAF 9.2 Certified", "PMP®", "PM4R", "BIAN"],
    linkedin: "https://www.linkedin.com/in/iv%C3%A1n-izquierdo-salas-691b8072/",
    image: "/ivan.jpg"
  },
  {
    name: "Carlos Mendoza",
    role: "Director de Tecnología - CS4B",
    description: "Líder en soluciones tecnológicas avanzadas con experiencia en infraestructura cloud y ciberseguridad. Apoya a las empresas en su transformación digital con estrategias tecnológicas de vanguardia.",
    credentials: ["AWS Solutions Architect", "Azure Administrator", "CISSP", "ISO 27001"],
    linkedin: "https://www.linkedin.com/",
    image: "/raul.jpg" // Usando placeholder
  }
];

export default function CEO() {
  return (
    <section id="ceo" className="py-24 bg-bg-light">
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
            Nuestro Equipo
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6">
            Conoce a nuestros{" "}
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Socios Corporativos
            </span>
          </h2>
        </motion.div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-lg h-full flex flex-col">
                {/* Photo */}
                <div className="relative mb-6">
                  <div className="w-full max-w-[200px] mx-auto">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-auto rounded-2xl object-cover aspect-square"
                    />
                  </div>
                </div>

                {/* Name & Title */}
                <div className="text-center mb-4">
                  <h3 className="text-xl lg:text-2xl font-bold text-primary mb-2">
                    {member.name}
                  </h3>
                  <p className="text-secondary font-semibold text-sm">
                    {member.role}
                  </p>
                </div>

                {/* Credentials */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {member.credentials.slice(0, 3).map((cred, i) => (
                    <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {cred}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-text-secondary text-sm leading-relaxed mb-6 flex-grow">
                  {member.description}
                </p>

                {/* Social Links */}
                <div className="flex justify-center gap-3">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-4 transition-all"
          >
            Conversemos sobre tu proyecto
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
