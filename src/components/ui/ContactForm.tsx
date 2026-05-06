"use client";

import { useState, FormEvent } from "react";
import { Input } from "./Input";
import { TextArea } from "./TextArea";
import { Button } from "./Button";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export interface ContactFormData {
  nombre: string;
  cargo: string;
  correo_corporativo: string;
  empresa: string;
  mensaje: string;
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
    cargo: "",
    correo_corporativo: "",
    empresa: "",
    mensaje: "",
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.correo_corporativo.trim()) {
      newErrors.correo_corporativo = "El correo corporativo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo_corporativo)) {
      newErrors.correo_corporativo = "Ingresa un correo electrónico válido";
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Error al enviar el mensaje");
        }
      }

      setStatus("success");
      setFormData({
        nombre: "",
        cargo: "",
        correo_corporativo: "",
        empresa: "",
        mensaje: "",
      });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Error al enviar el mensaje");
    }
  };

  const handleChange = (
    field: keyof ContactFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (status === "success") {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Mensaje enviado!
        </h3>
        <p className="text-gray-600 mb-6">
          Gracias por contactarnos. Te responderemos pronto.
        </p>
        <Button onClick={() => setStatus("idle")}>
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {/* Mensaje de error general */}
      {status === "error" && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Error al enviar</p>
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Nombre y Cargo en fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Nombre completo"
            placeholder="Juan Pérez"
            value={formData.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            error={errors.nombre}
            required
          />
          <Input
            label="Cargo"
            placeholder="Gerente de TI"
            value={formData.cargo}
            onChange={(e) => handleChange("cargo", e.target.value)}
          />
        </div>

        {/* Correo corporativo y Empresa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Correo corporativo"
            type="email"
            placeholder="juan@empresa.com"
            value={formData.correo_corporativo}
            onChange={(e) => handleChange("correo_corporativo", e.target.value)}
            error={errors.correo_corporativo}
            required
          />
          <Input
            label="Empresa"
            placeholder="Nombre de la empresa"
            value={formData.empresa}
            onChange={(e) => handleChange("empresa", e.target.value)}
          />
        </div>

        {/* Mensaje */}
        <TextArea
          label="Mensaje"
          placeholder="Cuéntanos sobre tu proyecto o consulta..."
          value={formData.mensaje}
          onChange={(e) => handleChange("mensaje", e.target.value)}
          error={errors.mensaje}
          rows={5}
          required
        />

        {/* Botón de enviar */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={status === "submitting"}
        >
          <Send className="w-5 h-5 mr-2" />
          {status === "submitting" ? "Enviando..." : "Enviar mensaje"}
        </Button>
      </div>
    </form>
  );
}