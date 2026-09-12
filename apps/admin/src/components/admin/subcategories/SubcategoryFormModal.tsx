"use client";

import { CloseIcon, DeleteIcon, PlusIcon } from "@shared/icons";
import type {
  CategoryEntity,
  JsonShapeFieldItem,
  JsonShapeFieldType,
  JsonShapeTag,
  SubcategoryEntity,
  SubcategoryFormValues,
} from "@shared/types";
import { generateRandomKey } from "@shared/utils";
import { useFormik } from "formik";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as yup from "yup";

import { EASE_OUT_EXPO } from "@/constants";
import { Field } from "../../forms/Field";
import { CancelButton } from "../commonForm/CancelButton";
import { FormInput } from "../commonForm/FormInput";
import { FormSubmitButton } from "../commonForm/FormSubmitButton";

const JSON_SHAPE_TYPES: { label: string; value: JsonShapeFieldType }[] = [
  { label: "string (Texto)", value: "string" },
  { label: "array (Lista de textos)", value: "array" },
];

const JSON_SHAPE_TAGS: { label: string; value: JsonShapeTag }[] = [
  { label: "h1 (Encabezado 1)", value: "h1" },
  { label: "h2 (Encabezado 2)", value: "h2" },
  { label: "h3 (Encabezado 3)", value: "h3" },
  { label: "h4 (Encabezado 4)", value: "h4" },
  { label: "h5 (Encabezado 5)", value: "h5" },
  { label: "h6 (Encabezado 6)", value: "h6" },
  { label: "p (Parrafo)", value: "p" },
  { label: "paragraph (Parrafo bloque)", value: "paragraph" },
  { label: "span (Inline / Linea corta)", value: "span" },
];

const FONT_WEIGHT_OPTIONS: { label: string; value: string }[] = [
  { label: "400 (Normal)", value: "400" },
  { label: "500 (Medium)", value: "500" },
  { label: "600 (Semi-bold)", value: "600" },
  { label: "700 (Bold)", value: "700" },
];

const schema = yup.object({
  subcategory_name: yup
    .string()
    .trim()
    .min(2, "Minimo 2 caracteres")
    .required("Ingresa el nombre de la subcategoria"),
  category_id: yup
    .mixed()
    .test(
      "category-required",
      "Selecciona una categoria",
      (val) => typeof val === "number" && val > 0,
    )
    .required("Selecciona una categoria"),
  fields: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required(),
        key: yup
          .string()
          .trim()
          .min(1, "El nombre del campo es requerido")
          .matches(
            /^[a-zA-Z0-9_-]+$/,
            "Usa solo letras, numeros, guiones o guiones bajos",
          )
          .required("Requerido"),
        field_type: yup
          .string()
          .oneOf(["string", "array"], "Selecciona un tipo valido")
          .required("Selecciona un tipo"),
        title_tag: yup
          .string()
          .oneOf(
            ["h1", "h2", "h3", "h4", "h5", "h6", "span", "p", "paragraph"],
            "Tag invalido",
          )
          .required("Selecciona un tag para el titulo"),
        tag: yup.string().when(["field_type"], ([fieldType], s) => {
          if (fieldType === "string") {
            return s
              .oneOf(
                ["h1", "h2", "h3", "h4", "h5", "h6", "span", "p", "paragraph"],
                "Tag invalido",
              )
              .required("Selecciona un tag para el contenido");
          }
          return s.notRequired();
        }),
        title_font_weight: yup.string().optional(),
        data_weight: yup.string().optional(),
        ordered: yup.boolean().optional(),
      }),
    )
    .min(1, "Debe haber al menos un atributo en el esquema JSON")
    .test(
      "unique-keys",
      "Los nombres de los campos deben ser unicos",
      (fields) => {
        if (!fields) return true;
        const keys = fields
          .map((f) => f.key?.trim().toLowerCase())
          .filter(Boolean);
        return new Set(keys).size === keys.length;
      },
    ),
});

