"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  MessageSquare,
  Shield,
  Briefcase,
  Folder,
  Wrench
} from "lucide-react";
import { useAuth } from "@/composables";
import AdminNavbar from "@/components/admin/AdminNavbar";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Panel de Administración", icon: <LayoutDashboard className="w-5 h-5" /> },
  { href: "/admin/categorias-productos", label: "Categorías Productos", icon: <Folder className="w-5 h-5" /> },
  { href: "/admin/productos", label: "Productos", icon: <Briefcase className="w-5 h-5" /> },
  { href: "/admin/servicios", label: "Servicios", icon: <Wrench className="w-5 h-5" /> },
  { href: "/admin/categorias", label: "Categorías Blog", icon: <Shield className="w-5 h-5" /> },
  { href: "/admin/posts", label: "Publicaciones", icon: <FileText className="w-5 h-5" /> },
  { href: "/admin/contactos", label: "Contactos", icon: <MessageSquare className="w-5 h-5" /> },
  { href: "/admin/configuracion", label: "Configuración", icon: <Settings className="w-5 h-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Admin Navbar */}
      <AdminNavbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 260 : 80 }}
          className={`fixed left-0 top-16 bottom-0 z-40 transition-all duration-300
            bg-slate-900/50 backdrop-blur-xl border-r border-slate-700/30
            ${sidebarOpen ? 'px-4' : 'px-2'}`}
        >
          {/* Toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            {sidebarOpen ? <X size={14} /> : <Menu size={14} />}
          </button>

          {/* Navigation */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              // Exact match, or exact path match (not partial)
              const isExactMatch = pathname === item.href;
              const isChildPage = item.href !== '/admin' && pathname.startsWith(item.href + '/');
              const isActive = isExactMatch || isChildPage;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                >
                  <span className={isActive ? 'text-cyan-400' : ''}>{item.icon}</span>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-medium text-sm"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User info at bottom */}
          <div className="absolute bottom-6 left-0 right-0 px-2">
            <div className={`flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">{user.nombre?.charAt(0).toUpperCase()}</span>
              </div>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-white truncate">{user.nombre}</p>
                  <p className="text-xs text-slate-400 truncate capitalize">{user.rol}</p>
                </motion.div>
              )}
            </div>
            
            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full mt-2 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all ${!sidebarOpen && 'justify-center'}`}
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium text-sm">Cerrar Sesión</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main 
          className={`flex-1 transition-all duration-300 pt-4 pb-8 px-6 ${
            sidebarOpen ? 'ml-[260px]' : 'ml-[80px]'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
