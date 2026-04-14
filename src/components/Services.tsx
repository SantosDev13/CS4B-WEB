"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { 
  FileKey, 
  Shield, 
  Monitor, 
  Code, 
  BrainCircuit, 
  GraduationCap,
  ArrowUpRight,
  Server,
  LayoutGrid,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface Categoria_servicio {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
  link: string | null;
  orden: number;
  visible: boolean;
}

const ICONOS_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileKey,
  Shield,
  Monitor,
  Code,
  BrainCircuit,
  GraduationCap,
  Server,
  LayoutGrid,
};

const defaultCategorias: Categoria_servicio[] = [
  {
    id: "1",
    nombre: "Licencias",
    slug: "licencias",
    descripcion: "Licencias originales de Microsoft 365, Azure, Windows y servidores.",
    imagen: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&q=80",
    link: "/servicios#licencias",
    orden: 1,
    visible: true,
  },
  {
    id: "2",
    nombre: "Seguridad",
    slug: "seguridad",
    descripcion: "Soluciones de seguridad endpoint, antivirus y protección contra malware.",
    imagen: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80",
    link: "/servicios#seguridad",
    orden: 2,
    visible: true,
  },
  {
    id: "3",
    nombre: "Infraestructura",
    slug: "infraestructura",
    descripcion: "Equipos de cómputo, servidores, periféricos y soluciones de infraestructura.",
    imagen: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
    link: "/servicios#infraestructura",
    orden: 3,
    visible: true,
  },
  {
    id: "4",
    nombre: "Desarrollo",
    slug: "desarrollo",
    descripcion: "Aplicaciones web, móviles y sistemas personalizados.",
    imagen: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
    link: "/servicios#desarrollo",
    orden: 4,
    visible: true,
  },
  {
    id: "5",
    nombre: "Consultoría",
    slug: "consultoria",
    descripcion: "Auditorías, planeación estratégica y optimización de procesos.",
    imagen: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
    link: "/servicios#consultoria",
    orden: 5,
    visible: true,
  },
  {
    id: "6",
    nombre: "Capacitación",
    slug: "capacitacion",
    descripcion: "Programas de formación en tecnología y certificaciones.",
    imagen: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80",
    link: "/servicios#capacitacion",
    orden: 6,
    visible: true,
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

function getIconComponent(iconName: string | null): React.ComponentType<{ className?: string }> {
  return ICONOS_MAP[iconName || 'LayoutGrid'] || LayoutGrid;
}

export default function Services() {
  const [categorias, setCategorias] = useState<Categoria_servicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const res = await fetch("/api/categorias-servicios?published=true", { 
        credentials: "include" 
      });
      const data = await res.json();
      
      if (data.categorias && data.categorias.length > 0) {
        setCategorias(data.categorias);
      } else {
        setCategorias(defaultCategorias);
      }
    } catch (error) {
      console.error("Error fetching categorias:", error);
      setCategorias(defaultCategorias);
    } finally {
      setLoading(false);
    }
  };

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
            Herramientas completas para transformar tu empresa. 
            Explora nuestras categorías de servicios.
          </p>
        </motion.div>

        {/* Bento Grid con Categorías Padre */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 auto-rows-[220px]"
        >
          {categorias.map((categoria, index) => {
            const IconComponent = getIconComponent(null);
            return (
              <motion.div
                key={categoria.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className={`group relative overflow-hidden rounded-2xl ${
                  index === 0 
                    ? 'md:col-span-1 md:row-span-2' 
                    : index === 1
                    ? 'md:col-span-1 md:row-span-2'
                    : 'md:col-span-1 md:row-span-1'
                }`}
              >
                <Link href={categoria.link || `/servicios#${categoria.slug}`} className="block h-full">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{ 
                      backgroundImage: categoria.imagen 
                        ? `url('${categoria.imagen}')`
                        : undefined,
                      backgroundColor: !categoria.imagen ? '#1e293b' : undefined
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    {/* Icono */}
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    {/* Título */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                      {categoria.nombre}
                    </h3>

                    {/* Descripción breve */}
                    <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-4">
                      {categoria.descripcion}
                    </p>

                    {/* Flecha "Ver más" */}
                    <div className="flex items-center gap-2 text-white/60 text-sm font-medium group-hover:text-white group-hover:gap-3 transition-all">
                      Ver más
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-secondary/50 rounded-2xl transition-colors duration-300" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Ver todos los servicios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link 
            href="/servicios"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            Ver todos los servicios
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}