"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, Clock } from "lucide-react";
import { useAuth } from "@/composables";
import { ROUTES } from "@/constants";
import { Spinner } from "@/components/ui/Spinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [cooldownEndsAt, setCooldownEndsAt] = useState<number | null>(null);
  const { login, logout, isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Validar formato de email
  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Limpiar error de email cuando el usuario empieza a escribir
    if (emailError) setEmailError("");
  };

  // Mostrar countdown del cooldown
  useEffect(() => {
    if (!cooldownEndsAt) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= cooldownEndsAt) {
        setCooldownEndsAt(null);
        setAttemptsRemaining(null);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownEndsAt]);

  // Formatear tiempo restante
  const formatCooldown = (timestamp: number): string => {
    const remaining = Math.max(0, timestamp - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Evitar hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Si ya está autenticado, redirigir al admin directamente
  useEffect(() => {
    if (mounted && !authLoading && isAuthenticated) {
      router.push(ROUTES.admin);
    }
  }, [mounted, authLoading, isAuthenticated, router]);

  // Mostrar loading mientras se verifica la sesión O antes de mount
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Spinner size="lg" className="text-cyan-500" />
      </div>
    );
  }

  // Si ya está autenticado, no mostrar el formulario
  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validar email en frontend
    if (!validateEmail(email)) {
      setEmailError("Ingresá un correo electrónico válido");
      return;
    }

    // Validar que la contraseña no esté vacía
    if (!password.trim()) {
      setError("La contraseña es requerida");
      return;
    }

    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push(ROUTES.admin);
    } else {
      // Guardar información de rate limit para feedback visual
      if (result.remaining !== undefined) {
        setAttemptsRemaining(result.remaining);
      }
      if (result.resetAt) {
        setCooldownEndsAt(result.resetAt);
      }

      // Construir mensaje de error con intentos restantes
      let errorMessage = result.error || "Error al iniciar sesión";
      if (result.remaining !== undefined && result.remaining < 5) {
        errorMessage += ` (${result.remaining} intento${result.remaining === 1 ? "" : "s"} restante${result.remaining === 1 ? "" : "s"})`;
      }
      if (cooldownEndsAt) {
        errorMessage = `Demasiados intentos. Podés reintentar en ${formatCooldown(cooldownEndsAt)}`;
      }
      setError(errorMessage);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 pt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            CS<span className="text-accent">4</span>B
          </h1>
          <p className="text-slate-400 mt-2">Consulting Strategic for Digital Business</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <LogIn className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Iniciar Sesión</h2>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  aria-describedby={emailError ? "email-error" : undefined}
                  aria-invalid={emailError ? "true" : undefined}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              {emailError && (
                <p id="email-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={cooldownEndsAt !== null}
                  required
                  className="w-full pl-11 pr-12 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Attempts remaining indicator */}
            {attemptsRemaining !== null && !cooldownEndsAt && attemptsRemaining < 5 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Intentos restantes: 
                </span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-5 rounded-full transition-colors ${
                        i < attemptsRemaining ? "bg-amber-500" : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Cooldown indicator */}
            {cooldownEndsAt && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-center py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg"
              >
                <div className="flex items-center justify-center gap-2 text-amber-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Demasiados intentos</span>
                </div>
                <p className="text-amber-300/70 text-xs mt-1">
                  Podés reintentar en <span className="font-mono">{formatCooldown(cooldownEndsAt)}</span>
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" />
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          {/* Back to home */}
          <div className="mt-6 text-center">
            <a href={ROUTES.home} className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
              ← Volver al inicio
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          © 2026 CS4B - Todos los derechos reservados
        </p>
      </motion.div>
    </div>
  );
}