"use client";

import { CloseIcon, UploadIcon } from "@shared/icons";
import type {
  JsonShapeArrayConfig,
  JsonShapeMap,
  ProductEntity,
  ServerEntity,
  SubcategoryEntity,
  SubProductDataMap,
  SubProductEntity,
  SubProductFormValues,
} from "@shared/types";
import { getR2ImageUrl } from "@shared/utils";
import { useFormik } from "formik";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import * as yup from "yup";

import { CancelButton } from "@/components/admin/commonForm/CancelButton";
import { FormInput } from "@/components/admin/commonForm/FormInput";
import { FormSubmitButton } from "@/components/admin/commonForm/FormSubmitButton";
import { Field } from "@/components/forms/Field";
import { EASE_OUT_EXPO } from "@/constants";
import { SubproductDynamicFields } from "./SubproductDynamicFields";

interface SubproductFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  subproduct?: SubProductEntity;
  products: ProductEntity[];
  subcategories: SubcategoryEntity[];
  servers: ServerEntity[];
  onSubmit: (values: SubProductFormValues) => Promise<void> | void;
  onClose: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function buildInitialProductData(
  jsonShape?: JsonShapeMap,
  existingData?: SubProductDataMap | Record<string, unknown>,
): Record<
  string,
  { title: string; description?: string; data: string | string[] }
> {
  const result: Record<
    string,
    { title: string; description?: string; data: string | string[] }
  > = {};

  if (!jsonShape) return result;

  for (const [key, configRaw] of Object.entries(jsonShape)) {
    const isArr =
      typeof configRaw === "object" && configRaw !== null
        ? (configRaw as JsonShapeArrayConfig).field_type === "array"
        : String(configRaw).includes("array");

    const existingVal = existingData?.[key] as
      | {
          title?: string;
          description?: string;
          data?: string | string[];
        }
      | undefined;

    if (isArr) {
      result[key] = {
        title: existingVal?.title || key,
        description: existingVal?.description || "",
        data: Array.isArray(existingVal?.data)
          ? existingVal.data
          : typeof existingVal?.data === "string" && existingVal.data
            ? [existingVal.data]
            : [""],
      };
    } else {
      result[key] = {
        title: existingVal?.title || key,
        data:
          typeof existingVal?.data === "string"
            ? existingVal.data
            : Array.isArray(existingVal?.data)
              ? existingVal.data.join(", ")
              : "",
      };
    }
  }

  return result;
}

