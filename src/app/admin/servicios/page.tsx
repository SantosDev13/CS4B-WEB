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
  FileKey, 
  Shield, 
  Monitor, 
  Code, 
  BrainCircuit, 
  GraduationCap,
  Server,
  Image,
  LayoutGrid
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Categoria_servicio {
  id: string;
  nombre: string;
  slug: string;
}

interface Servicio {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  icon: string | null;
  imagen: string | null;
  categoria_servicio_id: string | null;
  tamanho: 'small' | 'medium' | 'large';
  orden: number;
  visible: boolean;
  created_at: string;
  categoria_servicio?: Categoria_servicio;
}

const ICONOS = [
  { value: 'FileKey', label: 'FileKey (Licencias)', Icon: FileKey },
  { value: 'Shield', label: 'Shield (Seguridad)', Icon: Shield },
  { value: 'Monitor', label: 'Monitor (Hardware)', Icon: Monitor },
  { value: 'Code', label: 'Code (Desarrollo)', Icon: Code },
  { value: 'BrainCircuit', label: 'BrainCircuit (Consultoría)', Icon: BrainCircuit },
  { value: 'GraduationCap', label: 'GraduationCap (Capacitación)', Icon: GraduationCap },
  { value: 'Server', label: 'Server (Infraestructura)', Icon: Server },
  { value: 'LayoutGrid', label: 'LayoutGrid (General)', Icon: LayoutGrid },
];

const TAMANOS = [
  { value: 'small', label: 'Pequeño (1 celda)' },
  { value: 'medium', label: 'Mediano (1x2)' },
  { value: 'large', label: 'Grande (2x2)' },
];

export default function AdminServiciosPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<Categoria_servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    slug: "",
    descripcion: "",
    icon: "FileKey",
    imagen: "",
    categoria_servicio_id: "",
    tamanho: "medium",
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
      const [servRes, catRes] = await Promise.all([
        fetch("/api/servicios?published=false", { 
          credentials: "include" 
        }),
        fetch("/api/categorias-servicios?published=false", { 
          credentials: "include" 
        }),
      ]);
      const servData = await servRes.json();
      const catData = await catRes.json();
      
      setServicios(Array.isArray(servData.servicios) ? servData.servicios : []);
      setCategorias(Array.isArray(catData.categorias) ? catData.categorias : []);
    } catch (err) {
      console.error("Error fetching servicios:", err);
      setServicios([]);
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
      const url = editingServicio 
        ? `/api/servicios/${editingServicio.id}`
        : "/api/servicios";
      
      const method = editingServicio ? "PUT" : "POST";

      const body = {
        titulo: formData.titulo,
        slug: formData.slug,
        descripcion: formData.descripcion,
        icon: formData.icon,
        imagen: formData.imagen || null,
        categoria_servicio_id: formData.categoria_servicio_id || null,
        tamanho: formData.tamanho,
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
      setEditingServicio(null);
      resetForm();
      fetchData();
    } catch (err) {
      setError("Error de conexión");
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
      icon: servicio.icon || "FileKey",
      imagen: servicio.imagen || "",
      categoria_servicio_id: servicio.categoria_servicio_id || "",
      tamanho: servicio.tamanho,
      orden: servicio.orden,
      visible: servicio.visible,
    });
    setShowModal(true);
  };

  const handleDelete = async (servicio: Servicio) => {
    if (!confirm(`¿Estás seguro de eliminar "${servicio.titulo}"?`)) return;

    try {
      const res = await fetch(`/api/servicios/${servicio.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Error deleting servicio:", err);
    }
  };

  const handleToggleVisibility = async (servicio: Servicio) => {
    try {
      await fetch(`/api/servicios/${servicio.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !servicio.visible }),
        credentials: "include",
      });
      fetchData();
    } catch (err) {
      console.error("Error toggling visibility:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      slug: "",
      descripcion: "",
      icon: "FileKey",
      imagen: "",
      categoria_servicio_id: "",
      tamanho: "medium",
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
      .replace(/(^-|-$)/g, "");
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

  const getIcono = (iconName: string) => {
    const iconObj = ICONOS.find(i => i.value === iconName);
    return iconObj ? iconObj.Icon : LayoutGrid;
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Servicios</h1>
          <p className="text-slate-400">Gestiona los servicios del sitio</p>
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
              <th className="text-left p-4 text-slate-400 font-medium">Icono</th>
              <th className="text-left p-4 text-slate-400 font-medium">Título</th>
              <th className="text-left p-4 text-slate-400 font-medium">Categoría</th>
              <th className="text-center p-4 text-slate-400 font-medium">Tamaño</th>
              <th className="text-center p-4 text-slate-400 font-medium">Visible</th>
              <th className="text-right p-4 text-slate-400 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredServicios.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No hay servicios disponibles
                </td>
              </tr>
            ) : (
              filteredServicios.map((servicio) => {
                const IconComponent = getIcono(servicio.icon || 'LayoutGrid');
                return (
                  <tr
                    key={servicio.id}
                    className="border-b border-slate-700/30 hover:bg-slate-800/30"
                  >
                    <td className="p-4">
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-cyan-400" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{servicio.titulo}</p>
                        <p className="text-slate-500 text-sm">{servicio.slug}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-300 capitalize">
                        {servicio.categoria_servicio?.nombre || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 capitalize">
                        {servicio.tamanho}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleVisibility(servicio)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          servicio.visible
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        }`}
                      >
                        {servicio.visible ? "Visible" : "Oculto"}
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
                );
              })
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="servicio-slug"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Categoría de Servicio
                    </label>
                    <select
                      value={formData.categoria_servicio_id}
                      onChange={(e) => setFormData({ ...formData, categoria_servicio_id: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="">Sin categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Icono
                    </label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      {ICONOS.map((icon) => (
                        <option key={icon.value} value={icon.value}>
                          {icon.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tamaño
                    </label>
                    <select
                      value={formData.tamanho}
                      onChange={(e) => setFormData({ ...formData, tamanho: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      {TAMANOS.map((tam) => (
                        <option key={tam.value} value={tam.value}>
                          {tam.label}
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
                      min={0}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 resize-none"
                    placeholder="Descripción del servicio"
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