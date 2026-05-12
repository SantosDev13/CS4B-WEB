"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X,
  Save,
  Image
} from "lucide-react";
import { useAuth } from "@/composables";
import { slugify } from "@/lib/utils";

interface Categoria_producto {
  id: string;
  nombre: string;
  slug: string;
}

interface Producto {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  icono: string | null;
  imagen: string | null;
  categoria_producto_id: string | null;
  orden: number;
  visible: boolean;
  precio: number | null;
  precio_anterior: number | null;
  tipo_moneda: string;
  mostrar_precio: boolean;
  created_at: string;
  categoria_producto?: Categoria_producto;
}

const MONEDAS = [
  { value: 'PEN', label: 'S/ PEN (Soles)' },
  { value: 'USD', label: '$ USD (Dólares)' },
];

export default function AdminProductosPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria_producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    slug: "",
    descripcion: "",
    imagen: "",
    categoria_producto_id: "",
    orden: 0,
    visible: true,
    // Precio
    precio: "",
    precio_anterior: "",
    tipo_moneda: "PEN",
    mostrar_precio: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/productos?published=false", { 
          credentials: "include" 
        }),
        fetch("/api/categorias-productos?published=false", { 
          credentials: "include" 
        }),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      
      setProductos(Array.isArray(prodData.data) ? prodData.data : []);
      setCategorias(Array.isArray(catData.data) ? catData.data : []);
    } catch (err) {
      console.error("Error fetching productos:", err);
      setProductos([]);
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
      const url = editingProducto 
        ? `/api/productos/${editingProducto.id}`
        : "/api/productos";
      
      const method = editingProducto ? "PUT" : "POST";

      const selectedCat = categorias.find(c => c.id === formData.categoria_producto_id);
      
      const body = {
        titulo: formData.titulo,
        slug: formData.slug,
        descripcion: formData.descripcion,
        imagen: formData.imagen || null,
        categoria_producto_id: formData.categoria_producto_id || null,
        categoria: selectedCat?.nombre || null,
        orden: parseInt(String(formData.orden)) || 0,
        visible: formData.visible,
        // Precio
        precio: formData.precio ? parseFloat(formData.precio) : null,
        precio_anterior: formData.precio_anterior ? parseFloat(formData.precio_anterior) : null,
        tipo_moneda: formData.tipo_moneda,
        mostrar_precio: formData.mostrar_precio,
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
      setEditingProducto(null);
      resetForm();
      fetchData();
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setFormData({
      titulo: producto.titulo,
      slug: producto.slug,
      descripcion: producto.descripcion,
      imagen: producto.imagen || "",
      categoria_producto_id: producto.categoria_producto_id || "",
      orden: producto.orden,
      visible: producto.visible,
      // Precio
      precio: producto.precio ? String(producto.precio) : "",
      precio_anterior: producto.precio_anterior ? String(producto.precio_anterior) : "",
      tipo_moneda: producto.tipo_moneda || "PEN",
      mostrar_precio: producto.mostrar_precio ?? true,
    });
    setShowModal(true);
  };

  const handleDelete = async (producto: Producto) => {
    if (!confirm(`¿Estás seguro de eliminar "${producto.titulo}"?`)) return;

    try {
      const res = await fetch(`/api/productos/${producto.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Error deleting producto:", err);
    }
  };

  const handleToggleVisibility = async (producto: Producto) => {
    try {
      await fetch(`/api/productos/${producto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !producto.visible }),
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
      imagen: "",
      categoria_producto_id: "",
      orden: 0,
      visible: true,
      // Precio
      precio: "",
      precio_anterior: "",
      tipo_moneda: "PEN",
      mostrar_precio: true,
    });
  };

  const handleTituloChange = (titulo: string) => {
    setFormData({
      ...formData,
      titulo,
      slug: editingProducto ? formData.slug : slugify(titulo),
    });
  };

  const filteredProductos = productos.filter((s) =>
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
          <h1 className="text-2xl font-bold text-white">Productos</h1>
          <p className="text-slate-400">Gestiona los productos del sitio</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingProducto(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar productos..."
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
              <th className="text-left p-4 text-slate-400 font-medium">Título</th>
              <th className="text-left p-4 text-slate-400 font-medium">Categoría</th>
              <th className="text-center p-4 text-slate-400 font-medium">Precio</th>
              <th className="text-center p-4 text-slate-400 font-medium">Visible</th>
              <th className="text-right p-4 text-slate-400 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No hay productos disponibles
                </td>
              </tr>
            ) : (
              filteredProductos.map((producto) => {
                return (
                  <tr
                    key={producto.id}
                    className="border-b border-slate-700/30 hover:bg-slate-800/30"
                  >
                    <td className="p-4">
                      {producto.imagen ? (
                        <img
                          src={producto.imagen}
                          alt={producto.titulo}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 font-medium text-sm">
                          {producto.titulo.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{producto.titulo}</p>
                        <p className="text-slate-500 text-sm">{producto.slug}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-300 capitalize">
                        {producto.categoria_producto?.nombre || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {producto.mostrar_precio && producto.precio ? (
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-white">
                            {producto.tipo_moneda === 'PEN' ? 'S/' : '$'}{producto.precio}
                          </span>
                          {producto.precio_anterior && producto.precio_anterior > producto.precio && (
                            <span className="text-xs text-slate-500 line-through">
                              {producto.tipo_moneda === 'PEN' ? 'S/' : '$'}{producto.precio_anterior}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">Por cotizar</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleVisibility(producto)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          producto.visible
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        }`}
                      >
                        {producto.visible ? "Visible" : "Oculto"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(producto)}
                          className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(producto)}
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
                  {editingProducto ? "Editar Producto" : "Nuevo Producto"}
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
                    placeholder="Nombre del producto"
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
                      placeholder="producto-slug"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Categoría de Producto
                    </label>
                    <select
                      value={formData.categoria_producto_id}
                      onChange={(e) => setFormData({ ...formData, categoria_producto_id: e.target.value })}
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
                    placeholder="Descripción del producto"
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

                {/* Sección de Precio */}
                <div className="border-t border-slate-700/50 pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-slate-300 mb-4">Precio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Precio (Opcional)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.precio}
                        onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                        placeholder="299.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Precio Anterior (descuento)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.precio_anterior}
                        onChange={(e) => setFormData({ ...formData, precio_anterior: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                        placeholder="399.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Moneda
                      </label>
                      <select
                        value={formData.tipo_moneda}
                        onChange={(e) => setFormData({ ...formData, tipo_moneda: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                      >
                        {MONEDAS.map((mon) => (
                          <option key={mon.value} value={mon.value}>
                            {mon.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="mostrar_precio"
                          checked={formData.mostrar_precio}
                          onChange={(e) => setFormData({ ...formData, mostrar_precio: e.target.checked })}
                          className="w-5 h-5 rounded bg-slate-900 border-slate-600 text-cyan-500 focus:ring-cyan-500/50"
                        />
                        <label htmlFor="mostrar_precio" className="text-slate-300">
                          Mostrar precio
                        </label>
                      </div>
                    </div>
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