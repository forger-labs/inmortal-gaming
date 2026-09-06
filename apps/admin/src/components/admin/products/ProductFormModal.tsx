"use client";

import { CloseIcon, ProductsIcon } from "@shared/icons";
import type {
  CategoryEntity,
  ProductEntity,
  ProductFormValues,
} from "@shared/types";
import { getR2ImageUrl } from "@shared/utils";
import { useFormik } from "formik";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import * as yup from "yup";

import { EASE_OUT_EXPO } from "@/constants";
import { Field } from "../../forms/Field";
import { CancelButton } from "../commonForm/CancelButton";
import { FormInput } from "../commonForm/FormInput";
import { FormSubmitButton } from "../commonForm/FormSubmitButton";

interface ProductFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  product?: ProductEntity;
  categories: CategoryEntity[];
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  onClose: () => void;
}

export function ProductFormModal({
  open,
  mode,
  product,
  categories,
  onSubmit,
  onClose,
}: ProductFormModalProps) {
  const isEdit = mode === "edit";
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [previewError, setPreviewError] = useState(false);

  const schema = useMemo(
    () =>
      yup.object({
        name: yup
          .string()
          .trim()
          .min(2, "Minimo 2 caracteres")
          .required("Ingresa el nombre del producto"),
        description: yup
          .string()
          .trim()
          .min(5, "Minimo 5 caracteres")
          .required("Ingresa la descripcion del producto"),
        category_id: yup
          .mixed()
          .test(
            "category-required",
            "Selecciona una categoria",
            (val) => typeof val === "number" && val > 0,
          )
          .required("Selecciona una categoria"),
        image: yup.string().trim().default(""),
        is_active: yup.boolean().default(true),
      }),
    [],
  );

  const formik = useFormik<ProductFormValues>({
    initialValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      category_id: product?.category_id ?? categories[0]?.id ?? "",
      image: product?.image ?? "",
      is_active: product?.is_active ?? true,
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

  const previewUrl = useMemo(
    () => getR2ImageUrl(formik.values.image),
    [formik.values.image],
  );

  // Enfoque inicial, cierre con Escape y bloqueo del scroll del fondo
  useEffect(() => {
    if (!open) return;
    setPreviewError(false);

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
            key="product-form-backdrop"
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
            key="product-form-dialog"
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="product-form-title"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              className="relative my-8 w-full max-w-[560px] rounded-xl border border-neon-primary/30 bg-bg-elevated shadow-[0_0_50px_-12px_rgba(0,240,255,0.35)]"
            >
              {/* ─── Header ─── */}
              <header className="flex items-start justify-between gap-4 border-b border-white/5 px-6 py-5">
                <div>
                  <span
                    data-text="CATALOGO :: PRODUCTOS"
                    className="glitch w-fit font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-neon-primary"
                  >
                    Catalogo :: Productos
                  </span>
                  <h2
                    id="product-form-title"
                    className="mt-1 font-display text-xl font-semibold text-text-primary"
                  >
                    {isEdit ? "Editar producto" : "Crear producto"}
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
                {/* Nombre */}
                <Field
                  id="product-form-name"
                  label="Nombre del producto"
                  error={formik.touched.name ? formik.errors.name : undefined}
                >
                  <FormInput
                    id="product-form-name"
                    ref={nameInputRef}
                    name="name"
                    type="text"
                    placeholder="ej. Cyberpunk 2077, World of Warcraft, etc."
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

                {/* Categoria + Estado */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    id="product-form-category"
                    label="Categoria"
                    error={
                      formik.touched.category_id
                        ? (formik.errors.category_id as string)
                        : undefined
                    }
                  >
                    <select
                      id="product-form-category"
                      name="category_id"
                      value={formik.values.category_id}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "category_id",
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      onBlur={formik.handleBlur}
                      className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                    >
                      <option value="">Selecciona una categoria</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.category_name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    id="product-form-status"
                    label="Estado de disponibilidad"
                    error={
                      formik.touched.is_active
                        ? (formik.errors.is_active as string)
                        : undefined
                    }
                  >
                    <select
                      id="product-form-status"
                      name="is_active"
                      value={formik.values.is_active ? "true" : "false"}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "is_active",
                          e.target.value === "true",
                        )
                      }
                      onBlur={formik.handleBlur}
                      className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                    >
                      <option value="true">Activo (Visible en catalogo)</option>
                      <option value="false">Inactivo (Oculto)</option>
                    </select>
                  </Field>
                </div>

                {/* Descripcion */}
                <Field
                  id="product-form-description"
                  label="Descripcion"
                  error={
                    formik.touched.description
                      ? formik.errors.description
                      : undefined
                  }
                >
                  <textarea
                    id="product-form-description"
                    name="description"
                    rows={3}
                    placeholder="Descripcion detallada del producto o juego..."
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full rounded-md border bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/50 focus:outline-none focus:ring-1 ${
                      formik.touched.description && formik.errors.description
                        ? "border-neon-pink focus:border-neon-pink focus:ring-neon-pink"
                        : "border-white/10 focus:border-neon-primary focus:ring-neon-primary"
                    }`}
                  />
                </Field>

                {/* Imagen / Clave R2 */}
                <Field
                  id="product-form-image"
                  label="Clave de imagen / URL (Cloudflare R2)"
                  error={formik.touched.image ? formik.errors.image : undefined}
                >
                  <FormInput
                    id="product-form-image"
                    name="image"
                    type="text"
                    placeholder="ej. cyberpunk-2077.jpg o URL de imagen"
                    value={formik.values.image}
                    onChange={(e) => {
                      setPreviewError(false);
                      formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                    hasError={
                      formik.touched.image && Boolean(formik.errors.image)
                    }
                  />
                </Field>

                {/* Vista previa de imagen */}
                {formik.values.image.trim() && (
                  <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-bg-primary/60 p-2.5">
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded border border-white/10 bg-bg-primary">
                      {previewUrl && !previewError ? (
                        <Image
                          src={previewUrl}
                          alt="Vista previa de imagen"
                          fill
                          sizes="80px"
                          className="object-cover"
                          onError={() => setPreviewError(true)}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ProductsIcon className="h-6 w-6 text-text-muted" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex flex-col">
                      <span className="font-mono text-[11px] font-semibold text-text-primary truncate">
                        {formik.values.image}
                      </span>
                      <span className="font-body text-[11px] text-text-muted">
                        {previewError
                          ? "No se pudo cargar la vista previa (se guardara la clave)"
                          : "Vista previa cargada"}
                      </span>
                    </div>
                  </div>
                )}

                {/* ─── Footer ─── */}
                <div className="mt-2 flex flex-col-reverse gap-2 border-t border-white/5 pt-4 sm:flex-row sm:justify-end">
                  <CancelButton onClick={onClose} />
                  <FormSubmitButton
                    submitting={formik.isSubmitting}
                    isEdit={isEdit}
                    createLabel="Crear producto"
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
