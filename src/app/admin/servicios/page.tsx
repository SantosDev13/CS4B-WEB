"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff,
  X,
  Save,
  Package,
  Image
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  color: string | null;
  orden: number;
}

interface Servicio {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta: string | null;
  icono: string | null;
  imagen: string | null;
  categoria: string;
  orden: number;
  visible: boolean;
  created_at: string;
}

export default function AdminServiciosPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    slug: "",
    descripcion: "",
    descripcion_corta: "",
    icono: "",
    imagen: "",
    categoria: "",
    orden: 0,
    visible: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServicios();
    fetchCategorias();
  }, []);

  const fetchServicios = async () => {
    try {
      const res = await fetch("/api/servicios?visible=false", {
        credentials: "include",
      });
      const data = await res.json();
      setServicios(data);
    } catch (err) {
      console.error("Error fetching servicios:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await fetch("/api/categorias");
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      console.error("Error fetching categorias:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Validar longitudes antes de enviar
    if (formData.slug.length > 50) {
      setError("El slug debe tener máximo 50 caracteres");
      setSaving(false);
      return;
    }

    if (formData.categoria.length > 50) {
      setError("La categoría debe tener máximo 50 caracteres");
      setSaving(false);
      return;
    }

    try {
      const url = editingServicio 
        ? `/api/servicios/${editingServicio.slug}`
        : "/api/servicios";

      const method = editingServicio ? "PUT" : "POST";

      const body = {
        titulo: formData.titulo,
        slug: formData.slug,
        descripcion: formData.descripcion,
        descripcion_corta: formData.descripcion_corta || null,
        icono: formData.icono || null,
        imagen: formData.imagen || null,
        categoria: formData.categoria,
        orden: formData.orden,
        visible: formData.visible,
      };

      // Debug: ver cookies que se envían
      const cookies = document.cookie;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `Error ${res.status}`);
        setSaving(false);
        return;
      }

      setShowModal(false);
      setEditingServicio(null);
      resetForm();
      fetchServicios();
    } catch (err) {
      console.error("Error completo:", err);
      setError("Error de conexión: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (servicio: Servicio) => {
    setEditingServicio(servicio);
    setFormData({
      titulo: servicio.titulo,
      slug: servicio.slug,
      descripcion: servicio.descripcion,
      descripcion_corta: servicio.descripcion_corta || "",
      icono: servicio.icono || "",
      imagen: servicio.imagen || "",
      categoria: servicio.categoria,
      orden: servicio.orden,
      visible: servicio.visible,
    });
    setShowModal(true);
  };

  const handleDelete = async (servicio: Servicio) => {
    if (!confirm(`¿Estás seguro de eliminar "${servicio.titulo}"?`)) return;

    try {
      const res = await fetch(`/api/servicios/${servicio.slug}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        fetchServicios();
      } else {
        const data = await res.json();
        setError(data.error || "Error al eliminar");
      }
    } catch (err) {
      console.error("Error deleting servicio:", err);
    }
  };

  const handleToggleVisibility = async (servicio: Servicio) => {
    try {
      const res = await fetch(`/api/servicios/${servicio.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !servicio.visible }),
        credentials: "include",
      });
      
      if (res.ok) {
        fetchServicios();
      } else {
        const data = await res.json();
        setError(data.error || "Error al cambiar visibilidad");
      }
    } catch (err) {
      console.error("Error toggling visibility:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      slug: "",
      descripcion: "",
      descripcion_corta: "",
      icono: "",
      imagen: "",
      categoria: "",
      orden: 0,
      visible: true,
    });
  };

  const generateSlug = (titulo: string) => {
    return titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 50); // Limitar a 50 caracteres para la DB
  };

  const handleTituloChange = (titulo: string) => {
    setFormData({
      ...formData,
      titulo,
      slug: editingServicio ? formData.slug : generateSlug(titulo),
    });
  };

  const filteredServicios = servicios.filter((s) =>
    s.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Servicios</h1>
          <p className="text-slate-400">Gestiona los servicios de la empresa</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingServicio(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nuevo Servicio
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar servicios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-700/50">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left p-4 text-slate-400 font-medium">Título</th>
              <th className="text-left p-4 text-slate-400 font-medium">Categoría</th>
              <th className="text-left p-4 text-slate-400 font-medium">Orden</th>
              <th className="text-center p-4 text-slate-400 font-medium">Visible</th>
              <th className="text-right p-4 text-slate-400 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredServicios.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No hay servicios disponibles
                </td>
              </tr>
            ) : (
              filteredServicios.map((servicio) => (
                <tr
                  key={servicio.id}
                  className="border-b border-slate-700/30 hover:bg-slate-800/30"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {servicio.imagen ? (
                        <img
                          src={servicio.imagen}
                          alt={servicio.titulo}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                          <Package className="w-6 h-6 text-slate-500" />
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{servicio.titulo}</p>
                        <p className="text-slate-500 text-sm">{servicio.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 capitalize">
                      {servicio.categoria}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{servicio.orden}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleVisibility(servicio)}
                      className={`p-2 rounded-lg transition-colors ${
                        servicio.visible
                          ? "text-green-400 hover:bg-green-500/10"
                          : "text-slate-500 hover:bg-slate-700/50"
                      }`}
                    >
                      {servicio.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(servicio)}
                        className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(servicio)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
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
                <h2 className="text-xl font-bold text-white">
                  {editingServicio ? "Editar Servicio" : "Nuevo Servicio"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => handleTituloChange(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                      placeholder="Nombre del servicio"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.substring(0, 50) })}
                      required
                      maxLength={50}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                      placeholder="servicio-slug (max 50 caracteres)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Descripción Corta
                  </label>
                  <input
                    type="text"
                    value={formData.descripcion_corta}
                    onChange={(e) => setFormData({ ...formData, descripcion_corta: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    placeholder="Breve descripción para tarjetas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 resize-none"
                    placeholder="Descripción completa del servicio"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      {categorias.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Orden
                    </label>
                    <input
                      type="number"
                      value={formData.orden}
                      onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Icono (URL)
                    </label>
                    <input
                      type="text"
                      value={formData.icono}
                      onChange={(e) => setFormData({ ...formData, icono: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Imagen (URL)
                    </label>
                    <input
                      type="text"
                      value={formData.imagen}
                      onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="visible"
                    checked={formData.visible}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="w-5 h-5 rounded bg-slate-900 border-slate-600 text-cyan-500 focus:ring-cyan-500/50"
                  />
                  <label htmlFor="visible" className="text-slate-300">
                    Visible en el sitio
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
