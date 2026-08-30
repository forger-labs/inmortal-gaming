"use client";

import { BoltIcon, LockIcon, UserIcon } from "@shared/icons";
import { useFormik } from "formik";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { sileo } from "sileo";
import * as yup from "yup";

import { useAuthGuard } from "@/context/AuthGuardContext";

const loginSchema = yup.object({
  username: yup
    .string()
    .trim()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .required("Ingresa tu usuario"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("Ingresa tu contraseña"),
});

export function LoginForm({ variants }: { variants?: Variants }) {
  const { signIn } = useAuthGuard();
  const router = useRouter();

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      signIn(values.username.trim());
      sileo.success({
        title: "Sesión iniciada",
        description: `Bienvenido, ${values.username.trim()}`,
        position: "top-center",
      });
      router.push("/admin");
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
          htmlFor="login-username"
          className="flex items-center gap-2 font-mono text-[13px] font-semibold uppercase text-neon-primary/80"
        >
          <UserIcon className="h-4 w-4" />
          Usuario
        </label>
        <input
          id="login-username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="tu.usuario"
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
              ? "login-username-error"
              : undefined
          }
          className="w-full rounded-md border border-white/10 bg-bg-primary px-4 py-3 font-body text-base text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
        />
        {formik.touched.username && formik.errors.username && (
          <p
            id="login-username-error"
            className="font-body text-xs text-neon-pink"
          >
            {formik.errors.username}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="login-password"
          className="flex items-center gap-2 font-mono text-[13px] font-semibold uppercase text-neon-primary/80"
        >
          <LockIcon className="h-4 w-4" />
          Contraseña
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
        {formik.isSubmitting ? "Verificando…" : "Iniciar sesión"}
        {!formik.isSubmitting && <BoltIcon className="h-5 w-5" />}
      </motion.button>
    </motion.form>
  );
}
