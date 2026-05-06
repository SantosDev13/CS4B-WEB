"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, User } from "lucide-react";
import { useAuth } from "@/composables";
import NavbarCart from "./NavbarCart";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/productos", label: "Productos" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" }
  
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, mounted } = useAuth();

  // Efecto para scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-primary/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo sin fondo.png"
              alt="CS4B Logo"
              width={180}
              height={80}
              className="h-auto w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Inicio y Nosotros */}
            {navLinks.slice(0, 2).map((link) => {
              const isActive = pathname === link.href || 
                (link.href !== '/' && pathname?.startsWith(link.href));
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium transition-colors duration-200 group"
                >
                  <span className={isActive ? "text-white" : "text-white/70 hover:text-white"}>
                    {link.label}
                  </span>
                  {/* Underline indicator */}
                  <span 
                    className={`absolute left-0 -bottom-1 h-0.5 bg-accent transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
            
            
            {/* Blog y Contacto */}
            {navLinks.slice(2).map((link) => {
              const isActive = pathname === link.href || 
                (link.href !== '/' && pathname?.startsWith(link.href));
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium transition-colors duration-200 group"
                >
                  <span className={isActive ? "text-white" : "text-white/70 hover:text-white"}>
                    {link.label}
                  </span>
                  {/* Underline indicator */}
                  <span 
                    className={`absolute left-0 -bottom-1 h-0.5 bg-accent transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Carrito de consultas */}
            <NavbarCart />
            
            {mounted && isAuthenticated ? (
              <Link
                href="/admin"
                className="text-sm font-semibold text-primary bg-accent px-5 py-2.5 rounded-lg hover:bg-accent/90 transition-all hover:scale-105 flex items-center gap-2"
              >
                <User size={18} />
                Admin
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-white/70 hover:text-white px-4 py-2.5 transition-colors flex items-center gap-2"
                >
                  <LogIn size={18} />
                  
                </Link>
                <Link
                  href="/contacto"
                  className="text-sm font-semibold text-primary bg-accent px-5 py-2.5 rounded-lg hover:bg-accent/90 transition-all hover:scale-105"
                >
                  Contáctanos
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4 border-t border-white/10 mt-4"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || 
                    (link.href !== '/' && pathname?.startsWith(link.href));
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative text-sm font-medium py-2 flex items-center gap-2 ${
                        isActive ? "text-accent" : "text-white/70"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-accent rounded-r" />
                      )}
                    </Link>
                  );
                })}
                
                {/* Servicios en móvil - simple link */}
                <Link
                  href="/servicios"
                  className="relative text-sm font-medium py-2 text-white/70"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Servicios
                </Link>

                {/* Carrito en móvil */}
                <div onClick={() => setIsMobileMenuOpen(false)}>
                  <NavbarCart />
                </div>

                {mounted && isAuthenticated ? (
                  <Link
                    href="/admin"
                    className="text-sm font-semibold text-primary bg-accent px-5 py-2.5 rounded-lg text-center mt-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-sm font-semibold text-white/70 hover:text-white px-4 py-2.5 transition-colors flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn size={18} />
                      Login
                    </Link>
                    <Link
                      href="/contacto"
                      className="text-sm font-semibold text-primary bg-accent px-5 py-2.5 rounded-lg text-center mt-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Contáctanos
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
