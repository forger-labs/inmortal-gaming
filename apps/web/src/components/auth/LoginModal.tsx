"use client";

import { BoltIcon, CloseIcon, EmailIcon, LockIcon } from "@shared/icons";
import { useFormik } from "formik";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { sileo } from "sileo";
import * as yup from "yup";

import { EASE_OUT_EXPO } from "@/constants";
import { useAuth } from "@/context/AuthContext";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Ingresa un correo valido")
    .required("Ingresa tu correo electronico"),
  password: yup
    .string()
    .min(6, "La contrasena debe tener al menos 6 caracteres")
    .required("Ingresa tu contrasena"),
});

function notifySoon() {
  sileo.info({
    title: "Disponible pronto",
    description: "Esta funcion estara disponible proximamente.",
    position: "top-center",
  });
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const emailInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        await login(values.email, values.password);
        resetForm();
        onClose();
        sileo.success({
          title: "Sesion iniciada",
          description: `Bienvenido, ${values.email}`,
          position: "top-center",
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Error al iniciar sesion";
        sileo.error({
          title: "Error de autenticacion",
          description: message,
          position: "top-center",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => emailInputRef.current?.focus());

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      cancelAnimationFrame(frame);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <motion.div
            key="login-modal"
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Card */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="login-title"
              className="relative w-full max-w-[440px] rounded-xl border border-neon-primary/30 bg-bg-elevated p-8 shadow-[0_0_50px_-12px_rgba(0,240,255,0.45)]"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
            >
              {/* Close */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute right-4 top-4 p-2 text-text-secondary transition-colors hover:text-neon-primary"
              >
                <CloseIcon className="h-5 w-5" />
              </button>

              {/* Header */}
              <header className="mb-6 flex flex-col gap-1 pr-8">
                <span
                  data-text="INMORTAL GAMING"
                  className="glitch w-fit font-display text-sm font-bold tracking-tight text-neon-primary"
                >
                  INMORTAL GAMING
                </span>
                <h2
                  id="login-title"
                  className="font-display text-2xl font-bold text-text-primary"
                >
                  Inicia sesion
                </h2>
              </header>

              {/* Form */}
              <form
                className="flex flex-col gap-4"
                onSubmit={formik.handleSubmit}
                noValidate
              >
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="login-email"
                    className="flex items-center gap-2 font-mono text-[13px] font-semibold uppercase text-neon-primary/80"
                  >
                    <EmailIcon className="h-4 w-4" />
                    Correo electronico
                  </label>
                  <input
                    id="login-email"
                    ref={emailInputRef}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tucorreo@ejemplo.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={
                      formik.touched.email
                        ? Boolean(formik.errors.email)
                        : undefined
                    }
                    aria-describedby={
                      formik.touched.email && formik.errors.email
                        ? "login-email-error"
                        : undefined
                    }
                    className="w-full border border-white/10 bg-bg-primary px-4 py-3 font-body text-base text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p
                      id="login-email-error"
                      className="font-body text-xs text-neon-pink"
                    >
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="login-password"
                    className="flex items-center gap-2 font-mono text-[13px] font-semibold uppercase text-neon-primary/80"
                  >
                    <LockIcon className="h-4 w-4" />
                    Contrasena
                  </label>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Tu contrasena"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={
                      formik.touched.password
                        ? Boolean(formik.errors.password)
                        : undefined
                    }
                    aria-describedby={
                      formik.touched.password && formik.errors.password
                        ? "login-password-error"
                        : undefined
                    }
                    className="w-full border border-white/10 bg-bg-primary px-4 py-3 font-body text-base text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p
                      id="login-password-error"
                      className="font-body text-xs text-neon-pink"
                    >
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={formik.isSubmitting}
                  whileTap={{ scale: 0.98 }}
                  className="mt-2 flex w-full items-center cursor-pointer justify-center gap-2 rounded bg-neon-primary py-4 font-display text-sm font-semibold uppercase tracking-widest text-bg-primary transition-shadow hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-60"
                >
                  {formik.isSubmitting ? "Verificando…" : "Iniciar sesion"}
                  {!formik.isSubmitting && <BoltIcon className="h-5 w-5" />}
                </motion.button>
              </form>

              {/* Footer */}
              <footer className="mt-6 flex flex-col gap-2 border-t border-white/5 pt-5">
                <button
                  type="button"
                  onClick={notifySoon}
                  className="font-body text-sm text-text-secondary cursor-pointer transition-colors hover:text-neon-primary"
                >
                  ¿Olvidaste tu contrasena?
                </button>
                <button
                  type="button"
                  onClick={notifySoon}
                  className="font-body text-sm text-text-secondary cursor-pointer transition-colors hover:text-neon-primary"
                >
                  ¿No tienes cuenta?{" "}
                  <span className="font-semibold text-neon-primary">
                    Crear cuenta
                  </span>
                </button>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
