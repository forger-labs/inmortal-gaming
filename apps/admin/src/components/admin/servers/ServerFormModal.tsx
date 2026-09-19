"use client";

import { CloseIcon } from "@shared/icons";
import type {
  ProductEntity,
  ServerEntity,
  ServerFormValues,
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

interface ServerFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  server?: ServerEntity;
  products: ProductEntity[];
  initialProductId?: number;
  onSubmit: (values: ServerFormValues) => Promise<void> | void;
  onClose: () => void;
}

export function ServerFormModal({
  open,
  mode,
  server,
  products,
  initialProductId,
  onSubmit,
  onClose,
}: ServerFormModalProps) {
  const isEdit = mode === "edit";
  const nameInputRef = useRef<HTMLInputElement>(null);

  const schema = useMemo(
    () =>
      yup.object({
        server_name: yup
          .string()
          .trim()
          .min(2, "Minimo 2 caracteres")
          .required("Ingresa el nombre del servidor"),
        product_id: yup
          .mixed()
          .test(
            "product-required",
            "Selecciona un producto",
            (val) => typeof val === "number" && val > 0,
          )
          .required("Selecciona un producto"),
      }),
    [],
  );

  const formik = useFormik<ServerFormValues>({
    initialValues: {
      server_name: server?.server_name ?? "",
      product_id:
        server?.product_id ??
        initialProductId ??
        (products.length > 0 ? products[0].id : ""),
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, helpers) => {
      try {
        await onSubmit(values);
        helpers.resetForm();
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  // Enfoque inicial, escape key y bloqueo de scroll
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
            key="server-form-backdrop"
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
            key="server-form-dialog"
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="server-form-title"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              className="relative w-full max-w-[500px] rounded-xl border border-neon-primary/30 bg-bg-elevated shadow-[0_0_50px_-12px_rgba(0,240,255,0.35)]"
            >
              {/* ─── Header ─── */}
              <header className="flex items-start justify-between gap-4 border-b border-white/5 px-6 py-5">
                <div>
                  <span
                    data-text="CATALOGO :: SERVIDORES"
                    className="glitch w-fit font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-neon-primary"
                  >
                    Catalogo :: Servidores
                  </span>
                  <h2
                    id="server-form-title"
                    className="mt-1 font-display text-xl font-semibold text-text-primary"
                  >
                    {isEdit ? "Editar servidor" : "Crear servidor"}
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
                {/* Nombre de servidor */}
                <Field
                  id="server-form-name"
                  label="Nombre del servidor"
                  error={
                    formik.touched.server_name
                      ? formik.errors.server_name
                      : undefined
                  }
                >
                  <FormInput
                    id="server-form-name"
                    ref={nameInputRef}
                    name="server_name"
                    type="text"
                    placeholder="ej. NA East, Europa Oeste, Servidor 1, etc."
                    value={formik.values.server_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    hasError={
                      formik.touched.server_name &&
                      Boolean(formik.errors.server_name)
                    }
                    aria-invalid={
                      formik.touched.server_name
                        ? Boolean(formik.errors.server_name)
                        : undefined
                    }
                  />
                </Field>

                {/* Producto asignado */}
                <Field
                  id="server-form-product"
                  label="Producto asignado"
                  error={
                    formik.touched.product_id
                      ? (formik.errors.product_id as string)
                      : undefined
                  }
                >
                  <select
                    id="server-form-product"
                    name="product_id"
                    value={formik.values.product_id}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "product_id",
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    onBlur={formik.handleBlur}
                    className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                  >
                    <option value="">Selecciona un producto</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* ─── Footer ─── */}
                <div className="mt-4 flex flex-col-reverse gap-2 border-t border-white/5 pt-4 sm:flex-row sm:justify-end">
                  <CancelButton onClick={onClose} />
                  <FormSubmitButton
                    submitting={formik.isSubmitting}
                    isEdit={isEdit}
                    createLabel="Crear servidor"
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
