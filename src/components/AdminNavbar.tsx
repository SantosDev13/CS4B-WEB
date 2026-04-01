"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  MessageSquare, 
  Shield,
  Settings,
  LogOut,
  ChevronDown,
  User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Mi Perfil", icon: <User className="w-4 h-4" /> },
  { href: "/admin/servicios", label: "Servicios", icon: <Package className="w-4 h-4" /> },
  { href: "/admin/posts", label: "Publicaciones", icon: <FileText className="w-4 h-4" /> },
  { href: "/admin/contactos", label: "Contactos", icon: <MessageSquare className="w-4 h-4" /> },
  { href: "/admin/categorias", label: "Categorías", icon: <Shield className="w-4 h-4" /> },
  { href: "/admin/configuracion", label: "Configuración", icon: <Settings className="w-4 h-4" /> },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const currentPage = navItems.find(item => pathname === item.href)?.label || "Mi Perfil";

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 px-6 flex items-center justify-between border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl"
    >
      {/* Left side - Page title */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white">
          {currentPage}
        </h1>
        <span className="text-slate-500 text-sm hidden sm:inline">
          • Panel CS4B
        </span>
      </div>

      {/* Right side - User menu */}
      <div className="flex items-center gap-4">
        {/* Home link */}
        <Link
          href="/"
          className="px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
        >
          Ver Sitio
        </Link>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.nombre?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-white text-sm hidden sm:inline">{user?.nombre}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown menu */}
          {isUserMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsUserMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-48 py-2 rounded-xl bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-xl z-20"
              >
                <div className="px-4 py-2 border-b border-slate-700/50">
                  <p className="text-xs text-slate-400">Conectado como</p>
                  <p className="text-white text-sm font-medium">{user?.nombre}</p>
                  <p className="text-xs text-cyan-400 capitalize">{user?.rol}</p>
                </div>
                
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Mi Perfil
                </Link>
                
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Ver Sitio
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
