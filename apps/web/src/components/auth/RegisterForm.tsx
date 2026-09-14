"use client";

import { BoltIcon, EmailIcon, LockIcon, UserIcon } from "@shared/icons";
import { cyberError, cyberSuccess } from "@shared/toasts";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import * as yup from "yup";

import { useAuth } from "@/context/AuthContext";

interface RegisterFormProps {
  onSuccess: () => void;
}

const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("Ingresa tu nombre"),
  last_name: yup
    .string()
    .trim()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .required("Ingresa tu apellido"),
  username: yup
    .string()
    .trim()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .required("Ingresa tu nombre de usuario"),
  email: yup
    .string()
    .trim()
    .email("Ingresa un correo valido")
    .required("Ingresa tu correo electronico"),
  password: yup
    .string()
    .min(6, "La contrasena debe tener al menos 6 caracteres")
    .required("Ingresa tu contrasena"),
});

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register, login } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        await register({
          name: values.name.trim(),
          last_name: values.last_name.trim(),
          username: values.username.trim(),
          email: values.email.trim(),
          password: values.password,
        });

        // Iniciar sesión automáticamente tras el registro exitoso
        await login(values.email.trim(), values.password);
        resetForm();
        onSuccess();
        cyberSuccess(
          `Cuenta creada con exito. Bienvenido, ${values.username.trim()}`,
          "[REGISTRO EXITOSO]",
        );
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Error al registrar usuario";
        cyberError(message, "[ERROR REGISTRO]");
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
      className="flex flex-col gap-3.5"
      onSubmit={formik.handleSubmit}
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="register-name"
            className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase text-neon-primary/80"
          >
            <UserIcon className="h-3.5 w-3.5" />
            Nombre
          </label>
          <input
            id="register-name"
            ref={inputRef}
            name="name"
            type="text"
            autoComplete="given-name"
            placeholder="Tu nombre"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={
              formik.touched.name ? Boolean(formik.errors.name) : undefined
            }
            aria-describedby={
              formik.touched.name && formik.errors.name
                ? "register-name-error"
                : undefined
            }
            className="w-full border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          />
          {formik.touched.name && formik.errors.name && (
            <p
              id="register-name-error"
              className="font-body text-xs text-neon-pink"
            >
              {formik.errors.name}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="register-lastname"
            className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase text-neon-primary/80"
          >
            <UserIcon className="h-3.5 w-3.5" />
            Apellido
          </label>
          <input
            id="register-lastname"
            name="last_name"
            type="text"
            autoComplete="family-name"
            placeholder="Tu apellido"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={
              formik.touched.last_name
                ? Boolean(formik.errors.last_name)
                : undefined
            }
            aria-describedby={
              formik.touched.last_name && formik.errors.last_name
                ? "register-lastname-error"
                : undefined
            }
            className="w-full border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          />
          {formik.touched.last_name && formik.errors.last_name && (
            <p
              id="register-lastname-error"
              className="font-body text-xs text-neon-pink"
            >
              {formik.errors.last_name}
            </p>
          )}
        </div>
      </div>

      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="register-username"
          className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase text-neon-primary/80"
        >
          <UserIcon className="h-3.5 w-3.5" />
          Usuario
        </label>
        <input
          id="register-username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="gamer_tag99"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={
            formik.touched.username
              ? Boolean(formik.errors.username)
              : undefined
          }
          aria-describedby={
            formik.touched.username && formik.errors.username
              ? "register-username-error"
              : undefined
          }
          className="w-full border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
        />
        {formik.touched.username && formik.errors.username && (
          <p
            id="register-username-error"
            className="font-body text-xs text-neon-pink"
          >
            {formik.errors.username}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="register-email"
          className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase text-neon-primary/80"
        >
          <EmailIcon className="h-3.5 w-3.5" />
          Correo electronico
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={
            formik.touched.email ? Boolean(formik.errors.email) : undefined
          }
          aria-describedby={
            formik.touched.email && formik.errors.email
              ? "register-email-error"
              : undefined
          }
          className="w-full border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
        />
        {formik.touched.email && formik.errors.email && (
          <p
            id="register-email-error"
            className="font-body text-xs text-neon-pink"
          >
            {formik.errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="register-password"
          className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase text-neon-primary/80"
        >
          <LockIcon className="h-3.5 w-3.5" />
          Contrasena
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Minimo 6 caracteres"
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
              ? "register-password-error"
              : undefined
          }
          className="w-full border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
        />
        {formik.touched.password && formik.errors.password && (
          <p
            id="register-password-error"
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
        {formik.isSubmitting ? "Registrando…" : "Crear cuenta"}
        {!formik.isSubmitting && <BoltIcon className="h-5 w-5" />}
      </motion.button>
    </form>
  );
}
