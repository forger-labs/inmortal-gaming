"use client";

import { BoltIcon, EmailIcon, LockIcon } from "@shared/icons";
import { useFormik } from "formik";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import * as yup from "yup";

import { cyberError, cyberSuccess } from "@/components/toasts/cyberToasts";
import { useAuthGuard } from "@/context/AuthGuardContext";

const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Ingresa un correo electronico valido")
    .required("Ingresa tu correo electronico"),
  password: yup
    .string()
    .min(6, "La contrasena debe tener al menos 6 caracteres")
    .required("Ingresa tu contrasena"),
});

export function LoginForm({ variants }: { variants?: Variants }) {
  const { signIn } = useAuthGuard();
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await signIn(values.email.trim(), values.password);
        cyberSuccess(`Sesion iniciada. Bienvenido, ${values.email.trim()}`);
        router.push("/admin");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Error al iniciar sesion";
        cyberError(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <motion.form
      variants={variants}
      className="mt-8 flex flex-col gap-5"
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
          name="email"
          type="email"
          autoComplete="email"
          placeholder="admin@inmortal.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={
            formik.touched.email ? Boolean(formik.errors.email) : undefined
          }
          aria-describedby={
            formik.touched.email && formik.errors.email
              ? "login-email-error"
              : undefined
          }
          className="w-full rounded-md border border-white/10 bg-bg-primary px-4 py-3 font-body text-base text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
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
          placeholder="••••••••"
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
          className="w-full rounded-md border border-white/10 bg-bg-primary px-4 py-3 font-body text-base text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
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

      <motion.button
        type="submit"
        disabled={formik.isSubmitting}
        whileTap={{ scale: 0.97 }}
        className="btn-neon-primary mt-2 flex w-full items-center justify-center gap-2 rounded-sm py-4 font-display text-sm font-semibold uppercase tracking-widest text-bg-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
      >
        {formik.isSubmitting ? "Verificando…" : "Iniciar sesion"}
        {!formik.isSubmitting && <BoltIcon className="h-5 w-5" />}
      </motion.button>
    </motion.form>
  );
}
