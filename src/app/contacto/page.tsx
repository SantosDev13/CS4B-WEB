"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2, MessageSquare, Phone, Mail, MapPin, Clock } from "lucide-react";

// Opciones de interés
const INTERES_OPTIONS = [
  { id: "cotizacion", label: "Cotización" },
  { id: "consulta", label: "Consulta" },
  { id: "soporte", label: "Soporte" },
  { id: "otro", label: "Otro" },
];

// Categorías disponibles
const CATEGORIAS = [
  { id: "c-level", label: "C-level" },
  { id: "director", label: "Director" },
  { id: "manager", label: "Manager" },
  { id: "otros", label: "Otros" },
];

// Posiciones por categoría
const POSICIONES_POR_CATEGORIA: Record<string, { id: string; label: string }[]> = {
  "c-level": [
    { id: "cco", label: "Chief Communications Officer" },
    { id: "compliance-officer", label: "Chief Compliance Officer" },
    { id: "cdo", label: "Chief Data Officer" },
    { id: "cdo-digital", label: "Chief Digital Officer" },
    { id: "ceo", label: "Chief Executive Officer / Director General" },
    { id: "cxo", label: "Chief Experience Officer" },
    { id: "cfo", label: "Chief Financial Officer" },
    { id: "chro", label: "Chief Human Resources Officer" },
    { id: "ciso", label: "Chief Information Security Officer" },
    { id: "cio-innovation", label: "Chief Innovation Officer" },
    { id: "cio-investment", label: "Chief Investment Officer" },
    { id: "clo", label: "Chief Legal Officer" },
    { id: "cmo", label: "Chief Marketing Officer" },
    { id: "coo", label: "Chief Operating Officer" },
    { id: "cro", label: "Chief Revenue Officer" },
    { id: "cro-risk", label: "Chief Risk Officer" },
    { id: "cto", label: "Chief Technology Officer" },
    { id: "cso", label: "Chief Strategy Officer" },
    { id: "presidente", label: "Presidente" },
  ],
  "director": [
    { id: "dir-ciberseguridad", label: "Ciberseguridad" },
    { id: "dir-compliance", label: "Compliance" },
    { id: "dir-compras", label: "Compras" },
    { id: "dir-comunicacion", label: "Comunicacion y Medios" },
    { id: "dir-data", label: "Data e Inteligencia de Negocios" },
    { id: "dir-innovacion", label: "Estrategia de Innovación" },
    { id: "dir-experiencia", label: "Experiencia de Cliente" },
    { id: "dir-finanzas", label: "Finanzas" },
    { id: "dir-legal", label: "Legal" },
    { id: "dir-logistica", label: "Logistica" },
    { id: "dir-marketing", label: "Marketing" },
    { id: "dir-operaciones", label: "Operaciones" },
    { id: "dir-rrhh", label: "Recursos Humanos" },
    { id: "dir-riesgos", label: "Riesgos" },
    { id: "dir-tecnologia", label: "Tecnología y Sistemas de Información" },
    { id: "dir-transformacion", label: "Transformacion Digital" },
    { id: "dir-ventas", label: "Ventas" }
  ],
  "manager": [
    { id: "mgr-ciberseguridad", label: "Ciberseguridad" },
    { id: "mgr-compliance", label: "Compliance" },
    { id: "mgr-compras", label: "Compras" },
    { id: "mgr-comunicacion", label: "Comunicacion y Medios" },
    { id: "mgr-data", label: "Data e Inteligencia de Negocios" },
    { id: "mgr-innovacion", label: "Estrategia de Innovación" },
    { id: "mgr-experiencia", label: "Experiencia de Cliente" },
    { id: "mgr-finanzas", label: "Finanzas" },
    { id: "mgr-legal", label: "Legal" },
    { id: "mgr-logistica", label: "Logistica" },
    { id: "mgr-marketing", label: "Marketing" },
    { id: "mgr-operaciones", label: "Operaciones" },
    { id: "mgr-rrhh", label: "Recursos Humanos" },
    { id: "mgr-riesgos", label: "Riesgos" },
    { id: "mgr-tecnologia", label: "Tecnología y Sistemas de Información" },
    { id: "mgr-transformacion", label: "Transformacion Digital" },
    { id: "mgr-ventas", label: "Ventas" }
  ],
  "otros": [
    { id: "asesor", label: "Asesor" },
    { id: "asistente", label: "Asistente" },
    { id: "estudiante", label: "Estudiante" },
    { id: "jefe-proyecto", label: "Jefe de proyecto" },
    { id: "tecnico", label: "Técnico" }
  ]
};

interface FormData {
  nombre: string;
  apellidos: string;
  interes: string;
  categoria: string;
  posicion: string;
  empresa: string;
  email: string;
  telefono: string;
  mensaje: string;
}

