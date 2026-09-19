"use client";

import { CloseIcon, ProductsIcon, UploadIcon } from "@shared/icons";
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewError, setPreviewError] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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
        image: yup
          .mixed()
          .test(
            "image-required",
            "Selecciona una imagen para el producto",
            (val) => {
              if (isEdit) return true;
              if (!val) return false;
              if (val instanceof File) return true;
              if (typeof val === "string" && val.trim().length > 0) return true;
              return false;
            },
          )
          .test(
            "file-type",
            "Formato no valido (usa PNG, JPG, JPEG o WEBP)",
            (val) => {
              if (!val || !(val instanceof File)) return true;
              return [
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/jpg",
              ].includes(val.type);
            },
          )
          .test("file-size", "La imagen no debe superar los 5MB", (val) => {
            if (!val || !(val instanceof File)) return true;
            return val.size <= 5 * 1024 * 1024;
          }),
        is_active: yup.boolean().default(true),
      }),
    [isEdit],
  );

  const formik = useFormik<ProductFormValues>({
    initialValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      category_id: product?.category_id ?? categories[0]?.id ?? "",
      image: product?.image ?? null,
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

  // Manejo de URL de vista previa para File o string
  useEffect(() => {
    if (formik.values.image instanceof File) {
      const url = URL.createObjectURL(formik.values.image);
      setFilePreview(url);
      setPreviewError(false);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    setFilePreview(null);
    setPreviewError(false);
  }, [formik.values.image]);

  const previewUrl = useMemo(() => {
    if (filePreview) return filePreview;
    if (typeof formik.values.image === "string" && formik.values.image.trim()) {
      return getR2ImageUrl(formik.values.image);
    }
    if (isEdit && product?.image) {
      return getR2ImageUrl(product.image);
    }
    return "";
  }, [filePreview, formik.values.image, isEdit, product?.image]);

  const handleFileSelect = (file: File | string | null) => {
    setPreviewError(false);
    formik.setFieldTouched("image", true, false);
    formik.setFieldValue("image", file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Enfoque inicial, cierre con Escape y bloqueo del scroll del fondo
  useEffect(() => {
    if (!open) return;
    setPreviewError(false);
    setIsDragging(false);

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

  const isNewFileSelected = formik.values.image instanceof File;
  const hasExistingImage =
    isEdit && !isNewFileSelected && Boolean(product?.image);
  const hasImage = Boolean(previewUrl);

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
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="product-form-category"
                        className="font-mono text-[11px] text-neon-primary/80 font-semibold uppercase tracking-wider"
                      >
                        Categoria
                      </label>
                    </div>
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
                    {formik.touched.category_id &&
                      Boolean(formik.errors.category_id) && (
                        <p className="font-mono text-[11px] text-neon-pink">
                          {formik.errors.category_id as string}
                        </p>
                      )}
                  </div>

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

                {/* Subida de Imagen (multipart/form-data) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="product-form-image"
                      className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neon-primary/80"
                    >
                      Imagen del producto
                    </label>
                    <span className="font-mono text-[10px] text-text-muted">
                      PNG, JPG, WEBP (Max. 5MB)
                    </span>
                  </div>

                  {/* Input oculto asociado al label */}
                  <input
                    ref={fileInputRef}
                    id="product-form-image"
                    name="image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    className="sr-only"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        handleFileSelect(files[0]);
                      }
                    }}
                  />

                  {/* Dropzone / Preview Area */}
                  {hasImage ? (
                    <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-bg-primary/70 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md border border-neon-primary/30 bg-bg-primary shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                          {previewUrl && !previewError ? (
                            <Image
                              src={previewUrl}
                              alt="Vista previa de la imagen del producto"
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

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-mono text-xs font-semibold text-text-primary">
                              {isNewFileSelected
                                ? (formik.values.image as File).name
                                : hasExistingImage
                                  ? product?.name || "Imagen actual"
                                  : "Imagen seleccionada"}
                            </span>
                            {isNewFileSelected ? (
                              <span className="shrink-0 rounded border border-neon-green/30 bg-neon-green/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-neon-green">
                                NUEVA
                              </span>
                            ) : hasExistingImage ? (
                              <span className="shrink-0 rounded border border-neon-purple/30 bg-neon-purple/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-neon-purple">
                                ACTUAL
                              </span>
                            ) : null}
                          </div>

                          <span className="font-body text-xs text-text-muted">
                            {isNewFileSelected
                              ? `${formatFileSize((formik.values.image as File).size)} :: ${(formik.values.image as File).type}`
                              : previewError
                                ? "Error al cargar la vista previa"
                                : "Imagen cargada desde el servidor"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 rounded-sm border border-neon-primary/30 bg-neon-primary/10 px-3 py-1.5 font-mono text-xs font-semibold text-neon-primary transition-all hover:bg-neon-primary/20 cursor-pointer"
                        >
                          <UploadIcon className="h-3.5 w-3.5" />
                          Cambiar
                        </button>

                        {isNewFileSelected && (
                          <button
                            type="button"
                            onClick={() => {
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                              handleFileSelect(
                                isEdit ? (product?.image ?? null) : null,
                              );
                            }}
                            className="rounded-sm border border-white/10 px-3 py-1.5 font-mono text-xs font-semibold text-text-secondary transition-colors hover:border-neon-pink/30 hover:text-neon-pink cursor-pointer"
                          >
                            {isEdit ? "Revertir" : "Quitar"}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="product-form-image"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-all ${
                        isDragging
                          ? "border-neon-primary bg-neon-primary/10 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                          : formik.touched.image && formik.errors.image
                            ? "border-neon-pink/60 bg-neon-pink/5 hover:border-neon-pink"
                            : "border-white/15 bg-bg-primary/40 hover:border-neon-primary/60 hover:bg-bg-primary/70"
                      }`}
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-neon-primary/30 bg-neon-primary/10 text-neon-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        <UploadIcon className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <p className="font-body text-xs font-medium text-text-primary">
                          <span className="text-neon-primary hover:underline">
                            Haz clic para seleccionar
                          </span>{" "}
                          o arrastra y suelta el archivo
                        </p>
                        <p className="font-mono text-[11px] text-text-muted">
                          Soporta PNG, JPG, JPEG o WEBP (hasta 5MB)
                        </p>
                      </div>
                    </label>
                  )}

                  {formik.touched.image && Boolean(formik.errors.image) && (
                    <p className="font-mono text-[11px] text-neon-pink">
                      {formik.errors.image as string}
                    </p>
                  )}
                </div>

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
