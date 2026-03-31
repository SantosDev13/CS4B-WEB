"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
            Liderazgo
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6">
            Conoce a nuestro{" "}
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              líder
            </span>
          </h2>
        </motion.div>

        {/* CEO Section - Two Columns */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column - CEO Photo & Info */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
              {/* Photo */}
              <div className="relative mb-8">
                <div className="w-full max-w-md mx-auto">
                  <img
                    src="/raul.jpg"
                    alt="Raúl Castiglione - CEO"
                    className="w-full h-auto rounded-2xl object-cover aspect-[4/5]"
                  />
                </div>
              </div>

              {/* Name & Title */}
              <div className="text-center">
                <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                  Raúl Castiglione
                </h3>
                <p className="text-secondary font-semibold mb-4">
                  CEO Founder - CS4B Digital Solutions
                </p>
                
                {/* Credentials */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    MSc(c) Digital Transformation
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    TOGAF® Certified
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    Cobit 2019® Certified
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    Enterprise Architect
                  </span>
                </div>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed mb-8">
                  "Potenciamos el futuro de las empresas a través de la 
                  transformación digital. Nuestro compromiso es ayudar a las 
                  organizaciones a adaptarse proactivamente a los cambios del 
                  entorno digital, logrando resultados medibles que impulsan 
                  su crecimiento sostenible."
                </p>

                {/* Social Links */}
                <div className="flex justify-center gap-4">
                  <a
                    href="https://www.linkedin.com/in/raulcastiglione/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a
                    href="https://x.com/RaulCastiglione"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/c/Ra%C3%BAlCastiglioneC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Video */}
          <div className="order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-video bg-primary">
              <iframe
                src="https://www.youtube.com/embed/M0G_psFPuDk?si=7s"
                title="Video de Raúl Castiglione - CS4B"
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Caption */}
            <div className="mt-6 text-center lg:text-left">
              <p className="text-lg text-text-secondary">
                Con más de años de experiencia en transformación digital, 
                Raúl lidera el equipo de CS4B para entregar soluciones 
                innovadoras a empresas en todo el Perú.
              </p>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 text-secondary font-semibold mt-4 hover:gap-4 transition-all"
              >
                Conversemos sobre tu proyecto
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
