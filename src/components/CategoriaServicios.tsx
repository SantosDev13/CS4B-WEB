"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Check, Phone, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface CategoriaWithServicios {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
  link: string | null;
  visible: boolean;
  servicios: {
    id: string;
    titulo: string;
    slug: string;
    descripcion: string;
    descripcion_corta: string | null;
    icono: string | null;
    imagen: string | null;
    tamanho: string;
  }[];
}

interface CategoriaServiciosPageProps {
  categoria: CategoriaWithServicios;
}

export default function CategoriaServiciosPage({ categoria }: CategoriaServiciosPageProps) {
  const handleWhatsApp = (servicioTitulo?: string) => {
    const message = servicioTitulo 
      ? `Hola! Estoy interesa

do en: ${servicioTitulo}`
      : `Hola! Estoy interesado en los servicios de ${categoria.nombre}`;
    window.open(`https://wa.me/51999999999?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Default background image if none provided
  const bgImage = categoria.imagen || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80";

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Header con imagen y título de la categoría */}
      <section className="relative bg-primary overflow-hidden -mt-14 pt-14">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img 
            src={bgImage}
            alt={categoria.nombre}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        
        {/* Contenido del header */}
        <div className="container-custom relative z-10 py-24 md:py-32">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            {categoria.nombre}
          </h1>
          
          {categoria.descripcion && (
            <p className="text-white/70 text-lg max-w-2xl">
              {categoria.descripcion}
            </p>
          )}
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-primary">Inicio</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/servicios" className="hover:text-primary">Servicios</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-text-secondary truncate max-w-[200px]">{categoria.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Servicios en Cards Grandes */}
      <div className="container-custom py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">
            Explora nuestros servicios de {categoria.nombre}
          </h2>
          <p className="text-text-secondary mt-2">
            {categoria.servicios.length} servicio{categoria.servicios.length !== 1 ? 's' : ''} disponible{categoria.servicios.length !== 1 ? 's' : ''}
          </p>
        </div>

        {categoria.servicios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {categoria.servicios.map((servicio, index) => (
              <motion.div
                key={servicio.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/servicios/${servicio.slug}`}
                  className="group block bg-white rounded-xl border hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
                >
                  {/* Imagen grande del servicio */}
                  <div className="aspect-[21/9] bg-gradient-to-br from-primary to-primary-light relative overflow-hidden">
                    {servicio.imagen ? (
                      <img
                        src={servicio.imagen}
                        alt={servicio.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/20 text-7xl font-bold">
                          {servicio.titulo.charAt(0)}
                        </span>
                      </div>
                    )}
                    {/* Overlay al hover */}
                    <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white text-primary px-6 py-3 rounded-lg font-semibold text-lg">
                        Ver detalles
                      </span>
                    </div>
                  </div>

                  {/* Contenido del card */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                      {servicio.titulo}
                    </h3>
                    <p className="text-text-secondary line-clamp-3 mb-4">
                      {servicio.descripcion_corta || servicio.descripcion?.substring(0, 150) + '...'}
                    </p>
                    
                    {/* Features del servicio */}
                    <div className="space-y-2 mb-4">
                      {servicio.descripcion?.split('\n').filter(line => line.startsWith('•') || line.startsWith('-')).slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-text-muted">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature.replace(/^[•\-]\s*/, '')}</span>
                        </div>
                      ))}
                      {servicio.descripcion?.split('\n').filter(line => line.startsWith('•') || line.startsWith('-')).length === 0 && (
                        <>
                          <div className="flex items-start gap-2 text-sm text-text-muted">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Soporte técnico especializado</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-text-muted">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Licencia oficial</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Footer del card */}
                    <div className="pt-4 border-t flex items-center justify-between">
                      <span className="text-sm text-secondary font-medium">
                        Ver más →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border p-12 text-center">
            <p className="text-text-muted text-lg">
              No hay servicios disponibles en esta categoría aún.
            </p>
            <p className="text-text-muted mt-2">
              Vuelve pronto.
            </p>
          </div>
        )}
      </div>

      {/* CTA para contactar */}
      <section className="bg-primary py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Necesitas más información?
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
           Nuestro equipo te asesora para encontrar la mejor solución para tu empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleWhatsApp()}
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Escribir al asesor
            </button>
            <Link 
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 bg-accent text-primary font-semibold px-8 py-4 rounded-lg hover:bg-accent/90 transition-all"
            >
              <Mail className="w-5 h-5" />
              Solicitar información
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}