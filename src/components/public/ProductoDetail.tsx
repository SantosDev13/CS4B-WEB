"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, type CartItem } from "@/composables";
import { ChevronLeft, ChevronRight, Check, Phone, Mail, MessageCircle, MessageSquare, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductoDetailProps {
  producto: {
    id: string;
    titulo: string;
    slug: string;
    descripcion: string;
    descripcion_corta?: string | null;
    icono?: string | null;
    imagen?: string | null;
    categoria?: string | null;
    categoria_producto_id?: string | null;
    visible: boolean;
    categoria_nombre?: string;
    categoria_slug?: string;
    categoria_descripcion?: string;
    categoria_imagen?: string;
  };
  productosRelacionados: { slug: string; titulo: string }[];
}

export default function ProductoDetail({ producto, productosRelacionados }: ProductoDetailProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  const inCart = isInCart(producto.id);
  
  // Imágenes del producto (puede ser una o varias)
  const images = producto.imagen 
    ? [producto.imagen] 
    : ["https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&q=80"];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const handleWhatsApp = () => {
    const message = `Hola! Estoy interesado en el producto: ${producto.titulo}`;
    window.open(`https://wa.me/51999999999?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCartClick = () => {
    if (inCart) {
      removeFromCart(producto.id);
      setToastMessage("Eliminado del carrito");
    } else {
      const item: CartItem = {
        id: producto.id,
        titulo: producto.titulo,
        slug: producto.slug,
        categoria: producto.categoria_nombre,
        categoriaSlug: producto.categoria_slug,
      };
      addToCart(item);
      setToastMessage("Agregado al carrito");
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Header con info de la categoría - más alto y por detrás del navbar */}
      {producto.categoria_nombre && (
        <section className="relative bg-primary overflow-hidden -mt-14 pt-14">
          {/* Imagen de fondo de la categoría - usar la de la categoría */}
          <div className="absolute inset-0">
            {producto.categoria_imagen ? (
              <img 
                src={producto.categoria_imagen}
                alt={producto.categoria_nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80" 
                alt={producto.categoria_nombre}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-primary/85" />
          </div>
          
          {/* Contenido del header */}
          <div className="container-custom relative z-10 py-24 md:py-32">
            {/* Título de la categoría */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
              {producto.categoria_nombre}
            </h1>
            
            {/* Descripción de la categoría - usar la real de la tabla o fallback */}
            <p className="text-white/70 text-lg max-w-2xl">
              {producto.categoria_descripcion || `Explora nuestra categoría de ${producto.categoria_nombre?.toLowerCase()} y encuentra la solución perfecta para tu empresa.`}
            </p>
          </div>
        </section>
      )}

      {/* Breadcrumb - siempre debajo del header */}
      <div className={`bg-white border-b ${producto.categoria_nombre ? '' : 'pt-14'}`}>
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-primary">Inicio</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/productos" className="hover:text-primary">Productos</Link>
            {producto.categoria_nombre && (
              <>
                <ChevronRight className="w-4 h-4" />
                <Link href={`/productos#cat-${producto.categoria_slug}`} className="hover:text-primary">
                  {producto.categoria_nombre}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-text-secondary truncate max-w-[200px]">{producto.titulo}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section - Style ML */}
      <div className="container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side - Images */}
          <div className="lg:col-span-2">
            {/* Main Image / Carousel */}
            <div className="bg-white rounded-xl border overflow-hidden mb-4">
              <div className="relative aspect-[4/3] bg-gray-100">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={images[currentImage]}
                    alt={producto.titulo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full object-contain"
                  />
                </AnimatePresence>
                
                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                
                {/* Image counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImage + 1} / {images.length}
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        currentImage === i ? 'border-secondary' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-primary mb-4">
                Descripción
              </h2>
              <div className="text-text-secondary leading-relaxed whitespace-pre-line">
                {producto.descripcion}
              </div>
            </div>
          </div>

          {/* Right side - Product Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border p-6 sticky top-24">
              {/* Category badge */}
              {producto.categoria_nombre && (
                <div className="mb-3">
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                    {producto.categoria_nombre}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl font-bold text-primary mb-4">
                {producto.titulo}
              </h1>

              {/* Short description */}
              {producto.descripcion_corta && (
                <p className="text-text-secondary mb-6">
                  {producto.descripcion_corta}
                </p>
              )}

              {/* Features */}
              <div className="mb-6">
                <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Incluye
                </h3>
                <ul className="space-y-2">
                  {producto.descripcion?.split('\n').filter(line => line.startsWith('•') || line.startsWith('-')).slice(0, 5).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature.replace(/^[•\-]\s*/, '')}</span>
                    </li>
                  ))}
                  {producto.descripcion?.split('\n').filter(line => line.startsWith('•') || line.startsWith('-')).length === 0 && (
                    <>
                      <li className="flex items-start gap-2 text-sm text-text-secondary">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Soporte técnico especializado</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-text-secondary">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Licencia oficial</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-text-secondary">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Actualizaciones incluidas</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleCartClick}
                  className={`w-full flex items-center justify-center gap-2 font-semibold py-4 px-6 rounded-lg transition-colors ${
                    inCart
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-secondary hover:bg-secondary/90 text-white"
                  }`}
                >
                  {inCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Agregado al formulario
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      Agregar al formulario 
                    </>
                  )}
                </button>
                
                <button 
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Escribir al vendedor
                </button>
                
                <Link 
                  href="/contacto"
                  className="w-full flex items-center justify-center gap-2 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Solicitar información
                </Link>
              </div>
            </div>

            {/* Related Products */}
            {productosRelacionados.length > 0 && (
              <div className="bg-white rounded-xl border p-4 mt-4">
                <h3 className="font-semibold text-primary mb-3">Otros productos</h3>
                <div className="space-y-2">
                  {productosRelacionados.map((prod) => (
                    <Link
                      key={prod.slug}
                      href={`/productos/${prod.slug}`}
                      className="block p-3 border rounded-lg hover:border-secondary hover:bg-secondary/5 transition-colors"
                    >
                      <span className="text-sm text-primary">{prod.titulo}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back to list */}
            <Link 
              href="/productos"
              className="flex items-center gap-2 text-text-muted hover:text-primary mt-4 p-3"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Volver a productos</span>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <section className="bg-primary py-16 mt-8">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Necesitas ayuda para elegir?
          </h2>
          <p className="text-white/70 mb-6">
            Nuestro equipo está dispuesto a ayudarte
          </p>
          <Link 
            href="/contacto"
            className="inline-flex items-center justify-center bg-accent text-primary font-semibold px-8 py-4 rounded-lg hover:bg-accent/90 transition-all"
          >
            Contáctanos
          </Link>
        </div>
      </section>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3"
          >
            {inCart ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <MessageSquare className="w-5 h-5 text-green-400" />
            )}
            <span className="text-sm font-medium">{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}