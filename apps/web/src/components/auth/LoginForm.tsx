"use client";

import { BoltIcon, EmailIcon, LockIcon } from "@shared/icons";
import { cyberError, cyberSuccess } from "@shared/toasts";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import * as yup from "yup";

import { useAuth } from "@/context/AuthContext";

interface LoginFormProps {
  onSuccess: () => void;
}

const loginSchema = yup.object({
  identifier: yup
    .string()
    .trim()
    .required("Ingresa tu correo electronico o usuario"),
  password: yup
    .string()
    .min(6, "La contrasena debe tener al menos 6 caracteres")
    .required("Ingresa tu contrasena"),
});

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: { identifier: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        await login(values.identifier.trim(), values.password);
        resetForm();
        onSuccess();
        cyberSuccess(
          `Bienvenido, ${values.identifier.trim()}`,
          "[SESION INICIADA]",
        );
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Error al iniciar sesion";
        cyberError(message, "[ERROR AUTENTICACION]");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={formik.handleSubmit}
      noValidate
    >
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="login-identifier"
          className="flex items-center gap-2 font-mono text-[13px] font-semibold uppercase text-neon-primary/80"
        >
          <EmailIcon className="h-4 w-4" />
          Correo o Usuario
        </label>
        <input
          id="login-identifier"
          ref={inputRef}
          name="identifier"
          type="text"
          autoComplete="username"
          placeholder="tucorreo@ejemplo.com o tu_usuario"
          value={formik.values.identifier}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={
            formik.touched.identifier
              ? Boolean(formik.errors.identifier)
              : undefined
          }
          aria-describedby={
            formik.touched.identifier && formik.errors.identifier
              ? "login-identifier-error"
              : undefined
          }
          className="w-full border border-white/10 bg-bg-primary px-4 py-3 font-body text-base text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
        />
        {formik.touched.identifier && formik.errors.identifier && (
          <p
            id="login-identifier-error"
            className="font-body text-xs text-neon-pink"
          >
            {formik.errors.identifier}
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

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={formik.isSubmitting}
        whileTap={{ scale: 0.98 }}
        className="mt-2 flex w-full items-center cursor-pointer justify-center gap-2 rounded bg-neon-primary py-3.5 font-display text-sm font-semibold uppercase tracking-widest text-bg-primary transition-shadow hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-60"
      >
        {formik.isSubmitting ? "Verificando…" : "Iniciar sesion"}
        {!formik.isSubmitting && <BoltIcon className="h-5 w-5" />}
      </motion.button>
    </form>
  );
}
