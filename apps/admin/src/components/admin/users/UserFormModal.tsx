"use client";

import { CloseIcon } from "@shared/icons";
import type {
  AdminUser,
  AdminUserFormValues,
  AdminUserRole,
  AdminUserStatus,
} from "@shared/types";
import { useFormik } from "formik";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as yup from "yup";

import { EASE_OUT_EXPO } from "@/constants";
import { Field } from "../../forms/Field";

interface UserFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  user?: AdminUser;
  existingUsernames: string[];
  onSubmit: (values: AdminUserFormValues) => void;
  onClose: () => void;
}

const inputClass =
  "w-full rounded-md border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/50 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary";

export function UserFormModal({
  open,
  mode,
  user,
  existingUsernames,
  onSubmit,
  onClose,
}: UserFormModalProps) {
  const isEdit = mode === "edit";
  const usernameInputRef = useRef<HTMLInputElement>(null);

  const schema = useMemo(
    () =>
      yup.object({
        username: yup
          .string()
          .trim()
          .min(3, "Mínimo 3 caracteres")
          .max(24, "Máximo 24 caracteres")
          .matches(
            /^[a-zA-Z0-9._-]+$/,
            "Solo letras, números, punto, guion y guion bajo",
          )
          .test("unique", "Ese usuario ya existe", (value) => {
            if (!value) return true;
            const normalized = value.trim().toLowerCase();
            return !existingUsernames.some(
              (existing) =>
                existing.toLowerCase() === normalized &&
                existing !== user?.username,
            );
          })
          .required("Ingresa el usuario"),
        password: yup
          .string()
          .min(6, "La contraseña debe tener al menos 6 caracteres")
          .required("Ingresa una contraseña"),
        name: yup
          .string()
          .trim()
          .min(2, "Mínimo 2 caracteres")
          .required("Ingresa el nombre"),
        lastname: yup
          .string()
          .trim()
          .min(2, "Mínimo 2 caracteres")
          .required("Ingresa el apellido"),
        role: yup
          .mixed<AdminUserRole>()
          .oneOf(["SUPER_ADMIN", "ADMIN"])
          .required("Selecciona un rol"),
        status: yup
          .mixed<AdminUserStatus>()
          .oneOf(["active", "inactive"])
          .required("Selecciona un estado"),
      }),
    [existingUsernames, user?.username],
  );

  const formik = useFormik<AdminUserFormValues>({
    initialValues: {
      username: user?.username ?? "",
      password: "",
      name: user?.name ?? "",
      lastname: user?.lastname ?? "",
      role: user?.role ?? "ADMIN",
      status: user?.status ?? "active",
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: (values) => onSubmit(values),
  });

  // Enfoque inicial, cierre con Escape y bloqueo del scroll del fondo.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() =>
      usernameInputRef.current?.focus(),
    );

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
            key="user-form-backdrop"
            className="absolute inset-0 z-60 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
        )}

        {open && (
          <motion.div
            key="user-form-dialog"
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="user-form-title"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              className="relative w-full max-w-[520px] rounded-xl border border-neon-primary/30 bg-bg-elevated shadow-[0_0_50px_-12px_rgba(0,240,255,0.35)]"
            >
              {/* ─── Header ─── */}
              <header className="flex items-start justify-between gap-4 border-b border-white/5 px-6 py-5">
                <div>
                  <span
                    data-text="GESTIÓN DE USUARIOS"
                    className="glitch w-fit font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-neon-primary"
                  >
                    Gestión de usuarios
                  </span>
                  <h2
                    id="user-form-title"
                    className="mt-1 font-display text-xl font-semibold text-text-primary"
                  >
                    {isEdit ? "Editar usuario" : "Crear usuario"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="rounded-md p-2 text-text-secondary transition-colors hover:text-neon-primary cursor-pointer"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </header>

              {/* ─── Form ─── */}
              <form
                className="flex flex-col gap-4 px-6 py-5"
                onSubmit={formik.handleSubmit}
                noValidate
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    id="user-form-username"
                    label="Usuario"
                    error={
                      formik.touched.username
                        ? formik.errors.username
                        : undefined
                    }
                  >
                    <input
                      id="user-form-username"
                      ref={usernameInputRef}
                      name="username"
                      type="text"
                      autoComplete="username"
                      placeholder="ej. j.hernandez"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      aria-invalid={
                        formik.touched.username
                          ? Boolean(formik.errors.username)
                          : undefined
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    id="user-form-password"
                    label={isEdit ? "Contraseña (opcional)" : "Contraseña"}
                    error={
                      formik.touched.password
                        ? formik.errors.password
                        : undefined
                    }
                  >
                    <input
                      id="user-form-password"
                      name="password"
                      type="password"
                      autoComplete={isEdit ? "new-password" : "new-password"}
                      placeholder={
                        isEdit
                          ? "En blanco para mantener"
                          : "Mínimo 6 caracteres"
                      }
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      aria-invalid={
                        formik.touched.password
                          ? Boolean(formik.errors.password)
                          : undefined
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    id="user-form-name"
                    label="Nombre"
                    error={formik.touched.name ? formik.errors.name : undefined}
                  >
                    <input
                      id="user-form-name"
                      name="name"
                      type="text"
                      autoComplete="given-name"
                      placeholder="ej. Jorge"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      aria-invalid={
                        formik.touched.name
                          ? Boolean(formik.errors.name)
                          : undefined
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    id="user-form-lastname"
                    label="Apellido"
                    error={
                      formik.touched.lastname
                        ? formik.errors.lastname
                        : undefined
                    }
                  >
                    <input
                      id="user-form-lastname"
                      name="lastname"
                      type="text"
                      autoComplete="family-name"
                      placeholder="ej. Hernández"
                      value={formik.values.lastname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      aria-invalid={
                        formik.touched.lastname
                          ? Boolean(formik.errors.lastname)
                          : undefined
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    id="user-form-role"
                    label="Rol"
                    error={formik.touched.role ? formik.errors.role : undefined}
                  >
                    <select
                      id="user-form-role"
                      name="role"
                      value={formik.values.role}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </Field>

                  <Field
                    id="user-form-status"
                    label="Estado"
                    error={
                      formik.touched.status ? formik.errors.status : undefined
                    }
                  >
                    <select
                      id="user-form-status"
                      name="status"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </Field>
                </div>

                {isEdit && (
                  <p className="font-body text-xs leading-relaxed text-text-secondary">
                    Deja la contraseña en blanco para conservar la actual. La
                    contraseña nunca se muestra en la lista.
                  </p>
                )}

                {/* ─── Footer ─── */}
                <div className="mt-2 flex flex-col-reverse gap-2 border-t border-white/5 pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-sm border border-white/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="btn-neon-primary flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-bg-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isEdit ? "Guardar cambios" : "Crear usuario"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