export default function ContactoPage() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellidos: "",
    interes: "",
    categoria: "",
    posicion: "",
    empresa: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [errores, setErrores] = useState<Partial<Record<keyof FormData, string>>>({});

  // Opciones de posición basadas en la categoría seleccionada
  const posiciones = formData.categoria ? POSICIONES_POR_CATEGORIA[formData.categoria] || [] : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Limpiar posición si cambia la categoría
      ...(name === "categoria" ? { posicion: "" } : {}),
    }));
    // Limpiar error del campo
    if (errores[name as keyof FormData]) {
      setErrores((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Partial<Record<keyof FormData, string>> = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es requerido";
    }
    if (!formData.apellidos.trim()) {
      nuevosErrores.apellidos = "Los apellidos son requeridos";
    }
    if (!formData.interes) {
      nuevosErrores.interes = "Selecciona tu interés";
    }
    if (!formData.categoria) {
      nuevosErrores.categoria = "Selecciona una categoría";
    }
    if (!formData.email.trim()) {
      nuevosErrores.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nuevosErrores.email = "Ingresa un email válido";
    }
    if (!formData.mensaje.trim()) {
      nuevosErrores.mensaje = "El mensaje es requerido";
    } else if (formData.mensaje.trim().length < 10) {
      nuevosErrores.mensaje = "El mensaje debe tener al menos 10 caracteres";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contactos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setFormData({
          nombre: "",
          apellidos: "",
          interes: "",
          categoria: "",
          posicion: "",
          empresa: "",
          email: "",
          telefono: "",
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
                    <p className="text-green-800 font-medium">¡Recibimos tu mensaje exitosamente!</p>
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
                {/* Nombre y Apellidos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-text-secondary mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors ${
                        errores.nombre
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-secondary"
                      }`}
                      placeholder="Nombre"
                    />
                    {errores.nombre && (
                      <p className="mt-1 text-sm text-red-500">{errores.nombre}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="apellidos" className="block text-sm font-medium text-text-secondary mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      id="apellidos"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors ${
                        errores.apellidos
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-secondary"
                      }`}
                      placeholder="Apellidos"
                    />
                    {errores.apellidos && (
                      <p className="mt-1 text-sm text-red-500">{errores.apellidos}</p>
                    )}
                  </div>
                </div>

                {/* Interés */}
                <div>
                  <label htmlFor="interes" className="block text-sm font-medium text-text-secondary mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    ¿En qué podemos ayudarte? *
                  </label>
                  <select
                    id="interes"
                    name="interes"
                    value={formData.interes}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors bg-white ${
                      errores.interes
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-secondary"
                    }`}
                  >
                    <option value="">Selecciona una opción</option>
                    {INTERES_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errores.interes && (
                    <p className="mt-1 text-sm text-red-500">{errores.interes}</p>
                  )}
                </div>

                {/* Categoría y Posición */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="categoria" className="block text-sm font-medium text-text-secondary mb-2">
                      Categoría *
                    </label>
                    <select
                      id="categoria"
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors bg-white ${
                        errores.categoria
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-secondary"
                      }`}
                    >
                      <option value="">Selecciona una categoría</option>
                      {CATEGORIAS.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    {errores.categoria && (
                      <p className="mt-1 text-sm text-red-500">{errores.categoria}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="posicion" className="block text-sm font-medium text-text-secondary mb-2">
                      Posición
                    </label>
                    <select
                      id="posicion"
                      name="posicion"
                      value={formData.posicion}
                      onChange={handleChange}
                      disabled={!formData.categoria}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-secondary focus:outline-none transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {formData.categoria ? "Selecciona una posición" : "Primero selecciona una categoría"}
                      </option>
                      {posiciones.map((pos) => (
                        <option key={pos.id} value={pos.id}>
                          {pos.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Empresa */}
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
                    placeholder="Empresa"
                  />
                </div>

                {/* Email y Teléfono */}
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
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors ${
                        errores.email
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-secondary"
                      }`}
                      placeholder="Email"
                    />
                    {errores.email && (
                      <p className="mt-1 text-sm text-red-500">{errores.email}</p>
                    )}
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
                      placeholder="Teléfono"
                    />
                  </div>
                </div>

                {/* Mensaje */}
                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium text-text-secondary mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors resize-none ${
                      errores.mensaje
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-secondary"
                    }`}
                    placeholder="Cuéntanos sobre tu proyecto o consulta..."
                  />
                  {errores.mensaje && (
                    <p className="mt-1 text-sm text-red-500">{errores.mensaje}</p>
                  )}
                </div>

                {/* Botón enviar */}
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
                  {/* Dirección */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-bg-light flex items-center justify-center text-primary flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Dirección</h3>
                      <p className="text-text-secondary">
                        Lima, Perú<br />
                        <span className="text-sm">(Consultoría remota disponible en todo el país)</span>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-bg-light flex items-center justify-center text-primary flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Email</h3>
                      <p className="text-text-secondary">contacto@cs4b.pe</p>
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-bg-light flex items-center justify-center text-primary flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Teléfono</h3>
                      <p className="text-text-secondary">+51 988 227 755</p>
                    </div>
                  </div>

                  {/* Horario */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-bg-light flex items-center justify-center text-primary flex-shrink-0">
                      <Clock className="w-6 h-6" />
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
                      ¿Prefieres WhatsApp?
                    </h3>
                    <p className="text-text-secondary text-sm">
                      Chatea con nosotros directamente
                    </p>
                  </div>
                </div>
                <a
                  href="https://wa.me/51988227755"
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