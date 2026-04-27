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
  Folder,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { slugify } from "@/lib/utils";

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  color: string;
  orden: number;
  created_at: string;
}

// Colores predefinidos para las categorías
const colorOptions = [
  { value: "#3FA9F5", label: "Azul" },
  { value: "#B6E356", label: "Verde Lima" },
  { value: "#FF6B6B", label: "Rojo" },
  { value: "#FFD93D", label: "Amarillo" },
  { value: "#6BCB77", label: "Verde" },
  { value: "#9B59B6", label: "Púrpura" },
  { value: "#E67E22", label: "Naranja" },
  { value: "#1ABC9C", label: "Turquesa" },
];

export default function AdminCategoriasPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    slug: "",
    descripcion: "",
    color: "#3FA9F5",
    orden: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const res = await fetch("/api/categorias_posts", {
        credentials: "include",
      });
      const data = await res.json();
      setCategorias(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Error fetching categorias:", err);
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
        ? `/api/categorias_posts/${editingCategoria.id}`
        : "/api/categorias_posts";

      const method = editingCategoria ? "PUT" : "POST";

      const body = {
        nombre: formData.nombre,
        slug: formData.slug,
        descripcion: formData.descripcion || null,
        color: formData.color,
        orden: formData.orden,
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
      fetchCategorias();
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setFormData({
      nombre: categoria.nombre,
      slug: categoria.slug,
      descripcion: categoria.descripcion || "",
      color: categoria.color,
      orden: categoria.orden,
    });
    setShowModal(true);
  };

  const handleDelete = async (categoria: Categoria) => {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) return;

    try {
      const res = await fetch(`/api/categorias_posts/${categoria.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        fetchCategorias();
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar");
      }
    } catch (err) {
      console.error("Error deleting categoria:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      slug: "",
      descripcion: "",
      color: "#3FA9F5",
      orden: 0,
    });
  };

  const handleNombreChange = (nombre: string) => {
    setFormData({
      ...formData,
      nombre,
      slug: editingCategoria ? formData.slug : slugify(nombre),
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
          <h1 className="text-2xl font-bold text-white">Categorías</h1>
          <p className="text-slate-400">Gestiona las categorías del blog</p>
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
              <th className="text-left p-4 text-slate-400 font-medium">Nombre</th>
              <th className="text-left p-4 text-slate-400 font-medium">Slug</th>
              <th className="text-left p-4 text-slate-400 font-medium">Color</th>
              <th className="text-center p-4 text-slate-400 font-medium">Orden</th>
              <th className="text-right p-4 text-slate-400 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategorias.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
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
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: categoria.color + "20" }}
                      >
                        <Folder className="w-5 h-5" style={{ color: categoria.color }} />
                      </div>
                      <div>
                        <p className="text-white font-medium">{categoria.nombre}</p>
                        {categoria.descripcion && (
                          <p className="text-slate-500 text-sm truncate max-w-xs">
                            {categoria.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-400 font-mono text-sm">
                      {categoria.slug}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-slate-600"
                        style={{ backgroundColor: categoria.color }}
                      />
                      <span className="text-slate-400 text-sm">{categoria.color}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-slate-300">{categoria.orden}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
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
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
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
                    placeholder="Descripción opcional de la categoría"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, color: color.value })}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            formData.color === color.value
                              ? "border-white scale-110"
                              : "border-slate-600 hover:scale-105"
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.label}
                        />
                      ))}
                    </div>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="mt-2 w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50"
                      placeholder="#000000"
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
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
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