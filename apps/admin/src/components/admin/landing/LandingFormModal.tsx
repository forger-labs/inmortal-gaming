"use client";

import { CloseIcon, LandingIcon } from "@shared/icons";
import type {
  CategoryEntity,
  LandingItemEntity,
  LandingItemFormValues,
  LandingSortBy,
  SubcategoryEntity,
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

const SORT_BY_OPTIONS: { label: string; value: LandingSortBy }[] = [
  { label: "Mas vendidos (mostSell)", value: "mostSell" },
  { label: "Mas nuevos (newest)", value: "newest" },
  { label: "Mas antiguos (oldest)", value: "oldest" },
  { label: "Precio: menor a mayor (cheaper)", value: "cheaper" },
  { label: "Precio: mayor a menor (mostExpensive)", value: "mostExpensive" },
];

interface LandingFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  item?: LandingItemEntity;
  categories: CategoryEntity[];
  subcategories: SubcategoryEntity[];
  nextOrder?: number;
  onSubmit: (values: LandingItemFormValues) => Promise<void> | void;
  onClose: () => void;
}

export function LandingFormModal({
  open,
  mode,
  item,
  categories,
  subcategories,
  nextOrder = 0,
  onSubmit,
  onClose,
}: LandingFormModalProps) {
  const isEdit = mode === "edit";
  const titleInputRef = useRef<HTMLInputElement>(null);

  const schema = useMemo(
    () =>
      yup.object({
        title: yup
          .string()
          .trim()
          .min(2, "Minimo 2 caracteres")
          .required("El titulo es requerido"),
        description: yup
          .string()
          .trim()
          .min(3, "Minimo 3 caracteres")
          .required("La descripcion es requerida"),
        target_type: yup
          .string()
          .oneOf(["category", "subcategory"])
          .required("Selecciona el tipo de seccion"),
        category_id: yup.mixed().when(["target_type"], ([target_type], s) => {
          if (target_type === "category") {
            return s
              .required("Debes seleccionar una categoria")
              .test(
                "is-valid-id",
                "Selecciona una categoria valida",
                (val) => typeof val === "number" && val > 0,
              );
          }
          return s.notRequired();
        }),
        sub_category_id: yup
          .mixed()
          .when(["target_type"], ([target_type], s) => {
            if (target_type === "subcategory") {
              return s
                .required("Debes seleccionar una subcategoria")
                .test(
                  "is-valid-id",
                  "Selecciona una subcategoria valida",
                  (val) => typeof val === "number" && val > 0,
                );
            }
            return s.notRequired();
          }),
        qt_products_show: yup
          .number()
          .typeError("Debe ser un numero")
          .min(1, "Minimo 1 producto")
          .max(50, "Maximo 50 productos")
          .required("Indica la cantidad"),
        order: yup
          .number()
          .typeError("Debe ser un numero")
          .min(0, "Minimo 0")
          .required("Indica la posicion"),
        sort_by: yup
          .string()
          .oneOf(
            ["mostSell", "newest", "oldest", "cheaper", "mostExpensive"],
            "Criterio de ordenamiento no valido",
          )
          .required("Selecciona el ordenamiento"),
        show: yup.boolean().required(),
      }),
    [],
  );

  const initialValues: LandingItemFormValues = useMemo(() => {
    if (item && isEdit) {
      const isSub = Boolean(item.sub_category_id);
      return {
        title: item.title,
        description: item.description,
        target_type: isSub ? "subcategory" : "category",
        category_id: item.category_id ?? "",
        sub_category_id: item.sub_category_id ?? "",
        show: item.show,
        qt_products_show: item.qt_products_show ?? 8,
        order: item.order ?? 0,
        sort_by: item.sort_by ?? "mostSell",
      };
    }
    return {
      title: "",
      description: "",
      target_type: "category",
      category_id: categories[0]?.id ?? "",
      sub_category_id: subcategories[0]?.id ?? "",
      show: true,
      qt_products_show: 8,
      order: nextOrder,
      sort_by: "mostSell",
    };
  }, [item, isEdit, categories, subcategories, nextOrder]);

  const formik = useFormik<LandingItemFormValues>({
    enableReinitialize: true,
    initialValues,
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onSubmit(values);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    const timeout = setTimeout(() => {
      titleInputRef.current?.focus();
    }, 50);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      clearTimeout(timeout);
    };
  }, [open, onClose]);

  const getSubcategoryLabel = (sub: SubcategoryEntity) => {
    const parent = categories.find((cat) => cat.id === sub.category_id);
    return parent
      ? `${sub.subcategory_name} (${parent.category_name})`
      : sub.subcategory_name;
  };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <motion.div
            key="landing-modal-backdrop"
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
            key="landing-modal-dialog"
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="landing-modal-title"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              className="relative max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-xl border border-neon-primary/30 bg-bg-elevated shadow-[0_0_50px_-12px_rgba(0,240,255,0.35)]"
            >
              {/* ─── Header ─── */}
              <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/5 bg-bg-elevated/95 px-6 py-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-neon-primary/30 bg-neon-primary/10 text-neon-primary">
                    <LandingIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2
                      id="landing-modal-title"
                      className="font-display text-lg font-semibold text-text-primary"
                    >
                      {isEdit
                        ? "Editar seccion de landing"
                        : "Nueva seccion para landing"}
                    </h2>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                      {isEdit
                        ? `ID #${String(item?.id).padStart(3, "0")}`
                        : "Configuracion de visualizacion"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar modal"
                  className="rounded-md p-2 text-text-secondary transition-colors hover:text-neon-pink cursor-pointer"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </header>

              {/* ─── Formulario ─── */}
              <form onSubmit={formik.handleSubmit}>
                <div className="space-y-4 px-6 py-5">
                  {/* Tipo de destino: Categoria o Subcategoria */}
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Tipo de elemento a mostrar
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("target_type", "category");
                          if (!formik.values.category_id && categories[0]) {
                            formik.setFieldValue(
                              "category_id",
                              categories[0].id,
                            );
                          }
                        }}
                        className={`flex items-center justify-center rounded-md border px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                          formik.values.target_type === "category"
                            ? "border-neon-primary bg-neon-primary/15 text-neon-primary shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                            : "border-white/10 bg-bg-primary/50 text-text-secondary hover:border-white/20 hover:text-text-primary"
                        }`}
                      >
                        Categoria completa
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("target_type", "subcategory");
                          if (
                            !formik.values.sub_category_id &&
                            subcategories[0]
                          ) {
                            formik.setFieldValue(
                              "sub_category_id",
                              subcategories[0].id,
                            );
                          }
                        }}
                        className={`flex items-center justify-center rounded-md border px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                          formik.values.target_type === "subcategory"
                            ? "border-neon-purple bg-neon-purple/15 text-neon-purple shadow-[0_0_12px_rgba(123,45,255,0.2)]"
                            : "border-white/10 bg-bg-primary/50 text-text-secondary hover:border-white/20 hover:text-text-primary"
                        }`}
                      >
                        Subcategoria especifica
                      </button>
                    </div>
                  </div>

                  {/* Selector Categoria / Subcategoria segun tipo */}
                  {formik.values.target_type === "category" ? (
                    <Field
                      id="landing-category"
                      label="Categoria a mostrar"
                      error={
                        formik.touched.category_id
                          ? (formik.errors.category_id as string)
                          : undefined
                      }
                    >
                      <select
                        id="landing-category"
                        name="category_id"
                        value={formik.values.category_id}
                        onChange={(event) =>
                          formik.setFieldValue(
                            "category_id",
                            Number(event.target.value),
                          )
                        }
                        onBlur={formik.handleBlur}
                        className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                      >
                        <option value="" disabled>
                          Selecciona una categoria
                        </option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.category_name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  ) : (
                    <Field
                      id="landing-subcategory"
                      label="Subcategoria a mostrar"
                      error={
                        formik.touched.sub_category_id
                          ? (formik.errors.sub_category_id as string)
                          : undefined
                      }
                    >
                      <select
                        id="landing-subcategory"
                        name="sub_category_id"
                        value={formik.values.sub_category_id}
                        onChange={(event) =>
                          formik.setFieldValue(
                            "sub_category_id",
                            Number(event.target.value),
                          )
                        }
                        onBlur={formik.handleBlur}
                        className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple"
                      >
                        <option value="" disabled>
                          Selecciona una subcategoria
                        </option>
                        {subcategories.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {getSubcategoryLabel(sub)}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}

                  {/* Titulo */}
                  <Field
                    id="landing-title"
                    label="Titulo visible en landing"
                    error={
                      formik.touched.title ? formik.errors.title : undefined
                    }
                  >
                    <FormInput
                      ref={titleInputRef}
                      id="landing-title"
                      name="title"
                      type="text"
                      placeholder="Ej: Juegos mas populares, Monedas y Oro..."
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      hasError={
                        formik.touched.title && Boolean(formik.errors.title)
                      }
                    />
                  </Field>

                  {/* Descripcion */}
                  <Field
                    id="landing-description"
                    label="Descripcion o subtitulo"
                    error={
                      formik.touched.description
                        ? formik.errors.description
                        : undefined
                    }
                  >
                    <textarea
                      id="landing-description"
                      name="description"
                      rows={2}
                      placeholder="Ej: Explora los mejores articulos con entrega inmediata..."
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full rounded-md border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/50 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                    />
                  </Field>

                  {/* Cantidad de productos y Criterio de ordenamiento */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      id="landing-qt-products"
                      label="Cantidad de productos"
                      error={
                        formik.touched.qt_products_show
                          ? formik.errors.qt_products_show
                          : undefined
                      }
                    >
                      <FormInput
                        id="landing-qt-products"
                        name="qt_products_show"
                        type="number"
                        min={1}
                        max={50}
                        value={formik.values.qt_products_show}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        hasError={
                          formik.touched.qt_products_show &&
                          Boolean(formik.errors.qt_products_show)
                        }
                      />
                    </Field>

                    <Field
                      id="landing-sort-by"
                      label="Criterio de ordenamiento"
                      error={
                        formik.touched.sort_by
                          ? formik.errors.sort_by
                          : undefined
                      }
                    >
                      <select
                        id="landing-sort-by"
                        name="sort_by"
                        value={formik.values.sort_by}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                      >
                        {SORT_BY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {/* Posicion en orden y Estado Activo */}
                  <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
                    <Field
                      id="landing-order"
                      label="Posicion de orden (0, 1, 2...)"
                      error={
                        formik.touched.order ? formik.errors.order : undefined
                      }
                    >
                      <FormInput
                        id="landing-order"
                        name="order"
                        type="number"
                        min={0}
                        value={formik.values.order}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        hasError={
                          formik.touched.order && Boolean(formik.errors.order)
                        }
                      />
                    </Field>

                    <div className="flex flex-col gap-1.5 pt-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="show"
                          checked={formik.values.show}
                          onChange={formik.handleChange}
                          className="h-4 w-4 rounded border-white/20 bg-bg-primary text-neon-primary focus:ring-neon-primary"
                        />
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text-primary">
                          Visible en la landing
                        </span>
                      </label>
                      <p className="font-mono text-[10px] text-text-muted">
                        Si esta desmarcado, la seccion estara inactiva.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ─── Footer ─── */}
                <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-white/5 bg-bg-elevated/95 px-6 py-4 backdrop-blur-sm sm:flex-row sm:justify-end">
                  <CancelButton onClick={onClose} />
                  <FormSubmitButton
                    submitting={formik.isSubmitting}
                    isEdit={isEdit}
                    createLabel="Crear seccion"
                    editLabel="Guardar cambios"
                    loadingLabel="Guardando..."
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
