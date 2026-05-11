"use client";

import { useState } from "react";
import { useCart } from "@/composables";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CartDrawer from "./CartDrawer";

export default function NavbarCart() {
  const { cartCount } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        title="Carrito de compras"
      >
        <ShoppingCart className="w-5 h-5 text-white" />

        {/* Badge con animación */}
        <AnimatePresence mode="wait">
          {cartCount > 0 && (
            <motion.div
              key={cartCount}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 25,
              }}
              className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-accent text-primary text-xs font-bold rounded-full flex items-center justify-center"
            >
              {cartCount > 99 ? "99+" : cartCount}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}