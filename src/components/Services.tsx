"use client";

import { motion, Variants } from "framer-motion";
import { 
  FileKey, 
  Shield, 
  Monitor, 
  Code, 
  BrainCircuit, 
  GraduationCap,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: FileKey,
    title: "Licencias Microsoft",
    description: "Licencias originales de Microsoft 365, Azure, Windows y servidores con soporte técnico especializado.",
    slug: "licencias-microsoft",
    size: "large",
    image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&q=80"
  },
  {
    icon: Shield,
    title: "Antivirus",
    description: "Soluciones de seguridad endpoint, antivirus empresariales y protección contra malware.",
    slug: "antivirus",
    size: "small",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80"
  },
  {
    icon: Monitor,
    title: "Hardware",
    description: "Equipos de cómputo, servidores, periféricos y soluciones de infraestructura IT.",
    slug: "hardware",
    size: "small",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80"
  },
  {
    icon: Code,
    title: "Desarrollo Software",
    description: "Aplicaciones web, móviles y sistemas personalizados adaptados a tus necesidades.",
    slug: "desarrollo-software",
    size: "medium",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80"
  },
  {
    icon: BrainCircuit,
    title: "Consultoría IT",
    description: "Auditorías, planeación estratégica y optimización de procesos tecnológicos.",
    slug: "consultoria-it",
    size: "medium",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80"
  },
  {
    icon: GraduationCap,
    title: "Capacitación",
    description: "Programas de formación en tecnología, certificaciones y talleres especializados.",
    slug: "capacitacion",
    size: "small",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80"
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

export default function Services() {
  return (
    <section id="servicios" className="py-24 bg-bg-light">
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
            Nuestros Servicios
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6">
            Todo lo que necesitas para{" "}
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              escalar
            </span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Herramientas completas para transformar tu empresa. Elige solo lo que necesitas 
            y combínalos para impulsar el crecimiento.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[280px]"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className={`group relative overflow-hidden rounded-2xl ${
                service.size === 'large' 
                  ? 'md:col-span-2 md:row-span-2' 
                  : service.size === 'medium'
                  ? 'md:col-span-1 md:row-span-2'
                  : 'md:col-span-1 md:row-span-1'
              }`}
            >
              <Link href={`/servicios#${service.slug}`} className="block h-full">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url('${service.image}')` }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-4">
                    {service.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 text-white/60 text-sm font-medium group-hover:text-white group-hover:gap-3 transition-all">
                    Más información
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-secondary/50 rounded-2xl transition-colors duration-300" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
