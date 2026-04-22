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
  FileText,
  Image,
  Calendar,
  User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Post {
  id: string;
  titulo: string;
  slug: string;
  contenido: string;
  excerpt: string | null;
  imagen_destacada: string | null;
  categoria_id: string | null;
  autor_id: string | null;
  etiquetas: string[];
  vistas: number;
  publicado: boolean;
  fecha_publicacion: string | null;
  created_at: string;
  categoria?: {
    id: string;
    nombre: string;
    slug: string;
    color: string;
  };
  autor?: {
    id: string;
    nombre: string;
    avatar: string | null;
  };
}

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  color: string;
}

export default function AdminPostsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    slug: "",
    contenido: "",
    excerpt: "",
    imagen_destacada: "",
    categoria_id: "",
    etiquetas: "",
    publicado: false,
    fecha_publicacion: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [postsRes, catsRes] = await Promise.all([
        fetch("/api/posts?published=false", { credentials: "include" }),
        fetch("/api/categorias_posts", { credentials: "include" }),
      ]);
      
      const postsData = await postsRes.json();
      const catsData = await catsRes.json();
      
      setPosts(Array.isArray(postsData.data) ? postsData.data : []);
      setCategorias(Array.isArray(catsData.data) ? catsData.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingPost 
        ? `/api/posts/${editingPost.slug}`
        : "/api/posts";
      
      const method = editingPost ? "PUT" : "POST";

      // Handle etiquetas - split by comma if it's a string
      let etiquetasArray: string[];
      if (typeof formData.etiquetas === 'string') {
        etiquetasArray = formData.etiquetas.split(",").map((e) => e.trim()).filter(Boolean);
      } else if (Array.isArray(formData.etiquetas)) {
        etiquetasArray = formData.etiquetas;
      } else {
        etiquetasArray = [];
      }

      const body = {
        titulo: formData.titulo,
        slug: formData.slug,
        contenido: formData.contenido,
        excerpt: formData.excerpt || null,
        imagen_destacada: formData.imagen_destacada || null,
        categoria_id: formData.categoria_id || null,
        etiquetas: etiquetasArray,
        publicado: formData.publicado,
        fecha_publicacion: formData.publicado ? (formData.fecha_publicacion || new Date().toISOString()) : null,
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
      setEditingPost(null);
      resetForm();
      fetchData();
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      titulo: post.titulo,
      slug: post.slug,
      contenido: post.contenido,
      excerpt: post.excerpt || "",
      imagen_destacada: post.imagen_destacada || "",
      categoria_id: post.categoria_id || "",
      etiquetas: post.etiquetas?.join(", ") || "",
      publicado: post.publicado,
      fecha_publicacion: post.fecha_publicacion?.split("T")[0] || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (post: Post) => {
    if (!confirm(`¿Estás seguro de eliminar "${post.titulo}"?`)) return;

    try {
      const res = await fetch(`/api/posts/${post.slug}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      await fetch(`/api/posts/${post.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicado: !post.publicado }),
        credentials: "include",
      });
      fetchData();
    } catch (err) {
      console.error("Error toggling publish:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      slug: "",
      contenido: "",
      excerpt: "",
      imagen_destacada: "",
      categoria_id: "",
      etiquetas: "",
      publicado: false,
      fecha_publicacion: "",
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
      slug: editingPost ? formData.slug : generateSlug(titulo),
    });
  };

  const filteredPosts = posts.filter((p) =>
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-white">Publicaciones</h1>
          <p className="text-slate-400">Gestiona las publicaciones del blog</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingPost(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nueva Publicación
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar publicaciones..."
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
              <th className="text-center p-4 text-slate-400 font-medium">Estado</th>
              <th className="text-center p-4 text-slate-400 font-medium">Vistas</th>
              <th className="text-right p-4 text-slate-400 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No hay publicaciones disponibles
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-slate-700/30 hover:bg-slate-800/30"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {post.imagen_destacada ? (
                        <img
                          src={post.imagen_destacada}
                          alt={post.titulo}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-slate-500" />
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{post.titulo}</p>
                        <p className="text-slate-500 text-sm">{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {post.categoria ? (
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                        style={{ 
                          backgroundColor: `${post.categoria.color}20`,
                          color: post.categoria.color 
                        }}
                      >
                        {post.categoria.nombre}
                      </span>
                    ) : (
                      <span className="text-slate-500">Sin categoría</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleTogglePublish(post)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        post.publicado
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                      }`}
                    >
                      {post.publicado ? "Publicado" : "Borrador"}
                    </button>
                  </td>
                  <td className="p-4 text-center text-slate-300">
                    {post.vistas}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post)}
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
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingPost ? "Editar Publicación" : "Nueva Publicación"}
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
                      placeholder="Título de la publicación"
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
                      placeholder="publicacion-slug"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Categoría
                    </label>
                    <select
                      value={formData.categoria_id}
                      onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
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

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Fecha de publicación
                    </label>
                    <input
                      type="date"
                      value={formData.fecha_publicacion}
                      onChange={(e) => setFormData({ ...formData, fecha_publicacion: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Excerpt (Resumen)
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 resize-none"
                    placeholder="Resumen corto para el blog"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Contenido *
                  </label>
                  <textarea
                    value={formData.contenido}
                    onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                    required
                    rows={8}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 resize-none font-mono text-sm"
                    placeholder="Contenido de la publicación (Markdown)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Imagen Destacada (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.imagen_destacada}
                    onChange={(e) => setFormData({ ...formData, imagen_destacada: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Etiquetas (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={formData.etiquetas}
                    onChange={(e) => setFormData({ ...formData, etiquetas: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    placeholder="etiqueta1, etiqueta2, etiqueta3"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="publicado"
                    checked={formData.publicado}
                    onChange={(e) => setFormData({ ...formData, publicado: e.target.checked })}
                    className="w-5 h-5 rounded bg-slate-900 border-slate-600 text-cyan-500 focus:ring-cyan-500/50"
                  />
                  <label htmlFor="publicado" className="text-slate-300">
                    Publicar ahora
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
