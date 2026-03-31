"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";

const stats = [
  { value: 10, suffix: "+", label: "Años de Experiencia", description: "transformando empresas" },
  { value: 150, suffix: "+", label: "Clientes Satisfechos", description: "en Perú y Latam" },
  { value: 500, suffix: "+", label: "Proyectos Completados", description: "entregados a tiempo" },
  { value: 25, suffix: "+", label: "Profesionales", description: "expertos certificados" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export default function Stats() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
        backgroundSize: '30px 30px'
      }} />

      {/* Decorative Glows */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.2 }}
        viewport={{ once: true }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-secondary rounded-full blur-[150px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.15 }}
        viewport={{ once: true }}
        className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent rounded-full blur-[120px]"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative p-6 lg:p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-secondary/30 transition-all duration-300 group"
            >
              {/* Value */}
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <div className="text-white font-semibold text-lg mb-1">{stat.label}</div>
              
              {/* Description */}
              <div className="text-white/40 text-sm">{stat.description}</div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
