"use client";

import { useEffect, useState, useCallback } from "react";
import { Award, Users, Briefcase } from "lucide-react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
}

const stats: Stat[] = [
  { value: 10, suffix: "+", label: "Años de experiencia", icon: <Award className="w-10 h-10" /> },
  { value: 500, suffix: "+", label: "Clientes satisfechos", icon: <Users className="w-10 h-10" /> },
  { value: 1000, suffix: "+", label: "Proyectos completados", icon: <Briefcase className="w-10 h-10" /> },
];

export default function StatsSection() {
  const [sectionTop, setSectionTop] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [counters, setCounters] = useState({ 10: 0, 500: 0, 1000: 0 });

  // Función para iniciar contadores
  const startCounters = useCallback(() => {
    const targets = [10, 500, 1000];
    const duration = 2500;
    const steps = 60;
    
    targets.forEach((target) => {
      let current = 0;
      const increment = target / steps;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCounters(prev => ({ ...prev, [target]: target }));
          clearInterval(timer);
        } else {
          setCounters(prev => ({ ...prev, [target]: Math.floor(current) }));
        }
      }, duration / steps);
    });
  }, []);

  // Detectar scroll y posición de la sección
  useEffect(() => {
    const section = document.getElementById('stats-section');
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      setSectionTop(rect.top);
    };

    // Intersection Observer para saber cuando estamos en la sección
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          startCounters();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    
    // Initial position
    const rect = section.getBoundingClientRect();
    setSectionTop(rect.top);

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [isInView, startCounters]);

  // El fondo se mueve basado en la posición de la sección
  // Cuanto másscroll, más se mueve el fondo en dirección opuesta
  const parallaxOffset = -sectionTop * 0.5;

  return (
    <section 
      id="stats-section"
      className="relative w-full h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Background con Parallax - se mueve con el scroll */}
      <div 
        className="absolute inset-0 w-full h-[200%] -top-[50%]"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: `translateY(${parallaxOffset}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-primary/80" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* Título */}
        <div className={`text-center mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Transformando Negocios Digitales
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Más de una década ayudando a empresas en Perú y Latinoamérica a alcanzar su potencial digital
          </p>
        </div>

        {/* Grid de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-secondary/30 hover:bg-white/10 transition-all duration-300 cursor-default transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Icono */}
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mb-4">
                {stat.icon}
              </div>
               
              {/* Número grande con contador */}
              <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 tracking-tight">
                {counters[stat.value as keyof typeof counters]}{stat.suffix}
              </div>
              
              {/* Etiqueta */}
              <div className="text-white/80 text-lg md:text-xl font-medium">
                {stat.label}
              </div>

              {/* Línea decorativa hover */}
              <div className="mt-6 h-1 w-16 mx-auto bg-gradient-to-r from-secondary to-accent rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent pointer-events-none" />
    </section>
  );
}