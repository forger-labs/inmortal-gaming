"use client";

import { BoltIcon, EmailIcon, LockIcon, UserIcon } from "@shared/icons";
import { cyberError, cyberSuccess } from "@shared/toasts";
import type { UpdateUserDTO, UserMeDTO } from "@shared/types";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import * as yup from "yup";

import { useAuth } from "@/context/AuthContext";
import { webApi } from "@/libs/webApi";

interface ProfileFormProps {
  user: UserMeDTO;
}

const profileSchema = yup.object({
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
    .email("Ingresa un correo electronico valido")
    .required("Ingresa tu correo electronico"),
  password: yup
    .string()
    .test(
      "password-min",
      "La contrasena debe tener al menos 6 caracteres",
      (val) => !val || val.length >= 6,
    ),
});

export default function ProfileForm({ user }: ProfileFormProps) {
  const { getMe } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: user.name || "",
      last_name: user.last_name || "",
      username: user.username || "",
      email: user.email || "",
      password: "",
    },
    enableReinitialize: true,
    validationSchema: profileSchema,
    onSubmit: async (values, { setSubmitting, setFieldValue }) => {
      try {
        const payload: UpdateUserDTO = {
          name: values.name.trim(),
          last_name: values.last_name.trim(),
          username: values.username.trim(),
          email: values.email.trim(),
        };

        if (values.password && values.password.trim().length > 0) {
          payload.password = values.password;
        }

        await webApi.updateUser(user.id, payload);
        await getMe();
        setFieldValue("password", "");

        cyberSuccess(
          "Tus datos han sido actualizados exitosamente.",
          "[PERFIL ACTUALIZADO]",
        );
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Error al actualizar la informacion del perfil";
        cyberError(message, "[ERROR DE ACTUALIZACION]");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-white/10 bg-bg-surface/80 p-6 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div>
        <span
          data-text="INFORMACION DE USUARIO"
          className="glitch font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-neon-primary"
        >
          Informacion de usuario
        </span>
        <h2 className="mt-1 font-display text-xl font-bold text-text-primary">
          Editar Perfil
        </h2>
        <p className="mt-1 font-body text-xs text-text-secondary">
          Actualiza los datos de tu cuenta personal y credenciales de acceso.
        </p>
      </div>

      <form
        className="flex flex-col gap-5"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="profile-name"
              className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase text-neon-primary/80"
            >
              <UserIcon className="h-3.5 w-3.5" />
              Nombre
            </label>
            <input
              id="profile-name"
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
                  ? "profile-name-error"
                  : undefined
              }
              className="w-full border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
            />
            {formik.touched.name && formik.errors.name && (
              <p
                id="profile-name-error"
                className="font-body text-xs text-neon-pink"
              >
                {formik.errors.name}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="profile-lastname"
              className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase text-neon-primary/80"
            >
              <UserIcon className="h-3.5 w-3.5" />
              Apellido
            </label>
            <input
              id="profile-lastname"
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
                  ? "profile-lastname-error"
                  : undefined
              }
              className="w-full border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
            />
            {formik.touched.last_name && formik.errors.last_name && (
              <p
                id="profile-lastname-error"
                className="font-body text-xs text-neon-pink"
              >
                {formik.errors.last_name}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="profile-username"
              className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase text-neon-primary/80"
            >
              <UserIcon className="h-3.5 w-3.5" />
              Usuario
            </label>
            <input
              id="profile-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="usuario_tag"
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
                  ? "profile-username-error"
                  : undefined
              }
              className="w-full border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
            />
            {formik.touched.username && formik.errors.username && (
              <p
                id="profile-username-error"
                className="font-body text-xs text-neon-pink"
              >
                {formik.errors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="profile-email"
              className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase text-neon-primary/80"
            >
              <EmailIcon className="h-3.5 w-3.5" />
              Correo electronico
            </label>
            <input
              id="profile-email"
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
                  ? "profile-email-error"
                  : undefined
              }
              className="w-full border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
            />
            {formik.touched.email && formik.errors.email && (
              <p
                id="profile-email-error"
                className="font-body text-xs text-neon-pink"
              >
                {formik.errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="profile-password"
            className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase text-neon-primary/80"
          >
            <LockIcon className="h-3.5 w-3.5" />
            Nueva Contrasena (Opcional)
          </label>
          <input
            id="profile-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Dejar en blanco para mantener la contrasena actual"
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
                ? "profile-password-error"
                : undefined
            }
            className="w-full border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          />
          {formik.touched.password && formik.errors.password && (
            <p
              id="profile-password-error"
              className="font-body text-xs text-neon-pink"
            >
              {formik.errors.password}
            </p>
          )}
          <span className="font-body text-xs text-text-muted">
            Solo completa este campo si deseas cambiar tu clave actual (minimo 6
            caracteres).
          </span>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <motion.button
            type="submit"
            disabled={formik.isSubmitting}
            whileTap={{ scale: 0.98 }}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded bg-neon-primary px-6 py-3 font-display text-sm font-semibold uppercase tracking-widest text-bg-primary transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-60"
          >
            {formik.isSubmitting ? "Guardando cambios..." : "Guardar cambios"}
            {!formik.isSubmitting && <BoltIcon className="h-4 w-4" />}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