interface SubcategoryFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  subcategory?: SubcategoryEntity;
  categories: CategoryEntity[];
  onSubmit: (values: SubcategoryFormValues) => Promise<void> | void;
  onClose: () => void;
}

export function SubcategoryFormModal({
  open,
  mode,
  subcategory,
  categories,
  onSubmit,
  onClose,
}: SubcategoryFormModalProps) {
  const isEdit = mode === "edit";
  const nameInputRef = useRef<HTMLInputElement>(null);

  const initialFields: JsonShapeFieldItem[] = useMemo(() => {
    if (subcategory?.json_shape) {
      const entries = Object.entries(subcategory.json_shape);
      if (entries.length > 0) {
        return entries.map(([key, config]) => {
          if (typeof config === "object" && config !== null) {
            const isArray =
              "field_type" in config && config.field_type === "array";
            const fieldType: JsonShapeFieldType = isArray ? "array" : "string";
            const tag =
              "tag" in config && typeof config.tag === "string"
                ? (config.tag as JsonShapeTag)
                : "p";
            const ordered =
              "ordered" in config ? Boolean(config.ordered) : false;
            const titleTag =
              "title_tag" in config && typeof config.title_tag === "string"
                ? (config.title_tag as JsonShapeTag)
                : "h2";
            const titleFontWeight =
              "title_font_weight" in config &&
              typeof config.title_font_weight === "string"
                ? config.title_font_weight
                : "500";
            const dataWeight =
              "data_weight" in config && typeof config.data_weight === "string"
                ? config.data_weight
                : "400";

            return {
              id: generateRandomKey(),
              key,
              field_type: fieldType,
              title_tag: titleTag,
              title_font_weight: titleFontWeight,
              tag,
              ordered,
              data_weight: dataWeight,
            };
          }
          const isArr = typeof config === "string" && config.includes("array");
          return {
            id: generateRandomKey(),
            key,
            field_type: isArr ? "array" : "string",
            title_tag: "h2",
            title_font_weight: "500",
            tag: "p",
            ordered: false,
            data_weight: "400",
          };
        });
      }
    }
    return [
      {
        id: generateRandomKey(),
        key: "",
        field_type: "string",
        title_tag: "h2",
        title_font_weight: "500",
        tag: "p",
        ordered: false,
        data_weight: "400",
      },
    ];
  }, [subcategory]);

  const formik = useFormik<SubcategoryFormValues>({
    initialValues: {
      subcategory_name: subcategory?.subcategory_name ?? "",
      category_id: subcategory?.category_id ?? categories[0]?.id ?? "",
      fields: initialFields,
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

  const handleAddField = () => {
    const nextFields: JsonShapeFieldItem[] = [
      ...formik.values.fields,
      {
        id: generateRandomKey(),
        key: "",
        field_type: "string",
        title_tag: "h2",
        title_font_weight: "500",
        tag: "p",
        ordered: false,
        data_weight: "400",
      },
    ];
    formik.setFieldValue("fields", nextFields);
  };

  const handleRemoveField = (index: number) => {
    if (formik.values.fields.length <= 1) return;
    const nextFields = formik.values.fields.filter((_, i) => i !== index);
    formik.setFieldValue("fields", nextFields);
  };

  const handleFieldChange = <K extends keyof JsonShapeFieldItem>(
    index: number,
    fieldKey: K,
    val: JsonShapeFieldItem[K],
  ) => {
    const nextFields = [...formik.values.fields];
    nextFields[index] = {
      ...nextFields[index],
      [fieldKey]: val,
    };
    formik.setFieldValue("fields", nextFields);
  };

  // Preview json_shape
  const previewJson = useMemo(() => {
    const shape: Record<string, Record<string, unknown>> = {};
    for (const f of formik.values.fields) {
      const key = f.key.trim();
      if (!key) continue;

      if (f.field_type === "string") {
        const item: Record<string, unknown> = {
          field_type: "string",
          title_tag: f.title_tag || "h2",
        };
        if (f.title_font_weight?.trim()) {
          item.title_font_weight = f.title_font_weight.trim();
        }
        item.tag = f.tag || "p";
        if (f.data_weight?.trim()) {
          item.data_weight = f.data_weight.trim();
        }
        shape[key] = item;
      } else if (f.field_type === "array") {
        const item: Record<string, unknown> = {
          field_type: "array",
          title_tag: f.title_tag || "h2",
        };
        if (f.title_font_weight?.trim()) {
          item.title_font_weight = f.title_font_weight.trim();
        }
        if (f.ordered) {
          item.ordered = true;
        }
        if (f.data_weight?.trim()) {
          item.data_weight = f.data_weight.trim();
        }
        shape[key] = item;
      }
    }
    return JSON.stringify(shape, null, 2);
  }, [formik.values.fields]);

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
            key="subcategory-form-backdrop"
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
            key="subcategory-form-dialog"
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="subcategory-form-title"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              className="relative my-8 w-full max-w-[700px] rounded-xl border border-neon-primary/30 bg-bg-elevated shadow-[0_0_50px_-12px_rgba(0,240,255,0.35)]"
            >
              {/* ─── Header ─── */}
              <header className="flex items-start justify-between gap-4 border-b border-white/5 px-6 py-5">
                <div>
                  <span
                    data-text="CATALOGO :: SUBCATEGORIAS"
                    className="glitch w-fit font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-neon-primary"
                  >
                    Catalogo :: Subcategorias
                  </span>
                  <h2
                    id="subcategory-form-title"
                    className="mt-1 font-display text-xl font-semibold text-text-primary"
                  >
                    {isEdit ? "Editar subcategoria" : "Crear subcategoria"}
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
                className="flex flex-col gap-5 px-6 py-5 max-h-[calc(100vh-180px)] overflow-y-auto"
                onSubmit={formik.handleSubmit}
                noValidate
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    id="subcategory-form-name"
                    label="Nombre de la subcategoria"
                    error={
                      formik.touched.subcategory_name
                        ? formik.errors.subcategory_name
                        : undefined
                    }
                  >
                    <FormInput
                      id="subcategory-form-name"
                      ref={nameInputRef}
                      name="subcategory_name"
                      type="text"
                      placeholder="ej. Procesadores, Teclados, etc."
                      value={formik.values.subcategory_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      hasError={
                        formik.touched.subcategory_name &&
                        Boolean(formik.errors.subcategory_name)
                      }
                      aria-invalid={
                        formik.touched.subcategory_name
                          ? Boolean(formik.errors.subcategory_name)
                          : undefined
                      }
                    />
                  </Field>

                  <Field
                    id="subcategory-form-category"
                    label="Categoria padre"
                    error={
                      formik.touched.category_id
                        ? (formik.errors.category_id as string)
                        : undefined
                    }
                  >
                    <select
                      id="subcategory-form-category"
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
                </div>

                {/* ─── Constructor de Esquema JSON (json_shape) ─── */}
                <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-bg-primary/60 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neon-primary">
                        Esquema JSON del Subproducto (json_shape)
                      </h3>
                      <p className="font-body text-xs text-text-muted mt-0.5">
                        Define los atributos, etiquetas HTML y formatos para los
                        subproductos
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddField}
                      className="flex items-center gap-1.5 rounded border border-neon-primary/40 bg-neon-primary/10 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-neon-primary transition-colors hover:bg-neon-primary hover:text-bg-primary active:scale-95 cursor-pointer"
                    >
                      <PlusIcon className="h-3.5 w-3.5" />
                      Agregar campo
                    </button>
                  </div>

                  {typeof formik.errors.fields === "string" && (
                    <div className="rounded border border-neon-pink/30 bg-neon-pink/10 px-3 py-2 font-mono text-xs text-neon-pink">
                      {formik.errors.fields}
                    </div>
                  )}

                  <div className="flex flex-col gap-3.5 mt-2">
                    {formik.values.fields.map((fieldItem, index) => {
                      const fieldErrors =
                        formik.errors.fields &&
                        Array.isArray(formik.errors.fields)
                          ? (formik.errors.fields[index] as
                              | Record<string, string>
                              | undefined)
                          : undefined;

                      const keyId = `field-key-${fieldItem.id}`;
                      const typeId = `field-type-${fieldItem.id}`;
                      const titleTagId = `field-title-tag-${fieldItem.id}`;
                      const titleWeightId = `field-title-weight-${fieldItem.id}`;
                      const contentTagId = `field-content-tag-${fieldItem.id}`;
                      const contentWeightId = `field-content-weight-${fieldItem.id}`;
                      const orderedId = `field-ordered-${fieldItem.id}`;

                      return (
                        <div
                          key={fieldItem.id}
                          className="flex flex-col gap-3 rounded-lg border border-white/10 bg-bg-surface/90 p-3.5 transition-colors hover:border-white/20"
                        >
                          {/* Fila principal: clave, tipo y boton eliminar */}
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <label
                                htmlFor={keyId}
                                className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1"
                              >
                                Clave del campo ({index + 1})
                              </label>
                              <input
                                id={keyId}
                                type="text"
                                placeholder="ej. description, perks, socket"
                                value={fieldItem.key}
                                onChange={(e) =>
                                  handleFieldChange(
                                    index,
                                    "key",
                                    e.target.value,
                                  )
                                }
                                className={`w-full rounded-md border bg-bg-primary px-3 py-2 font-mono text-xs text-text-primary transition-all placeholder:text-text-muted/50 focus:outline-none focus:ring-1 ${
                                  fieldErrors?.key
                                    ? "border-neon-pink focus:border-neon-pink focus:ring-neon-pink"
                                    : "border-white/10 focus:border-neon-primary focus:ring-neon-primary"
                                }`}
                              />
                              {fieldErrors?.key && (
                                <span className="font-body text-[10px] text-neon-pink mt-1 block">
                                  {fieldErrors.key}
                                </span>
                              )}
                            </div>

                            <div className="w-48">
                              <label
                                htmlFor={typeId}
                                className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1"
                              >
                                Tipo de dato
                              </label>
                              <select
                                id={typeId}
                                value={fieldItem.field_type}
                                onChange={(e) =>
                                  handleFieldChange(
                                    index,
                                    "field_type",
                                    e.target.value as JsonShapeFieldType,
                                  )
                                }
                                className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-2.5 py-2 font-mono text-xs text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                              >
                                {JSON_SHAPE_TYPES.map((t) => (
                                  <option key={t.value} value={t.value}>
                                    {t.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="pt-6">
                              <button
                                type="button"
                                disabled={formik.values.fields.length <= 1}
                                onClick={() => handleRemoveField(index)}
                                aria-label={`Eliminar campo ${index + 1}`}
                                className="rounded-md border border-white/10 p-2 text-text-muted transition-colors hover:border-neon-pink hover:text-neon-pink active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                              >
                                <DeleteIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Sub-panel de configuracion de renderizado */}
                          <div className="grid grid-cols-1 gap-2.5 border-t border-white/5 pt-2.5 sm:grid-cols-2 md:grid-cols-4">
                            <div>
                              <label
                                htmlFor={titleTagId}
                                className="block font-mono text-[10px] uppercase text-text-muted mb-1"
                              >
                                Tag del titulo *
                              </label>
                              <select
                                id={titleTagId}
                                value={fieldItem.title_tag}
                                onChange={(e) =>
                                  handleFieldChange(
                                    index,
                                    "title_tag",
                                    e.target.value as JsonShapeTag,
                                  )
                                }
                                className="w-full cursor-pointer rounded border border-white/10 bg-bg-primary px-2 py-1.5 font-mono text-xs text-text-primary focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                              >
                                {JSON_SHAPE_TAGS.map((tag) => (
                                  <option key={tag.value} value={tag.value}>
                                    {tag.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label
                                htmlFor={titleWeightId}
                                className="block font-mono text-[10px] uppercase text-text-muted mb-1"
                              >
                                Peso del titulo
                              </label>
                              <select
                                id={titleWeightId}
                                value={fieldItem.title_font_weight}
                                onChange={(e) =>
                                  handleFieldChange(
                                    index,
                                    "title_font_weight",
                                    e.target.value,
                                  )
                                }
                                className="w-full cursor-pointer rounded border border-white/10 bg-bg-primary px-2 py-1.5 font-mono text-xs text-text-primary focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                              >
                                {FONT_WEIGHT_OPTIONS.map((w) => (
                                  <option key={w.value} value={w.value}>
                                    {w.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {fieldItem.field_type === "string" ? (
                              <div>
                                <label
                                  htmlFor={contentTagId}
                                  className="block font-mono text-[10px] uppercase text-text-muted mb-1"
                                >
                                  Tag del contenido *
                                </label>
                                <select
                                  id={contentTagId}
                                  value={fieldItem.tag}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      index,
                                      "tag",
                                      e.target.value as JsonShapeTag,
                                    )
                                  }
                                  className="w-full cursor-pointer rounded border border-white/10 bg-bg-primary px-2 py-1.5 font-mono text-xs text-text-primary focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                                >
                                  {JSON_SHAPE_TAGS.map((tag) => (
                                    <option key={tag.value} value={tag.value}>
                                      {tag.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <div className="flex flex-col justify-center">
                                <label
                                  htmlFor={orderedId}
                                  className="block font-mono text-[10px] uppercase text-text-muted mb-1"
                                >
                                  Lista ordenada
                                </label>
                                <label
                                  htmlFor={orderedId}
                                  className="inline-flex cursor-pointer items-center gap-2 pt-1 font-mono text-xs text-text-secondary"
                                >
                                  <input
                                    id={orderedId}
                                    type="checkbox"
                                    checked={fieldItem.ordered}
                                    onChange={(e) =>
                                      handleFieldChange(
                                        index,
                                        "ordered",
                                        e.target.checked,
                                      )
                                    }
                                    className="h-4 w-4 rounded border-white/20 bg-bg-primary text-neon-primary focus:ring-neon-primary focus:ring-offset-bg-surface"
                                  />
                                  <span>
                                    {fieldItem.ordered
                                      ? "Numerada (<ol>)"
                                      : "Vinetas (<ul>)"}
                                  </span>
                                </label>
                              </div>
                            )}

                            <div>
                              <label
                                htmlFor={contentWeightId}
                                className="block font-mono text-[10px] uppercase text-text-muted mb-1"
                              >
                                Peso del contenido
                              </label>
                              <select
                                id={contentWeightId}
                                value={fieldItem.data_weight}
                                onChange={(e) =>
                                  handleFieldChange(
                                    index,
                                    "data_weight",
                                    e.target.value,
                                  )
                                }
                                className="w-full cursor-pointer rounded border border-white/10 bg-bg-primary px-2 py-1.5 font-mono text-xs text-text-primary focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                              >
                                {FONT_WEIGHT_OPTIONS.map((w) => (
                                  <option key={w.value} value={w.value}>
                                    {w.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ─── Vista previa de JSON ─── */}
                  <div className="mt-2 rounded-md border border-white/5 bg-black/40 p-3">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
                      Vista previa de estructura JSON:
                    </span>
                    <pre className="font-mono text-[11px] text-neon-green/90 overflow-x-auto whitespace-pre">
                      {previewJson}
                    </pre>
                  </div>
                </div>

                {/* ─── Footer ─── */}
                <div className="mt-2 flex flex-col-reverse gap-2 border-t border-white/5 pt-4 sm:flex-row sm:justify-end">
                  <CancelButton onClick={onClose} />
                  <FormSubmitButton
                    submitting={formik.isSubmitting}
                    isEdit={isEdit}
                    createLabel="Crear subcategoria"
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
