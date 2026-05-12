"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, type CartItem } from "@/composables";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, X, Plus } from "lucide-react";

interface ProductoCardProps {
  producto: {
    id: string;
    titulo: string;
    slug: string;
    descripcion: string;
    descripcion_corta: string | null;
    icono: string | null;
    imagen: string | null;
    categoria_nombre?: string;
    categoria_slug?: string;
    // Precio
    precio?: number | null;
    precio_anterior?: number | null;
    tipo_moneda?: string;
    mostrar_precio?: boolean;
  };
  categoriaNombre?: string;
}

export default function ProductoCard({ producto, categoriaNombre }: ProductoCardProps) {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const inCart = isInCart(producto.id);

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCart) {
      removeFromCart(producto.id);
      setToastMessage("Eliminado del carrito");
    } else {
      const item: CartItem = {
        id: producto.id,
        titulo: producto.titulo,
        slug: producto.slug,
        imagen: producto.imagen || undefined,
        categoria: producto.categoria_nombre || categoriaNombre,
        categoriaSlug: producto.categoria_slug,
      };
      addToCart(item);
      setToastMessage("Agregado al carrito");
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      <Link
        href={`/productos/${producto.slug}`}
        className="group bg-white rounded-xl border hover:shadow-lg transition-all duration-300 overflow-hidden relative"
      >
        {/* Imagen del producto */}
        <div className="aspect-[16/10] bg-gradient-to-br from-primary to-primary-light relative overflow-hidden">
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white/30 text-5xl font-bold">
                {producto.titulo.charAt(0)}
              </span>
            </div>
          )}
          {/* Overlay con botón */}
          <div className="absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-sm">
              Ver detalles
            </span>
          </div>

          {/* Badge de carrito */}
          <button
            onClick={handleCartClick}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              inCart
                ? "bg-green-500 text-white"
                : "bg-white/90 text-primary hover:bg-white"
            }`}
            title={inCart ? "Quitar del carrito" : "Agregar al carrito"}
          >
            {inCart ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>

        {/* Contenido del card */}
        <div className="p-4">
          <h3 className="font-semibold text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-1">
            {producto.titulo}
          </h3>
          <p className="text-sm text-text-secondary line-clamp-2">
            {producto.descripcion_corta || producto.descripcion?.substring(0, 100) + "..."}
          </p>

          {/* Precio */}
          {producto.mostrar_precio && producto.precio ? (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xl font-bold text-primary">
                {producto.tipo_moneda === 'PEN' ? 'S/' : '$'}{Number(producto.precio).toFixed(2)}
              </span>
              {producto.precio_anterior && Number(producto.precio_anterior) > Number(producto.precio) && (
                <span className="text-sm text-text-muted line-through">
                  {producto.tipo_moneda === 'PEN' ? 'S/' : '$'}{Number(producto.precio_anterior).toFixed(2)}
                </span>
              )}
            </div>
          ) : (
            <div className="mt-3 text-sm font-medium text-secondary">
              Por cotizar
            </div>
          )}

          {/* Footer del card */}
          <div className="mt-4 pt-3 border-t flex items-center justify-between">
            <span className="text-xs text-text-muted">
              {producto.categoria_nombre || categoriaNombre || "Producto"}
            </span>
            <span className="text-xs text-secondary font-medium">
              Ver más →
            </span>
          </div>
        </div>
      </Link>

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
              <ShoppingCart className="w-5 h-5 text-green-400" />
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
    </>
  );
}