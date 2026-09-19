"use client";

import { CloseIcon } from "@shared/icons";
import type {
  AdminUser,
  AdminUserFormValues,
  AdminUserRole,
} from "@shared/types";
import { useFormik } from "formik";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as yup from "yup";

import { EASE_OUT_EXPO } from "@/constants";
import { Field } from "../../forms/Field";
import { CancelButton } from "../commonForm/CancelButton";
import { FormInput } from "../commonForm/FormInput";
import { FormSubmitButton } from "../commonForm/FormSubmitButton";

interface UserFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  user?: AdminUser;
  onSubmit: (values: AdminUserFormValues) => Promise<void> | void;
  onClose: () => void;
}

export function UserFormModal({
  open,
  mode,
  user,
  onSubmit,
  onClose,
}: UserFormModalProps) {
  const isEdit = mode === "edit";
  const nameInputRef = useRef<HTMLInputElement>(null);

  const schema = useMemo(
    () =>
      yup.object({
        name: yup
          .string()
          .trim()
          .min(2, "Minimo 2 caracteres")
          .required("Ingresa el nombre"),
        lastname: yup
          .string()
          .trim()
          .min(2, "Minimo 2 caracteres")
          .required("Ingresa el apellido"),
        email: yup
          .string()
          .trim()
          .email("Ingresa un correo electronico valido")
          .required("Ingresa el correo electronico"),
        password: isEdit
          ? yup
              .string()
              .test(
                "password-min",
                "Minimo 6 caracteres",
                (val) => !val || val.length >= 6,
              )
          : yup
              .string()
              .min(6, "Minimo 6 caracteres")
              .required("Ingresa una contrasena"),
        role: yup
          .mixed<AdminUserRole>()
          .oneOf(["SUPER_ADMIN", "ADMIN"])
          .required("Selecciona un rol"),
      }),
    [isEdit],
  );

  const formik = useFormik<AdminUserFormValues>({
    initialValues: {
      name: user?.name ?? "",
      lastname: user?.lastname ?? "",
      email: user?.email ?? "",
      password: "",
      role:
        user?.role?.toUpperCase() === "SUPERADMIN" ||
        user?.role?.toUpperCase() === "SUPER_ADMIN"
          ? "SUPER_ADMIN"
          : "ADMIN",
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, helpers) => {
      try {
        await onSubmit(values);
      } finally {
        helpers.setSubmitting(false);
      }
    },
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

    const frame = requestAnimationFrame(() => nameInputRef.current?.focus());

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
                    data-text="GESTION DE ADMINISTRADORES"
                    className="glitch w-fit font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-neon-primary"
                  >
                    Gestion de administradores
                  </span>
                  <h2
                    id="user-form-title"
                    className="mt-1 font-display text-xl font-semibold text-text-primary"
                  >
                    {isEdit ? "Editar administrador" : "Crear administrador"}
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
                    id="user-form-name"
                    label="Nombre"
                    error={formik.touched.name ? formik.errors.name : undefined}
                  >
                    <FormInput
                      id="user-form-name"
                      ref={nameInputRef}
                      name="name"
                      type="text"
                      autoComplete="given-name"
                      placeholder="ej. Jorge"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      hasError={
                        formik.touched.name && Boolean(formik.errors.name)
                      }
                      aria-invalid={
                        formik.touched.name
                          ? Boolean(formik.errors.name)
                          : undefined
                      }
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
                    <FormInput
                      id="user-form-lastname"
                      name="lastname"
                      type="text"
                      autoComplete="family-name"
                      placeholder="ej. Hernandez"
                      value={formik.values.lastname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      hasError={
                        formik.touched.lastname &&
                        Boolean(formik.errors.lastname)
                      }
                      aria-invalid={
                        formik.touched.lastname
                          ? Boolean(formik.errors.lastname)
                          : undefined
                      }
                    />
                  </Field>

                  <Field
                    id="user-form-email"
                    label="Correo electronico"
                    error={
                      formik.touched.email ? formik.errors.email : undefined
                    }
                  >
                    <FormInput
                      id="user-form-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="ej. admin@inmortal.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      hasError={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      aria-invalid={
                        formik.touched.email
                          ? Boolean(formik.errors.email)
                          : undefined
                      }
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
                      className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/50 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </Field>

                  <div className="sm:col-span-2">
                    <Field
                      id="user-form-password"
                      label={isEdit ? "Contrasena (opcional)" : "Contrasena"}
                      error={
                        formik.touched.password
                          ? formik.errors.password
                          : undefined
                      }
                    >
                      <FormInput
                        id="user-form-password"
                        name="password"
                        type="password"
                        autoComplete={isEdit ? "new-password" : "new-password"}
                        placeholder={
                          isEdit
                            ? "En blanco para mantener contrasena actual"
                            : "Minimo 6 caracteres"
                        }
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        hasError={
                          formik.touched.password &&
                          Boolean(formik.errors.password)
                        }
                        aria-invalid={
                          formik.touched.password
                            ? Boolean(formik.errors.password)
                            : undefined
                        }
                      />
                    </Field>
                  </div>
                </div>

                {isEdit && (
                  <p className="font-body text-xs leading-relaxed text-text-secondary">
                    Deja la contrasena en blanco para conservar la actual. La
                    contrasena nunca se muestra en la lista.
                  </p>
                )}

                {/* ─── Footer ─── */}
                <div className="mt-2 flex flex-col-reverse gap-2 border-t border-white/5 pt-4 sm:flex-row sm:justify-end">
                  <CancelButton onClick={onClose} />
                  <FormSubmitButton
                    submitting={formik.isSubmitting}
                    isEdit={isEdit}
                    createLabel="Crear administrador"
                    editLabel="Guardar cambios"
                  />
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
