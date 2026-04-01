"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  MessageSquare, 
  Shield,
  Settings
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Panel de Administración", icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/admin/servicios", label: "Servicios", icon: <Package className="w-4 h-4" /> },
  { href: "/admin/posts", label: "Publicaciones", icon: <FileText className="w-4 h-4" /> },
  { href: "/admin/contactos", label: "Contactos", icon: <MessageSquare className="w-4 h-4" /> },
  { href: "/admin/categorias", label: "Categorías", icon: <Shield className="w-4 h-4" /> },
  { href: "/admin/configuracion", label: "Configuración", icon: <Settings className="w-4 h-4" /> },
];

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl"
    >
      {/* Empty header - only shows border */}
    </motion.header>
  );
}