"use client";

import { Component, ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary para capturar errores de React
 * y mostrar una UI amigable en lugar de estrellar toda la app
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary capturó un error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">
              Algo salió mal
            </h2>
            
            <p className="text-slate-400 mb-6">
              Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
            </p>

            {this.state.error && (
              <details className="text-left text-xs text-slate-500 mb-4 p-3 bg-slate-800/50 rounded-lg">
                <summary className="cursor-pointer text-slate-400">
                  Ver detalles del error
                </summary>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all"
            >
              Reintentar
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;