export function SubproductFormModal({
  open,
  mode,
  subproduct,
  products,
  subcategories,
  servers,
  onSubmit,
  onClose,
}: SubproductFormModalProps) {
  const isEdit = mode === "edit";
  const nameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Subcategoria seleccionada actualmente
  const [selectedSubcatId, setSelectedSubcatId] = useState<number | "">(
    subproduct?.sub_category_id ?? subcategories[0]?.id ?? "",
  );

  // Sincronizar subcategoria seleccionada cuando cambia el subproducto o lista
  useEffect(() => {
    if (subproduct?.sub_category_id) {
      setSelectedSubcatId(subproduct.sub_category_id);
    } else if (subcategories.length > 0 && selectedSubcatId === "") {
      setSelectedSubcatId(subcategories[0].id);
    }
  }, [subproduct, subcategories, selectedSubcatId]);

  const activeSubcategory = useMemo(
    () => subcategories.find((s) => s.id === selectedSubcatId),
    [subcategories, selectedSubcatId],
  );

  // Construir valores iniciales dinamicos
  const initialProductData = useMemo(() => {
    return buildInitialProductData(
      activeSubcategory?.json_shape,
      subproduct?.product_data,
    );
  }, [activeSubcategory, subproduct]);

  // Esquema de validacion Yup: los campos dinamicos no son obligatorios
  const schema = useMemo(
    () =>
      yup.object({
        name: yup
          .string()
          .trim()
          .min(2, "Minimo 2 caracteres")
          .required("Ingresa el nombre del subproducto"),
        product_id: yup
          .mixed()
          .test(
            "product-required",
            "Selecciona un producto",
            (val) => typeof val === "number" && val > 0,
          )
          .required("Selecciona un producto"),
        sub_category_id: yup
          .mixed()
          .test(
            "subcategory-required",
            "Selecciona una subcategoria",
            (val) => typeof val === "number" && val > 0,
          )
          .required("Selecciona una subcategoria"),
        server_id: yup
          .mixed()
          .test(
            "server-required",
            "Selecciona un servidor",
            (val) => typeof val === "number" && val > 0,
          )
          .required("Selecciona un servidor"),
        price: yup
          .number()
          .typeError("El precio debe ser un numero")
          .min(0, "El precio no puede ser negativo")
          .required("Ingresa el precio"),
        is_active: yup.boolean().required(),
        image: yup
          .mixed()
          .test(
            "image-required",
            "Selecciona una imagen para el subproducto",
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
        product_data: yup.object().optional(),
      }),
    [isEdit],
  );

  const formik = useFormik<SubProductFormValues>({
    initialValues: {
      name: subproduct?.name ?? "",
      product_id: subproduct?.product_id ?? products[0]?.id ?? "",
      sub_category_id:
        subproduct?.sub_category_id ?? subcategories[0]?.id ?? "",
      server_id: subproduct?.server_id ?? servers[0]?.id ?? "",
      price: subproduct?.price ?? "",
      is_active: subproduct?.is_active ?? true,
      image: subproduct?.image ?? null,
      product_data: initialProductData,
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

  // Cambio reactivo de subcategoria con actualizacion de campos dinamicos
  const handleSubcategorySelect = (subcatId: number | "") => {
    setSelectedSubcatId(subcatId);
    formik.setFieldValue("sub_category_id", subcatId);
    const nextSubcat = subcategories.find((s) => s.id === subcatId);
    const nextProductData = buildInitialProductData(
      nextSubcat?.json_shape,
      formik.values.product_data,
    );
    formik.setFieldValue("product_data", nextProductData);
  };

  const previewUrl = useMemo(() => {
    if (filePreview) return filePreview;
    if (typeof formik.values.image === "string" && formik.values.image.trim()) {
      return getR2ImageUrl(formik.values.image);
    }
    if (isEdit && subproduct?.image) {
      return getR2ImageUrl(subproduct.image);
    }
    return "";
  }, [filePreview, formik.values.image, isEdit, subproduct?.image]);

  const handleFileChange = (file: File | null) => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    if (!file) {
      formik.setFieldValue("image", null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);
    formik.setFieldValue("image", file);
  };

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  // Controladores para campos dinamicos
  const handleStringFieldChange = (
    fieldKey: string,
    prop: "title" | "data",
    value: string,
  ) => {
    formik.setFieldValue(`product_data.${fieldKey}.${prop}`, value);
  };

  const handleArrayFieldChange = (
    fieldKey: string,
    prop: "title" | "description",
    value: string,
  ) => {
    formik.setFieldValue(`product_data.${fieldKey}.${prop}`, value);
  };

  const handleArrayItemChange = (
    fieldKey: string,
    itemIndex: number,
    value: string,
  ) => {
    const currentArray = [
      ...(formik.values.product_data[fieldKey]?.data || []),
    ] as string[];
    currentArray[itemIndex] = value;
    formik.setFieldValue(`product_data.${fieldKey}.data`, currentArray);
  };

  const handleAddArrayItem = (fieldKey: string) => {
    const currentArray = [
      ...(formik.values.product_data[fieldKey]?.data || []),
    ] as string[];
    currentArray.push("");
    formik.setFieldValue(`product_data.${fieldKey}.data`, currentArray);
  };

  const handleRemoveArrayItem = (fieldKey: string, itemIndex: number) => {
    const currentArray = [
      ...(formik.values.product_data[fieldKey]?.data || []),
    ] as string[];
    if (currentArray.length <= 1) return;
    const filtered = currentArray.filter((_, i) => i !== itemIndex);
    formik.setFieldValue(`product_data.${fieldKey}.data`, filtered);
  };

  // Enfoque inicial, escape y bloqueo del scroll
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
            key="subproduct-form-backdrop"
            className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm"
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
            key="subproduct-form-dialog"
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="subproduct-form-title"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              className="relative my-8 w-full max-w-[800px] rounded-xl border border-neon-primary/30 bg-bg-elevated shadow-[0_0_60px_-12px_rgba(0,240,255,0.4)]"
            >
              {/* ─── Header ─── */}
              <header className="flex items-start justify-between gap-4 border-b border-white/5 px-6 py-5">
                <div>
                  <span
                    data-text="CATALOGO :: SUBPRODUCTOS"
                    className="glitch w-fit font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-neon-primary"
                  >
                    Catalogo :: Subproductos
                  </span>
                  <h2
                    id="subproduct-form-title"
                    className="mt-1 font-display text-xl font-semibold text-text-primary"
                  >
                    {isEdit ? "Editar subproducto" : "Crear subproducto"}
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

              {/* ─── Formulario ─── */}
              <form
                className="flex flex-col gap-5 px-6 py-5 max-h-[calc(100vh-180px)] overflow-y-auto"
                onSubmit={formik.handleSubmit}
                noValidate
              >
                {/* ─── Fila 1: Nombre y Precio ─── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                  <div className="sm:col-span-8">
                    <Field
                      id="subproduct-form-name"
                      label="Nombre del subproducto"
                      error={
                        formik.touched.name ? formik.errors.name : undefined
                      }
                    >
                      <FormInput
                        id="subproduct-form-name"
                        ref={nameInputRef}
                        name="name"
                        type="text"
                        placeholder="ej. Intel Core i9-14900K 24-Core"
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
                  </div>

                  <div className="sm:col-span-4">
                    <Field
                      id="subproduct-form-price"
                      label="Precio (USD)"
                      error={
                        formik.touched.price
                          ? (formik.errors.price as string)
                          : undefined
                      }
                    >
                      <FormInput
                        id="subproduct-form-price"
                        name="price"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="ej. 599"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        hasError={
                          formik.touched.price && Boolean(formik.errors.price)
                        }
                        aria-invalid={
                          formik.touched.price
                            ? Boolean(formik.errors.price)
                            : undefined
                        }
                      />
                    </Field>
                  </div>
                </div>

                {/* ─── Fila 2: Relaciones (Producto, Subcategoria, Servidor) ─── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field
                    id="subproduct-form-product"
                    label="Producto padre"
                    error={
                      formik.touched.product_id
                        ? (formik.errors.product_id as string)
                        : undefined
                    }
                  >
                    <select
                      id="subproduct-form-product"
                      name="product_id"
                      value={formik.values.product_id}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "product_id",
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      onBlur={formik.handleBlur}
                      className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3 py-2 font-body text-xs text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                    >
                      <option value="">Selecciona un producto</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    id="subproduct-form-subcategory"
                    label="Subcategoria"
                    error={
                      formik.touched.sub_category_id
                        ? (formik.errors.sub_category_id as string)
                        : undefined
                    }
                  >
                    <select
                      id="subproduct-form-subcategory"
                      name="sub_category_id"
                      value={formik.values.sub_category_id}
                      onChange={(e) =>
                        handleSubcategorySelect(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      onBlur={formik.handleBlur}
                      className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3 py-2 font-body text-xs text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                    >
                      <option value="">Selecciona una subcategoria</option>
                      {subcategories.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.subcategory_name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    id="subproduct-form-server"
                    label="Servidor de entrega"
                    error={
                      formik.touched.server_id
                        ? (formik.errors.server_id as string)
                        : undefined
                    }
                  >
                    <select
                      id="subproduct-form-server"
                      name="server_id"
                      value={formik.values.server_id}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "server_id",
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      onBlur={formik.handleBlur}
                      className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3 py-2 font-body text-xs text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                    >
                      <option value="">Selecciona un servidor</option>
                      {servers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.server_name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* ─── Fila 3: Imagen y Estado Activo ─── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                  {/* Carga de Imagen */}
                  <div className="sm:col-span-8">
                    <Field
                      id="subproduct-form-image"
                      label="Imagen del subproducto"
                      error={
                        formik.touched.image
                          ? (formik.errors.image as string)
                          : undefined
                      }
                    >
                      <div className="relative">
                        <input
                          id="subproduct-form-image"
                          name="subproduct-form-image"
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="sr-only"
                          onChange={(e) =>
                            handleFileChange(e.target.files?.[0] || null)
                          }
                        />

                        {previewUrl ? (
                          <div className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-bg-primary/70 p-3">
                            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded border border-white/10 bg-black">
                              <Image
                                src={previewUrl}
                                alt="Vista previa del subproducto"
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-1 flex-col text-left">
                              <span className="truncate font-mono text-xs font-semibold text-text-primary">
                                {formik.values.image instanceof File
                                  ? formik.values.image.name
                                  : "Imagen actual"}
                              </span>
                              <span className="font-mono text-[10px] text-text-muted">
                                {formik.values.image instanceof File
                                  ? formatFileSize(formik.values.image.size)
                                  : "Almacenada en R2"}
                              </span>
                              <label
                                htmlFor="subproduct-form-image"
                                className="mt-1 cursor-pointer text-left font-mono text-[11px] text-neon-primary hover:underline"
                              >
                                Cambiar imagen
                              </label>
                            </div>
                          </div>
                        ) : (
                          <label
                            htmlFor="subproduct-form-image"
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDragging(false);
                              const file = e.dataTransfer.files?.[0];
                              if (file) handleFileChange(file);
                            }}
                            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition-all ${
                              isDragging
                                ? "border-neon-primary bg-neon-primary/10"
                                : formik.touched.image && formik.errors.image
                                  ? "border-neon-pink/50 bg-neon-pink/5"
                                  : "border-white/15 bg-bg-primary/50 hover:border-white/30"
                            }`}
                          >
                            <UploadIcon className="mb-1 h-6 w-6 text-neon-primary" />
                            <span className="font-mono text-xs text-text-primary">
                              Arrastra una imagen o haz clic para seleccionar
                            </span>
                            <span className="font-mono text-[10px] text-text-muted">
                              PNG, JPG o WEBP (Max. 5MB)
                            </span>
                          </label>
                        )}
                      </div>
                    </Field>
                  </div>

                  {/* Toggle Activo */}
                  <div className="flex flex-col justify-center rounded-lg border border-white/10 bg-bg-surface p-4 sm:col-span-4">
                    <label
                      htmlFor="subproduct-form-active"
                      className="mb-1 font-mono text-xs font-semibold uppercase tracking-wider text-text-primary"
                    >
                      Estado en Tienda
                    </label>
                    <label
                      htmlFor="subproduct-form-active"
                      className="inline-flex cursor-pointer items-center gap-2 pt-1 font-body text-xs text-text-secondary"
                    >
                      <input
                        id="subproduct-form-active"
                        name="is_active"
                        type="checkbox"
                        checked={formik.values.is_active}
                        onChange={formik.handleChange}
                        className="h-4 w-4 rounded border-white/20 bg-bg-primary text-neon-primary focus:ring-neon-primary"
                      />
                      <span>
                        {formik.values.is_active
                          ? "Subproducto Activo"
                          : "Subproducto Inactivo"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* ─── Constructor Dinamico: Product Data Segun json_shape ─── */}
                <SubproductDynamicFields
                  subcategory={activeSubcategory}
                  productData={formik.values.product_data}
                  onChangeStringField={handleStringFieldChange}
                  onChangeArrayField={handleArrayFieldChange}
                  onArrayItemChange={handleArrayItemChange}
                  onAddArrayItem={handleAddArrayItem}
                  onRemoveArrayItem={handleRemoveArrayItem}
                />

                {/* ─── Footer ─── */}
                <div className="mt-2 flex flex-col-reverse gap-2 border-t border-white/5 pt-4 sm:flex-row sm:justify-end">
                  <CancelButton onClick={onClose} />
                  <FormSubmitButton
                    submitting={formik.isSubmitting}
                    isEdit={isEdit}
                    createLabel="Crear subproducto"
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
