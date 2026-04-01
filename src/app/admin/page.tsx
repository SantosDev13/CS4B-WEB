"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Clock, Lock, Shield, Edit3, Save, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
  });

  const handleSave = () => {
    // Here you would call an API to update the user
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenido, <span className="text-cyan-400">{user?.nombre}</span>!
          </h1>
          <p className="text-slate-400">
            {user?.rol === 'admin' ? 'Administrador' : 'Editor'} - Panel de Control CS4B
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />

          <div className="relative z-10 p-8">
            {/* Avatar */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                  <span className="text-5xl font-bold text-white">
                    {user?.nombre?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <User className="w-5 h-5 text-cyan-400" />
                <div className="flex-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Nombre</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full bg-transparent text-white font-medium focus:outline-none border-b border-slate-600 focus:border-cyan-500"
                    />
                  ) : (
                    <p className="text-white font-medium">{user?.nombre}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <Mail className="w-5 h-5 text-cyan-400" />
                <div className="flex-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent text-white font-medium focus:outline-none border-b border-slate-600 focus:border-cyan-500"
                    />
                  ) : (
                    <p className="text-white font-medium">{user?.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <Shield className="w-5 h-5 text-cyan-400" />
                <div className="flex-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Rol</p>
                  <p className="text-white font-medium capitalize">{user?.rol}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <div className="flex-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Fecha de Alta</p>
                  <p className="text-white font-medium">{new Date().toLocaleDateString('es-ES')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <Clock className="w-5 h-5 text-cyan-400" />
                <div className="flex-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Último Login</p>
                  <p className="text-white font-medium">Ahora mismo</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <Lock className="w-5 h-5 text-cyan-400" />
                <div className="flex-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Contraseña</p>
                  <p className="text-white font-medium">••••••••••••</p>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="mt-6 flex justify-end gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar Perfil
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats / Quick Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="text-3xl font-bold text-white">5</p>
              <p className="text-slate-400">Servicios</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">5</p>
              <p className="text-slate-400">Categorías</p>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Actividad Reciente</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <p className="text-slate-300 text-sm">Sesión iniciada</p>
                <span className="text-slate-500 text-xs ml-auto">Ahora</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <p className="text-slate-300 text-sm">Base de datos conectada</p>
                <span className="text-slate-500 text-xs ml-auto">Hoy</span>
              </div>
            </div>
          </motion.div>

          {/* System Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Información del Sistema</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Versión</span>
                <span className="text-white">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Entorno</span>
                <span className="text-yellow-400">Desarrollo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estado</span>
                <span className="text-green-400">● Activo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
