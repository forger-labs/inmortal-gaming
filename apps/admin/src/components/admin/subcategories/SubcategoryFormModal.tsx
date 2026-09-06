"use client";

import { CloseIcon, DeleteIcon, PlusIcon } from "@shared/icons";
import type {
  CategoryEntity,
  JsonShapeFieldItem,
  JsonShapeFieldType,
  SubcategoryEntity,
  SubcategoryFormValues,
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

const JSON_SHAPE_TYPES: { label: string; value: JsonShapeFieldType }[] = [
  { label: "string (Texto)", value: "string" },
  { label: "number (Numero)", value: "number" },
  { label: "boolean (Booleano)", value: "boolean" },
  { label: "array (Arreglo generico)", value: "array" },
  { label: "array[string] (Lista de textos)", value: "array[string]" },
  { label: "array[number] (Lista de numeros)", value: "array[number]" },
  { label: "array[object] (Lista de objetos)", value: "array[object]" },
  { label: "object (Objeto JSON)", value: "object" },
];

const generateFieldId = () =>
  `field_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;

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
        return entries.map(([key, type]) => ({
          id: generateFieldId(),
          key,
          type: type as JsonShapeFieldType,
        }));
      }
    }
    return [{ id: generateFieldId(), key: "", type: "string" }];
  }, [subcategory]);

  const schema = useMemo(
    () =>
      yup.object({
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
              type: yup.string().required("Selecciona un tipo"),
            }),
          )
          .min(1, "Debe haber al menos un atributo en el esquema JSON"),
      }),
    [],
  );

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
      { id: generateFieldId(), key: "", type: "string" as JsonShapeFieldType },
    ];
    formik.setFieldValue("fields", nextFields);
  };

  const handleRemoveField = (index: number) => {
    if (formik.values.fields.length <= 1) return;
    const nextFields = formik.values.fields.filter((_, i) => i !== index);
    formik.setFieldValue("fields", nextFields);
  };

  const handleFieldChange = (
    index: number,
    fieldKey: "key" | "type",
    val: string,
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
    const shape: Record<string, string> = {};
    for (const f of formik.values.fields) {
      if (f.key.trim()) {
        shape[f.key.trim()] = f.type;
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
              className="relative my-8 w-full max-w-[620px] rounded-xl border border-neon-primary/30 bg-bg-elevated shadow-[0_0_50px_-12px_rgba(0,240,255,0.35)]"
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
                className="flex flex-col gap-5 px-6 py-5"
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
                        Define los atributos y tipos de datos que tendran los
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

                  <div className="flex flex-col gap-2.5 mt-2">
                    {formik.values.fields.map((fieldItem, index) => {
                      const fieldError =
                        formik.errors.fields &&
                        typeof formik.errors.fields !== "string" &&
                        Array.isArray(formik.errors.fields)
                          ? (formik.errors.fields[index] as { key?: string })
                              ?.key
                          : undefined;

                      return (
                        <div
                          key={fieldItem.id}
                          className="flex items-start gap-2"
                        >
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Nombre del campo (ej. socket, ram_gb)"
                              value={fieldItem.key}
                              onChange={(e) =>
                                handleFieldChange(index, "key", e.target.value)
                              }
                              className={`w-full rounded-md border bg-bg-surface px-3 py-2 font-mono text-xs text-text-primary transition-all placeholder:text-text-muted/50 focus:outline-none focus:ring-1 ${
                                fieldError
                                  ? "border-neon-pink focus:border-neon-pink focus:ring-neon-pink"
                                  : "border-white/10 focus:border-neon-primary focus:ring-neon-primary"
                              }`}
                            />
                            {fieldError && (
                              <span className="font-body text-[10px] text-neon-pink mt-1 block">
                                {fieldError}
                              </span>
                            )}
                          </div>

                          <div className="w-44">
                            <select
                              value={fieldItem.type}
                              onChange={(e) =>
                                handleFieldChange(
                                  index,
                                  "type",
                                  e.target.value as JsonShapeFieldType,
                                )
                              }
                              className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-surface px-2.5 py-2 font-mono text-xs text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                            >
                              {JSON_SHAPE_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                  {t.label}
                                </option>
                              ))}
                            </select>
                          </div>

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
                      );
                    })}
                  </div>

                  {/* ─── Vista previa de JSON ─── */}
                  <div className="mt-2 rounded-md border border-white/5 bg-black/40 p-3">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
                      Vista previa de estructura:
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
