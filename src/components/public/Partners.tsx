"use client";

import { motion } from "framer-motion";

const partners = [
  {
    name: "Microsoft",
    logo: "/Microsoft.webp",
    description: "Microsoft AI Cloud Partner Program",
  },
  {
    name: "Kaspersky",
    logo: "/kaspersky.png",
    description: "Seguridad endpoint",
  },
  {
    name: "ESET",
    logo: "/eset-1024x569.png",
    description: "Antivirus y protección",
  },
  {
    name: "Lenovo",
    logo: "/Lenovo.png",
    description: "Hardware y servidores",
  },
];

export default function Partners() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80')`,
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/85 to-secondary/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.15 }}
        viewport={{ once: true }}
        className="absolute top-0 right-0 w-80 h-80 bg-secondary rounded-full blur-[150px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        viewport={{ once: true }}
        className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-[120px]"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase mb-4">
            Alianzas estratégicas
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Nuestros{" "}
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              Partners
            </span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Trabajamos con los líderes globales en tecnología para ofrecerte 
            soluciones de primer nivel y soporte especializado.
          </p>
        </motion.div>

        {/* Partners Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
            >
              {/* Logo */}
              <div className="h-16 md:h-20 flex items-center justify-center mb-4">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              
              {/* Description */}
              <p className="text-white/80 text-sm text-center font-medium">
                {partner.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 text-center text-white/60 text-sm"
        >
          Somos partners certificados de las marcas líderes en tecnología
        </motion.p>
      </div>
    </section>
  );
}
