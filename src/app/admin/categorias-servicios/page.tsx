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
  ExternalLink,
  Image,
  Link
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Categoria_servicio {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
  link: string | null;
  orden: number;
  visible: boolean;
  created_at: string;
}

export default function AdminCategoriasServiciosPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [categorias, setCategorias] = useState<Categoria_servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria_servicio | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    slug: "",
    descripcion: "",
    imagen: "",
    link: "",
    orden: 0,
    visible: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/categorias-servicios?published=false", { 
        credentials: "include" 
      });
      const data = await res.json();
      
      if (data.error) {
        console.error("API error:", data.error);
        setCategorias([]);
      } else {
        setCategorias(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error("Error fetching categorias_servicios:", err);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingCategoria 
        ? `/api/categorias-servicios/${editingCategoria.id}`
        : "/api/categorias-servicios";
      
      const method = editingCategoria ? "PUT" : "POST";

      const body = {
        nombre: formData.nombre,
        slug: formData.slug,
        descripcion: formData.descripcion || null,
        imagen: formData.imagen || null,
        link: formData.link || null,
        orden: parseInt(String(formData.orden)) || 0,
        visible: formData.visible,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al guardar");
        return;
      }

      setShowModal(false);
      setEditingCategoria(null);
      resetForm();
      fetchData();
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (categoria: Categoria_servicio) => {
    setEditingCategoria(categoria);
    setFormData({
      nombre: categoria.nombre,
      slug: categoria.slug,
      descripcion: categoria.descripcion || "",
      imagen: categoria.imagen || "",
      link: categoria.link || "",
      orden: categoria.orden,
      visible: categoria.visible,
    });
    setShowModal(true);
  };

  const handleDelete = async (categoria: Categoria_servicio) => {
    if (!confirm(`¿Estás seguro de eliminar "${categoria.nombre}"?`)) return;

    try {
      const res = await fetch(`/api/categorias-servicios/${categoria.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Error deleting categoria:", err);
    }
  };

  const handleToggleVisibility = async (categoria: Categoria_servicio) => {
    try {
      await fetch(`/api/categorias-servicios/${categoria.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !categoria.visible }),
        credentials: "include",
      });
      fetchData();
    } catch (err) {
      console.error("Error toggling visibility:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      slug: "",
      descripcion: "",
      imagen: "",
      link: "",
      orden: 0,
      visible: true,
    });
  };

  const generateSlug = (nombre: string) => {
    return nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNombreChange = (nombre: string) => {
    setFormData({
      ...formData,
      nombre,
      slug: editingCategoria ? formData.slug : generateSlug(nombre),
    });
  };

  const filteredCategorias = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-white">Categorías de Servicios</h1>
          <p className="text-slate-400">Gestiona las categorías (padre) de servicios</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingCategoria(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nueva Categoría
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar categorías..."
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
              <th className="text-left p-4 text-slate-400 font-medium">Imagen</th>
              <th className="text-left p-4 text-slate-400 font-medium">Nombre</th>
              <th className="text-left p-4 text-slate-400 font-medium">Slug</th>
              <th className="text-center p-4 text-slate-400 font-medium">Orden</th>
              <th className="text-center p-4 text-slate-400 font-medium">Visible</th>
              <th className="text-right p-4 text-slate-400 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategorias.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No hay categorías disponibles
                </td>
              </tr>
            ) : (
              filteredCategorias.map((categoria) => (
                <tr
                  key={categoria.id}
                  className="border-b border-slate-700/30 hover:bg-slate-800/30"
                >
                  <td className="p-4">
                    {categoria.imagen ? (
                      <img
                        src={categoria.imagen}
                        alt={categoria.nombre}
                        className="w-16 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                        <Image className="w-5 h-5 text-slate-500" />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-white font-medium">{categoria.nombre}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-400 text-sm">{categoria.slug}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-slate-300">{categoria.orden}</span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleVisibility(categoria)}
                      className={`p-2 rounded-full transition-colors ${
                        categoria.visible
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      }`}
                      title={categoria.visible ? "Ocultar" : "Mostrar"}
                    >
                      {categoria.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {categoria.link && (
                        <a
                          href={categoria.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleEdit(categoria)}
                        className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(categoria)}
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
                  {editingCategoria ? "Editar Categoría" : "Nueva Categoría"}
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
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => handleNombreChange(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                      placeholder="Nombre de la categoría"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                      placeholder="categoria-slug"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 resize-none"
                    placeholder="Descripción de la categoría"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Link (URL)
                    </label>
                    <input
                      type="text"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                      placeholder="/servicios#categoria"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Orden
                    </label>
                    <input
                      type="number"
                      value={formData.orden}
                      onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                      min={0}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
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