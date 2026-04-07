"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

// Servicios se maneja con Mega Menú después de Nosotros

// Datos para el Mega Menú de Servicios
const serviciosMegaMenu = [
  {
    titulo: "Transformación Digital & Arquitectura Empresarial",
    slug: "transformacion-digital",
    subservicios: [
      { label: "Diagnóstico digital empresarial", href: "/servicios/transformacion-digital" },
      { label: "Arquitectura de soluciones", href: "/servicios/transformacion-digital" },
      { label: "Hoja de ruta de transformación", href: "/servicios/transformacion-digital" },
      { label: "Gestión del cambio organizacional", href: "/servicios/transformacion-digital" },
      { label: "Estrategia de datos y analytics", href: "/servicios/transformacion-digital" },
      { label: "Optimización de procesos", href: "/servicios/transformacion-digital" },
    ],
  },
  {
    titulo: "Licencias Microsoft",
    slug: "licencias-microsoft",
    subservicios: [
      { label: "Microsoft 365 para empresas", href: "/servicios/licencias-microsoft" },
      { label: "Windows 10/11 Professional", href: "/servicios/licencias-microsoft" },
      { label: "Azure Cloud Services", href: "/servicios/licencias-microsoft" },
      { label: "Exchange Server", href: "/servicios/licencias-microsoft" },
      { label: "SQL Server", href: "/servicios/licencias-microsoft" },
    ],
  },
  {
    titulo: "Antivirus y Seguridad",
    slug: "antivirus-seguridad",
    subservicios: [
      { label: "Antivirus empresariales", href: "/servicios/antivirus-seguridad" },
      { label: "Firewall y protección perimetral", href: "/servicios/antivirus-seguridad" },
      { label: "Gestión de identidades", href: "/servicios/antivirus-seguridad" },
      { label: "Protección contra ransomware", href: "/servicios/antivirus-seguridad" },
      { label: "Monitoreo 24/7", href: "/servicios/antivirus-seguridad" },
    ],
  },
  {
    titulo: "Hardware y Equipos",
    slug: "hardware-equipos",
    subservicios: [
      { label: "Computadoras y laptops", href: "/servicios/hardware-equipos" },
      { label: "Servidores y networking", href: "/servicios/hardware-equipos" },
      { label: "Impresoras y multifuncionales", href: "/servicios/hardware-equipos" },
      { label: "Equipos de videoconferencia", href: "/servicios/hardware-equipos" },
      { label: "Mantenimiento preventivo", href: "/servicios/hardware-equipos" },
    ],
  },
  {
    titulo: "Desarrollo de Software",
    slug: "desarrollo-software",
    subservicios: [
      { label: "Aplicaciones web", href: "/servicios/desarrollo-software" },
      { label: "Sistemas ERP/CRM", href: "/servicios/desarrollo-software" },
      { label: "Apps móviles (iOS/Android)", href: "/servicios/desarrollo-software" },
      { label: "Integraciones y APIs", href: "/servicios/desarrollo-software" },
      { label: "Automatización de procesos", href: "/servicios/desarrollo-software" },
    ],
  },
  {
    titulo: "Consultoría IT",
    slug: "consultoria-it",
    subservicios: [
      { label: "Auditoría de sistemas", href: "/servicios/consultoria-it" },
      { label: "Planificación estratégica IT", href: "/servicios/consultoria-it" },
      { label: "Arquitectura de soluciones", href: "/servicios/consultoria-it" },
      { label: "Gestión de proyectos", href: "/servicios/consultoria-it" },
      { label: "Optimización de costos", href: "/servicios/consultoria-it" },
    ],
  },
  {
    titulo: "Docencia y Capacitación",
    slug: "capacitacion",
    subservicios: [
      { label: "Microsoft 365", href: "/servicios/capacitacion" },
      { label: "Herramientas de productividad", href: "/servicios/capacitacion" },
      { label: "Ciberseguridad básica", href: "/servicios/capacitacion" },
      { label: "Gestión de proyectos", href: "/servicios/capacitacion" },
      { label: "Análisis de datos", href: "/servicios/capacitacion" },
    ],
  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Efecto para cerrar Mega Menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };

    if (isMegaMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMegaMenuOpen]);

  // Efecto para scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMegaMenuOpen
          ? "bg-primary/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo_cs4b.png"
              alt="CS4B Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold tracking-tight text-white">
              CS<span className="text-accent">4</span>B
            </span>
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
            
            {/* Botón Servicios con Mega Menú - Después de Nosotros */}
            <div className="relative" ref={megaMenuRef}>
              <button
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
                aria-expanded={isMegaMenuOpen}
                aria-haspopup="true"
                aria-label="Ver servicios"
              >
                Servicios
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Mega Menú - Estilo Minsait */}
              <AnimatePresence>
                {isMegaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="fixed top-14 left-0 right-0 w-screen bg-primary shadow-2xl z-50"
                    role="menu"
                    aria-label="Menú de servicios"
                  >
                    <div className="max-w-7xl mx-auto px-6 py-8">
                      <div className="grid grid-cols-4 gap-8">
                        {serviciosMegaMenu.map((servicio) => (
                          <div key={servicio.slug}>
                            {/* Título del servicio --link a página individual */}
                            <Link
                              href={`/servicios/${servicio.slug}`}
                              onClick={() => setIsMegaMenuOpen(false)}
                              className="block font-semibold text-white text-lg mb-3 hover:text-accent transition-colors cursor-pointer"
                              role="menuitem"
                            >
                              {servicio.titulo}
                            </Link>
                            {/* Subservicios */}
                            <div className="flex flex-col gap-2">
                              {servicio.subservicios.map((subservicio, i) => (
                                <Link 
                                  key={i} 
                                  href={subservicio.href}
                                  onClick={() => setIsMegaMenuOpen(false)}
                                  className="text-white/70 hover:text-white text-sm transition-colors cursor-pointer"
                                >
                                  {subservicio.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Footer del Mega Menú */}
                      <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                        <Link
                          href="/servicios"
                          onClick={() => setIsMegaMenuOpen(false)}
                          className="text-accent hover:text-white font-medium transition-colors flex items-center gap-2"
                        >
                          Ver todos los servicios
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => setIsMegaMenuOpen(false)}
                          className="text-white/70 hover:text-white text-sm transition-colors cursor-pointer"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
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
            {isAuthenticated ? (
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
                  Login
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
                
                {/* Servicios en móvil - igual que en desktop */}
                <button
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                  className="flex items-center justify-between text-sm font-medium py-2 text-white/70 cursor-pointer"
                >
                  <span>Servicios</span>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {/* Submenú de servicios en móvil */}
                <AnimatePresence>
                  {isMegaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 border-l-2 border-white/20 ml-2"
                    >
                      {serviciosMegaMenu.map((servicio) => (
                        <Link
                          key={servicio.slug}
                          href={`/servicios/${servicio.slug}`}
                          className="block text-sm text-white/60 py-2 hover:text-white transition-colors"
                          onClick={() => {
                            setIsMegaMenuOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {servicio.titulo}
                        </Link>
                      ))}
                      <Link
                        href="/servicios"
                        className="block text-sm font-medium text-accent py-2"
                        onClick={() => {
                          setIsMegaMenuOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Ver todos los servicios
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isAuthenticated ? (
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
