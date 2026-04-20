"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2, ShoppingCart, X, Plus, Trash2 } from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import Link from "next/link";

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

interface Servicio {
  id: string;
  titulo: string;
  slug: string;
  categoria_servicio_id: string;
}

export default function ContactoPage() {
  const { servicios: cartServicios, removeFromCart, clearCart, addToCart } = useCart();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
    servicio_interes: "",
    mensaje: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Datos para selects dinámicos
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [servicioSeleccionado, setServicioSeleccionado] = useState("");
  const [loadingServicios, setLoadingServicios] = useState(false);

  // Cargar categorías al iniciar
  useEffect(() => {
    fetch("/api/categorias-servicios")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCategorias(data.data);
        }
      })
      .catch((err) => console.error("Error fetching categorias:", err));
  }, []);

  // Cargar servicios cuando se selecciona categoría
  useEffect(() => {
    if (categoriaSeleccionada) {
      setLoadingServicios(true);
      fetch(`/api/servicios?categoria=${categoriaSeleccionada}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setServicios(data.data);
          }
        })
        .catch((err) => console.error("Error fetching servicios:", err))
        .finally(() => setLoadingServicios(false));
    } else {
      setServicios([]);
      setServicioSeleccionado("");
    }
  }, [categoriaSeleccionada]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddManual = () => {
    if (categoriaSeleccionada && servicioSeleccionado) {
      const categoria = categorias.find((c) => c.id === categoriaSeleccionada);
      const servicio = servicios.find((s) => s.id === servicioSeleccionado);

      if (categoria && servicio) {
        const item: CartItem = {
          id: servicio.id,
          titulo: servicio.titulo,
          slug: servicio.slug,
          categoria: categoria.nombre,
          categoriaSlug: categoria.slug,
        };
        addToCart(item);
        setCategoriaSeleccionada("");
        setServicioSeleccionado("");
        setServicios([]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Preparar datos - si hay carrito, usarlo; si no, usar selección manual
    const serviciosSeleccionados = cartServicios.length > 0
      ? cartServicios
      : categoriaSeleccionada && servicioSeleccionado
        ? [{
            id: servicioSeleccionado,
            titulo: servicios.find((s) => s.id === servicioSeleccionado)?.titulo || "",
            categoria: categorias.find((c) => c.id === categoriaSeleccionada)?.nombre || "",
          }]
        : [];

    try {
      const res = await fetch("/api/contactos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          servicios_seleccionados: serviciosSeleccionados,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        clearCart();
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          empresa: "",
          servicio_interes: "",
          mensaje: "",
        });
      } else {
        setError(data.error || "Error al enviar el mensaje");
      }
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const hasServicios = cartServicios.length > 0 || (categoriaSeleccionada && servicioSeleccionado);

  return (
    <div className="pt-0">
      {/* Header */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
            alt="Contacto empresarial"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="relative container-custom">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Contáctanos
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            ¿Listo para transformar tu negocio? Escríbenos y
            te respondemos en menos de 24 horas
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-8">
                Envíanos un mensaje
              </h2>

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 font-medium">¡Recibimos tu Mensaje Exitosamente!</p>
                    <p className="text-green-600 text-sm">Te contactaremos pronto.</p>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-800">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Carrito de servicios o selects dinámicos */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    <ShoppingCart className="w-4 h-4 inline mr-2" />
                    Servicio de interés
                  </label>

                  {/* SI HAY SERVICIOS EN EL CARRITO */}
                  {cartServicios.length > 0 ? (
                    <div className="space-y-3">
                      {/* Lista de servicios seleccionados */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-blue-800">
                            Servicios seleccionados ({cartServicios.length})
                          </span>
                          <button
                            type="button"
                            onClick={clearCart}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {cartServicios.map((item) => (
                            <span
                              key={item.id}
                              className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm"
                            >
                              {item.categoria && (
                                <span className="text-blue-500 text-xs">[{item.categoria}]</span>
                              )}
                              {item.titulo}
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="ml-1 hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Opción de agregar más */}
                      <Link
                        href="/servicios"
                        className="inline-flex items-center gap-2 text-sm text-secondary hover:text-secondary/80"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar más servicios
                      </Link>
                    </div>
                  ) : (
                    /* SI NO HAY CARRITO - SELECTS DINÁMICOS */
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <select
                          value={categoriaSeleccionada}
                          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary focus:outline-none transition-colors bg-white"
                        >
                          <option value="">Selecciona una categoría</option>
                          {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.nombre}
                            </option>
                          ))}
                        </select>

                        <select
                          value={servicioSeleccionado}
                          onChange={(e) => setServicioSeleccionado(e.target.value)}
                          disabled={!categoriaSeleccionada || loadingServicios}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary focus:outline-none transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">
                            {loadingServicios
                              ? "Cargando..."
                              : categoriaSeleccionada
                                ? "Selecciona un servicio"
                                : "Primero selecciona una categoría"}
                          </option>
                          {servicios.map((srv) => (
                            <option key={srv.id} value={srv.id}>
                              {srv.titulo}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Botón agregar manual */}
                      {categoriaSeleccionada && servicioSeleccionado && (
                        <button
                          type="button"
                          onClick={handleAddManual}
                          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-secondary/80"
                        >
                          <Plus className="w-4 h-4" />
                          Agregir servicio seleccionado
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-text-secondary mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary focus:outline-none transition-colors"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label htmlFor="empresa" className="block text-sm font-medium text-text-secondary mb-2">
                      Empresa
                    </label>
                    <input
                      type="text"
                      id="empresa"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary focus:outline-none transition-colors"
                      placeholder="Mi Empresa S.A.C."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary focus:outline-none transition-colors"
                      placeholder="juan@empresa.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-text-secondary mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary focus:outline-none transition-colors"
                      placeholder="+51 999 999 999"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium text-text-secondary mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary focus:outline-none transition-colors resize-none"
                    placeholder="Cuéntanos sobre tu proyecto o consulta..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar mensaje
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-8">
                  Información de contacto
                </h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-bg-light flex items-center justify-center text-primary flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Dirección</h3>
                      <p className="text-text-secondary">
                        Lima, Perú<br />
                        <span className="text-sm">(Consultoría remota disponible en todo el país)</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-bg-light flex items-center justify-center text-primary flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Email</h3>
                      <p className="text-text-secondary">contacto@cs4b.pe</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-bg-light flex items-center justify-center text-primary flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Teléfono</h3>
                      <p className="text-text-secondary">+51 999 999 999</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-bg-light flex items-center justify-center text-primary flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Horario de atención</h3>
                      <p className="text-text-secondary">
                        Lunes a Viernes: 9:00 AM - 6:00 PM<br />
                        Sábados: 9:00 AM - 1:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-bg-light rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#25D366] flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary">
                      ¿Preferes WhatsApp?
                    </h3>
                    <p className="text-text-secondary text-sm">
                      Chatea con nosotros directamente
                    </p>
                  </div>
                </div>
                <a
                  href="https://wa.me/51999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-[#25D366] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#20BD5A] transition-colors"
                >
                  Escribir en WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}