"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Trash2, 
  Mail, 
  Phone, 
  Building,
  MessageSquare,
  Check,
  X,
  Eye,
  EyeOff,
  Send,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Contacto {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  empresa: string | null;
  servicio_interes: string | null;
  mensaje: string;
  leido: boolean;
  respondido: boolean;
  respuesta: string | null;
  created_at: string;
  ip: string | null;
}

type FilterStatus = "todos" | "no_leidos" | "leidos" | "respondidos" | "pendientes";

export default function AdminContactosPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("todos");
  const [selectedContacto, setSelectedContacto] = useState<Contacto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    noLeidos: 0,
    respondidos: 0,
  });

  const fetchContactos = useCallback(async (search: string = "", status: string = "todos") => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status !== "todos") params.set("status", status);
      params.set("limit", "100"); // Get more results for search

      const res = await fetch(`/api/contactos?${params.toString()}`, {
        credentials: "include",
      });
      const data = await res.json();
      setContactos(data.contactos);
      setStats({
        total: data.total || 0,
        noLeidos: data.totalNoLeidos || 0,
        respondidos: data.totalRespondidos || 0,
      });
    } catch (err) {
      console.error("Error fetching contactos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when filters change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContactos(searchTerm, filterStatus);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, fetchContactos]);

  const handleMarkAsRead = async (contacto: Contacto) => {
    try {
      await fetch(`/api/contactos/${contacto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leido: true }),
        credentials: "include",
      });
      fetchContactos(searchTerm, filterStatus);
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleDelete = async (contacto: Contacto) => {
    if (!confirm(`¿Estás seguro de eliminar el mensaje de "${contacto.nombre}"?`)) return;

    try {
      const res = await fetch(`/api/contactos/${contacto.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        fetchContactos(searchTerm, filterStatus);
        if (selectedContacto?.id === contacto.id) {
          setSelectedContacto(null);
          setShowModal(false);
        }
      }
    } catch (err) {
      console.error("Error deleting contacto:", err);
    }
  };

  const handleRespond = async (contacto: Contacto, respuesta: string) => {
    try {
      await fetch(`/api/contactos/${contacto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respondido: true, respuesta }),
        credentials: "include",
      });
      fetchContactos(searchTerm, filterStatus);
      setShowModal(false);
      setSelectedContacto(null);
    } catch (err) {
      console.error("Error responding to contacto:", err);
    }
  };

  const openModal = (contacto: Contacto) => {
    setSelectedContacto(contacto);
    setShowModal(true);
    if (!contacto.leido) {
      handleMarkAsRead(contacto);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Contactos</h1>
          <p className="text-slate-400">Gestiona los mensajes recibidos del formulario de contacto</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-slate-400 text-sm">Total Mensajes</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.noLeidos}</p>
              <p className="text-slate-400 text-sm">No Leídos</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.respondidos}</p>
              <p className="text-slate-400 text-sm">Respondidos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
          >
            <option value="todos">Todos</option>
            <option value="no_leidos">No Leídos</option>
            <option value="leidos">Leídos</option>
            <option value="respondidos">Respondidos</option>
            <option value="pendientes">Pendientes</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-700/50">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left p-4 text-slate-400 font-medium">Estado</th>
              <th className="text-left p-4 text-slate-400 font-medium">Nombre</th>
              <th className="text-left p-4 text-slate-400 font-medium">Email</th>
              <th className="text-left p-4 text-slate-400 font-medium">Empresa</th>
              <th className="text-left p-4 text-slate-400 font-medium">Fecha</th>
              <th className="text-right p-4 text-slate-400 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contactos.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No hay contactos disponibles
                </td>
              </tr>
            ) : (
              contactos.map((contacto) => (
                <tr
                  key={contacto.id}
                  className={`border-b border-slate-700/30 hover:bg-slate-800/30 cursor-pointer ${
                    !contacto.leido ? "bg-slate-800/20" : ""
                  }`}
                  onClick={() => openModal(contacto)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {contacto.leido ? (
                        <Eye className="w-4 h-4 text-green-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-yellow-400" />
                      )}
                      {contacto.respondido ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className={`font-medium ${contacto.leido ? "text-white" : "text-cyan-400"}`}>
                      {contacto.nombre}
                    </p>
                  </td>
                  <td className="p-4 text-slate-300">{contacto.email}</td>
                  <td className="p-4 text-slate-400">
                    {contacto.empresa || "-"}
                  </td>
                  <td className="p-4 text-slate-400 text-sm">
                    {formatDate(contacto.created_at)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`mailto:${contacto.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                        title="Responder por email"
                      >
                        <Send className="w-4 h-4" />
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(contacto);
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showModal && selectedContacto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">Detalles del Contacto</h2>
                  <div className="flex items-center gap-2">
                    {selectedContacto.leido ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        <Eye className="w-3 h-3 inline mr-1" /> Leído
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                        <EyeOff className="w-3 h-3 inline mr-1" /> No leído
                      </span>
                    )}
                    {selectedContacto.respondido ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        <CheckCircle className="w-3 h-3 inline mr-1" /> Respondido
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-400">
                        <Clock className="w-3 h-3 inline mr-1" /> Pendiente
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <a 
                        href={`mailto:${selectedContacto.email}`}
                        className="text-white hover:text-cyan-400 transition-colors"
                      >
                        {selectedContacto.email}
                      </a>
                    </div>
                  </div>
                </div>

                {selectedContacto.telefono && (
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Teléfono</p>
                        <p className="text-white">{selectedContacto.telefono}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedContacto.empresa && (
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Building className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Empresa</p>
                        <p className="text-white">{selectedContacto.empresa}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedContacto.servicio_interes && (
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Servicio de Interés</p>
                        <p className="text-white capitalize">{selectedContacto.servicio_interes}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Fecha</p>
                      <p className="text-white">{formatDate(selectedContacto.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Mensaje</h3>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                  <p className="text-white whitespace-pre-wrap">{selectedContacto.mensaje}</p>
                </div>
              </div>

              {/* Response */}
              {selectedContacto.respondido && selectedContacto.respuesta && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">
                    <CheckCircle className="w-4 h-4 inline mr-1 text-green-400" />
                    Respuesta Enviada
                  </h3>
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                    <p className="text-white whitespace-pre-wrap">{selectedContacto.respuesta}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap justify-between gap-3 pt-4 border-t border-slate-700/50">
                <div className="flex gap-2">
                  {!selectedContacto.leido && (
                    <button
                      onClick={() => handleMarkAsRead(selectedContacto)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Marcar como leído
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedContacto)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
                
                {!selectedContacto.respondido && (
                  <a
                    href={`mailto:${selectedContacto.email}?subject=Re: Contacto CS4B`}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Responder por email
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}