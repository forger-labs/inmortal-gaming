"use client";

import { CloseIcon } from "@shared/icons";
import type { CategoryEntity, CategoryFormValues } from "@shared/types";
import { useFormik } from "formik";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as yup from "yup";

import { EASE_OUT_EXPO } from "@/constants";
import { Field } from "../../forms/Field";
import { CancelButton } from "../commonForm/CancelButton";
import { FormInput } from "../commonForm/FormInput";
import { FormSubmitButton } from "../commonForm/FormSubmitButton";

interface CategoryFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  category?: CategoryEntity;
  onSubmit: (values: CategoryFormValues) => Promise<void> | void;
  onClose: () => void;
}

export function CategoryFormModal({
  open,
  mode,
  category,
  onSubmit,
  onClose,
}: CategoryFormModalProps) {
  const isEdit = mode === "edit";
  const nameInputRef = useRef<HTMLInputElement>(null);

  const schema = useMemo(
    () =>
      yup.object({
        category_name: yup
          .string()
          .trim()
          .min(2, "Minimo 2 caracteres")
          .required("Ingresa el nombre de la categoria"),
      }),
    [],
  );
  const formik = useFormik<CategoryFormValues>({
    initialValues: {
      category_name: category?.category_name ?? "",
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, helpers) => {
      try {
        helpers.resetForm();

        await onSubmit(values);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  // Enfoque inicial, cierre con Escape y bloqueo del scroll del fondo
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
            key="category-form-backdrop"
            className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm"
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
            key="category-form-dialog"
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="category-form-title"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              className="relative w-full max-w-[480px] rounded-xl border border-neon-primary/30 bg-bg-elevated shadow-[0_0_50px_-12px_rgba(0,240,255,0.35)]"
            >
              {/* ─── Header ─── */}
              <header className="flex items-start justify-between gap-4 border-b border-white/5 px-6 py-5">
                <div>
                  <span
                    data-text="CATALOGO :: CATEGORIAS"
                    className="glitch w-fit font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-neon-primary"
                  >
                    Catalogo :: Categorias
                  </span>
                  <h2
                    id="category-form-title"
                    className="mt-1 font-display text-xl font-semibold text-text-primary"
                  >
                    {isEdit ? "Editar categoria" : "Crear categoria"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar modal"
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
                <Field
                  id="category-form-name"
                  label="Nombre de la categoria"
                  error={
                    formik.touched.category_name
                      ? formik.errors.category_name
                      : undefined
                  }
                >
                  <FormInput
                    id="category-form-name"
                    ref={nameInputRef}
                    name="category_name"
                    type="text"
                    placeholder="ej. Videojuegos, Tarjetas de regalo, etc."
                    value={formik.values.category_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    hasError={
                      formik.touched.category_name &&
                      Boolean(formik.errors.category_name)
                    }
                    aria-invalid={
                      formik.touched.category_name
                        ? Boolean(formik.errors.category_name)
                        : undefined
                    }
                  />
                </Field>

                {/* ─── Footer ─── */}
                <div className="mt-4 flex flex-col-reverse gap-2 border-t border-white/5 pt-4 sm:flex-row sm:justify-end">
                  <CancelButton onClick={onClose} />
                  <FormSubmitButton
                    submitting={formik.isSubmitting}
                    isEdit={isEdit}
                    createLabel="Crear categoria"
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
