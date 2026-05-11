"use client";

import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart, type CartItem } from "@/composables/useCart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { servicios, removeFromCart, clearCart, cartCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gray-900 dark:text-white" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Carrito de Compras
                </h2>
                <span className="px-2 py-0.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                  {cartCount}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Cerrar carrito"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {servicios.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    Tu carrito está vacío
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Agrega productos para comenzar
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {servicios.map((item) => (
                    <CartItemRow key={item.id} item={item} onRemove={removeFromCart} />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {servicios.length > 0 && (
              <footer className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <button
                  onClick={clearCart}
                  className="mb-3 w-full py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  Vaciar carrito
                </button>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-accent hover:bg-accent/90 text-primary font-semibold rounded-lg transition-colors"
                >
                  Continuar Compra
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

interface CartItemRowProps {
  item: CartItem;
  onRemove: (id: string) => void;
}

function CartItemRow({ item, onRemove }: CartItemRowProps) {
  return (
    <li className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {/* Placeholder icon */}
      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <ShoppingBag className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {item.titulo}
        </h3>
        {item.categoria && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {item.categoria}
          </p>
        )}
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(item.id)}
        className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
        aria-label={`Eliminar ${item.titulo}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );
}