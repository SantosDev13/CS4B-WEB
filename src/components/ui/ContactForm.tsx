"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle, AlertCircle, MessageSquare, Loader2 } from "lucide-react";
import { 
  CONTACTO_INTERES_OPTIONS, 
  CONTACTO_CATEGORIAS, 
  CONTACTO_POSICIONES 
} from "@/constants";

export interface ContactFormData {
  nombre: string;
  apellidos: string;
  interes: string;
  categoria: string;
  posicion: string;
  empresa: string;
  email: string;
  telefono: string;
  mensaje: string;
  website?: string;
}

export interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  className?: string;
  submitEndpoint?: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm({ 
  onSubmit, 
  className = "", 
  submitEndpoint = "/api/contactos" 
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
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

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const posiciones = formData.categoria ? CONTACTO_POSICIONES[formData.categoria] || [] : [];

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = "Los apellidos son requeridos";
    }
    if (!formData.interes) {
      newErrors.interes = "Selecciona tu interés";
    }
    if (!formData.categoria) {
      newErrors.categoria = "Selecciona una categoría";
    }
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un email válido";
    }
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es requerido";
    } else if (formData.mensaje.trim().length < 10) {
      newErrors.mensaje = "El mensaje debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Honeypot check
    if (formData.website) {
      setStatus("success");
      return;
    }

    if (!validateForm()) return;

    setStatus("submitting");

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        const response = await fetch(submitEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al enviar el mensaje");
        }
      }

      setStatus("success");
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
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Error al enviar el mensaje");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "categoria" ? { posicion: "" } : {}),
    }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (status === "success") {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Recibimos tu mensaje exitosamente!
        </h3>
        <p className="text-gray-600 mb-6">
          Te contactaremos pronto.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {/* Honeypot - invisible */}
      <div className="absolute -left-[9999px] top-0" aria-hidden="true">
        <input
          type="text"
          name="website"
          value={formData.website || ""}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Mensaje de error general */}
      {status === "error" && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800">{errorMessage}</p>
        </div>
      )}

      <div className="space-y-5">
        {/* Nombre y Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors ${
                errors.nombre ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-secondary"
              }`}
              placeholder="Nombre"
            />
            {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
          </div>
          <div>
            <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors ${
                errors.apellidos ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-secondary"
              }`}
              placeholder="Apellidos"
            />
            {errors.apellidos && <p className="mt-1 text-sm text-red-500">{errors.apellidos}</p>}
          </div>
        </div>

        {/* ¿En qué podemos ayudarte? */}
        <div>
          <label htmlFor="interes" className="block text-sm font-medium text-gray-700 mb-1">
            <MessageSquare className="w-4 h-4 inline mr-1" />
            ¿En qué podemos ayudarte? <span className="text-red-500">*</span>
          </label>
          <select
            id="interes"
            name="interes"
            value={formData.interes}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors bg-white ${
              errors.interes ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-secondary"
            }`}
          >
            <option value="">Selecciona una opción</option>
            {CONTACTO_INTERES_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
          {errors.interes && <p className="mt-1 text-sm text-red-500">{errors.interes}</p>}
        </div>

        {/* Categoría y Posición */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors bg-white ${
                errors.categoria ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-secondary"
              }`}
            >
              <option value="">Selecciona una categoría</option>
              {CONTACTO_CATEGORIAS.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            {errors.categoria && <p className="mt-1 text-sm text-red-500">{errors.categoria}</p>}
          </div>
          <div>
            <label htmlFor="posicion" className="block text-sm font-medium text-gray-700 mb-1">
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
                <option key={pos.id} value={pos.id}>{pos.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Empresa */}
        <div>
          <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-1">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors ${
                errors.email ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-secondary"
              }`}
              placeholder="Email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
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
          <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje <span className="text-red-500">*</span>
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            rows={5}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors resize-none ${
              errors.mensaje ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-secondary"
            }`}
            placeholder="Cuéntanos sobre tu proyecto o consulta..."
          />
          {errors.mensaje && <p className="mt-1 text-sm text-red-500">{errors.mensaje}</p>}
        </div>

        {/* Botón de enviar */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full py-4 rounded-lg bg-primary text-white font-semibold hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "submitting" ? (
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
      </div>
    </form>
  );
}