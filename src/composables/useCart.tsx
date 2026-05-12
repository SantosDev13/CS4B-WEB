"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { STORAGE_KEYS } from "@/constants";

export interface CartItem {
  id: string;
  titulo: string;
  slug: string;
  imagen?: string;
  categoria?: string;
  categoriaSlug?: string;
}

interface CartContextType {
  servicios: CartItem[];
  addToCart: (servicio: CartItem) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  isInCart: (serviceId: string) => boolean;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = STORAGE_KEYS.cart;

export function CartProvider({ children }: { children: ReactNode }) {
  const [servicios, setServicios] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setServicios(parsed);
        }
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Guardar en localStorage cuando cambie el carrito
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(servicios));
    }
  }, [servicios, isLoaded]);

  const addToCart = (servicio: CartItem) => {
    setServicios((prev) => {
      // Evitar duplicados
      if (prev.some((item) => item.id === servicio.id)) {
        return prev;
      }
      return [...prev, servicio];
    });
  };

  const removeFromCart = (serviceId: string) => {
    setServicios((prev) => prev.filter((item) => item.id !== serviceId));
  };

  const clearCart = () => {
    setServicios([]);
  };

  const isInCart = (serviceId: string) => {
    return servicios.some((item) => item.id === serviceId);
  };

  const cartCount = servicios.length;

  return (
    <CartContext.Provider
      value={{
        servicios,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}