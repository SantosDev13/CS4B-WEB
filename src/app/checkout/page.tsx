"use client";

import { useCart } from "@/composables";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Trash2, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { productos, removeFromCart, clearCart, cartCount } = useCart();

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Header */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80"
            alt="Checkout"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="relative container-custom">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a productos
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Finalizar Compra
          </h1>
          <p className="text-lg text-white/80">
            Revisa tu selección y completa tu solicitud
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-primary">
                      Tu Carrito
                    </h2>
                    <span className="px-2 py-0.5 text-sm bg-gray-100 text-gray-600 rounded-full">
                      {cartCount} {cartCount === 1 ? "producto" : "productos"}
                    </span>
                  </div>
                  {cartCount > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                    >
                      Vaciar carrito
                    </button>
                  )}
                </div>

                {productos.length === 0 ? (
                  <div className="p-12 text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Tu carrito está vacío</p>
                    <p className="text-sm text-gray-400 mb-6">
                      Agrega productos para continuar con tu compra
                    </p>
                    <Link
                      href="/productos"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Ver productos
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {productos.map((item) => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          {item.imagen ? (
                            <img
                              src={item.imagen}
                              alt={item.titulo}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-light">
                              <span className="text-white/50 text-lg font-medium">
                                {item.titulo.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-text-primary truncate">
                            {item.titulo}
                          </h3>
                          {item.categoria && (
                            <p className="text-sm text-text-secondary">
                              {item.categoria}
                            </p>
                          )}
                          <p className="text-sm text-text-muted mt-1">
                            Servicio digital
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label={`Eliminar ${item.titulo}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Resumen
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Productos</span>
                    <span className="font-medium">{cartCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">IGV</span>
                    <span className="font-medium">-</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-semibold text-primary">Total</span>
                    <span className="font-bold text-primary">Por cotizar</span>
                  </div>
                </div>

                <div className="bg-bg-light rounded-xl p-4 mb-6">
                  <p className="text-sm text-text-secondary">
                    Solicita tu cotización directamente por WhatsApp. Te responderemos en breve.
                  </p>
                </div>

                {/* WhatsApp Button */}

                {productos.length > 0 ? (
                  <a
                    href={`https://wa.me/51988227755?text=${encodeURIComponent(
                      `Hola CS4B, me interesa cotizar los siguientes productos:\n\n${productos.map(p => `• ${p.titulo}`).join('\n')}\n\nGracias!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Enviar por WhatsApp
                  </a>
                ) : (
                  <Link
                    href="/productos"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
                  >
                    Ver Productos
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}