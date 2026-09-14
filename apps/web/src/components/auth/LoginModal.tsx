"use client";

import { CloseIcon } from "@shared/icons";
import { cyberInfo } from "@shared/toasts";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { EASE_OUT_EXPO } from "@/constants";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "register";

function notifySoon() {
  cyberInfo(
    "Esta funcion estara disponible proximamente.",
    "[DISPONIBLE PRONTO]",
  );
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <motion.div
            key="auth-modal"
            className="fixed inset-0 z-60 flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Modal Card */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="auth-modal-title"
              className="relative my-8 w-full max-w-115 rounded-xl border border-neon-primary/30 bg-bg-elevated p-6 sm:p-8 shadow-[0_0_50px_-12px_rgba(0,240,255,0.45)] max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute right-4 top-4 p-2 text-text-secondary transition-colors hover:text-neon-primary"
              >
                <CloseIcon className="h-5 w-5" />
              </button>

              {/* Header */}
              <header className="mb-5 flex flex-col gap-1 pr-8">
                <span
                  data-text="INMORTAL GAMING"
                  className="glitch w-fit font-display text-sm font-bold tracking-tight text-neon-primary"
                >
                  INMORTAL GAMING
                </span>
                <h2
                  id="auth-modal-title"
                  className="font-display text-2xl font-bold text-text-primary"
                >
                  {mode === "login" ? "Inicia sesion" : "Crea tu cuenta"}
                </h2>
                <p className="font-body text-xs text-text-secondary">
                  {mode === "login"
                    ? "Accede a tu inventario, pedidos y compras exclusivas."
                    : "Unete a la comunidad de jugadores y accede al catalogo."}
                </p>

                {/* Mode Selector Tabs */}
                <div className="mt-3 flex rounded border border-white/10 bg-bg-primary/70 p-1">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={`flex-1 rounded py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      mode === "login"
                        ? "bg-neon-primary text-bg-primary shadow-[0_0_12px_rgba(0,240,255,0.35)]"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    Iniciar sesion
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className={`flex-1 rounded py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      mode === "register"
                        ? "bg-neon-primary text-bg-primary shadow-[0_0_12px_rgba(0,240,255,0.35)]"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    Registrarse
                  </button>
                </div>
              </header>

              {/* Dynamic Form depending on mode */}
              {mode === "login" ? (
                <LoginForm onSuccess={onClose} />
              ) : (
                <RegisterForm onSuccess={onClose} />
              )}

              {/* Footer */}
              <footer className="mt-5 flex flex-col gap-2 border-t border-white/5 pt-4">
                {mode === "login" ? (
                  <>
                    <button
                      type="button"
                      onClick={notifySoon}
                      className="font-body text-xs text-text-secondary cursor-pointer transition-colors hover:text-neon-primary text-left"
                    >
                      ¿Olvidaste tu contrasena?
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="font-body text-xs text-text-secondary cursor-pointer transition-colors hover:text-neon-primary text-left"
                    >
                      ¿No tienes cuenta?{" "}
                      <span className="font-semibold text-neon-primary">
                        Crear cuenta
                      </span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-body text-xs text-text-secondary cursor-pointer transition-colors hover:text-neon-primary text-left"
                  >
                    ¿Ya tienes una cuenta?{" "}
                    <span className="font-semibold text-neon-primary">
                      Iniciar sesion
                    </span>
                  </button>
                )}
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
