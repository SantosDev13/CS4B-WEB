"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface FAQItem {
  pregunta: string;
  respuesta: string;
}

export interface FAQProps {
  items: FAQItem[];
  titulo?: string;
  subtitulo?: string;
  className?: string;
}

export function FAQ({ items, titulo, subtitulo, className = "" }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={className}>
      {/* Header con títulos */}
      <div className="mb-8">
        {subtitulo && (
          <p className="text-sm text-gray-500 mb-1">{subtitulo}</p>
        )}
        {titulo && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {titulo}
          </h2>
        )}
      </div>

      {/* Lista de preguntas */}
      {items.map((item, index) => (
        <div key={index} className="border-b border-gray-200">
          <button
            onClick={() => toggle(index)}
            className="w-full py-4 flex items-center justify-between text-left 
              hover:text-primary transition-colors group"
          >
            <span className="font-medium text-gray-900 group-hover:text-primary">
              {item.pregunta}
            </span>
            <span className="ml-4 flex-shrink-0 text-gray-400">
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </span>
          </button>
          
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? "max-h-96 pb-4" : "max-h-0"
            }`}
          >
            <p className="text-gray-600 leading-relaxed">
              {item.respuesta}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}