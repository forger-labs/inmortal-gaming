"use client";

import { BoltIcon, CloseIcon, ServerIcon, UploadIcon } from "@shared/icons";
import type {
  ItemPriceEntity,
  JsonShapeArrayConfig,
  JsonShapeMap,
  ProductEntity,
  ServerEntity,
  ServerPriceItem,
  SubcategoryEntity,
  SubProductDataMap,
  SubProductEntity,
  SubProductFormValues,
  SubProductServerPriceFormValue,
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
import { adminApi } from "@/libs/adminApi";
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
  const [bulkPrice, setBulkPrice] = useState<string>("");
  const [loadingPrices, setLoadingPrices] = useState(false);

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

  // Esquema de validacion Yup: validacion de precios por servidor
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
        server_prices: yup
          .array()
          .of(
            yup.object({
              server_id: yup.number().required(),
              price: yup
                .mixed()
                .test(
                  "price-valid",
                  "El precio debe ser un numero mayor o igual a 0",
                  (val) =>
                    val !== "" &&
                    val !== undefined &&
                    val !== null &&
                    !Number.isNaN(Number(val)) &&
                    Number(val) >= 0,
                )
                .required("Ingresa el precio"),
              is_active: yup.boolean().required(),
            }),
          )
          .min(1, "Selecciona al menos un servidor con su precio")
          .required("Selecciona al menos un servidor"),
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

  // Servidores filtrados según el producto seleccionado
  const initialProductId = subproduct?.product_id ?? products[0]?.id ?? "";

  const formik = useFormik<SubProductFormValues>({
    initialValues: {
      name: subproduct?.name ?? "",
      product_id: initialProductId,
      sub_category_id:
        subproduct?.sub_category_id ?? subcategories[0]?.id ?? "",
      server_prices: [],
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

  // Servidores disponibles para el producto padre seleccionado
  const relevantServers = useMemo(() => {
    if (!formik.values.product_id) return servers;
    const matching = servers.filter(
      (s) => s.product_id === formik.values.product_id,
    );
    return matching.length > 0 ? matching : servers;
  }, [servers, formik.values.product_id]);

  const { setFieldValue } = formik;
  const currentServerPricesLength = formik.values.server_prices.length;

  // Cargar precios existentes en modo edicion o inicializar en modo creacion
  useEffect(() => {
    if (!open) return;

    let isMounted = true;

    async function loadPrices() {
      if (isEdit && subproduct?.id) {
        setLoadingPrices(true);
        try {
          const pricesRes = await adminApi.getItemPrices(1, 100, {
            sub_product_id: subproduct.id,
          });
          if (!isMounted) return;
          const items = pricesRes.items || [];
          if (items.length > 0) {
            const mapped: SubProductServerPriceFormValue[] = items.map(
              (ip) => ({
                server_id: ip.server_id,
                price: ip.price,
                is_active: ip.is_active,
              }),
            );
            setFieldValue("server_prices", mapped);
            return;
          }
        } catch {
          // Silencioso fallback
        } finally {
          if (isMounted) setLoadingPrices(false);
        }

        // Fallback si subproduct ya tenia prices en memoria
        if (subproduct.prices && subproduct.prices.length > 0) {
          const mapped: SubProductServerPriceFormValue[] =
            subproduct.prices.map((p: ItemPriceEntity | ServerPriceItem) => ({
              server_id: p.server_id,
              price: p.price ?? 0,
              is_active: p.is_active ?? true,
            }));
          setFieldValue("server_prices", mapped);
          return;
        }

        // Fallback si subproduct tenia server_ids o un precio singular
        if (subproduct.server_ids && subproduct.server_ids.length > 0) {
          const defaultPrice = subproduct.price ?? 0;
          const mapped: SubProductServerPriceFormValue[] =
            subproduct.server_ids.map((srvId) => ({
              server_id: srvId,
              price: defaultPrice,
              is_active: true,
            }));
          setFieldValue("server_prices", mapped);
          return;
        }
      } else if (!isEdit) {
        // Modo creacion: asignar el primer servidor por defecto si existe
        if (relevantServers.length > 0 && currentServerPricesLength === 0) {
          setFieldValue("server_prices", [
            {
              server_id: relevantServers[0].id,
              price: "",
              is_active: true,
            },
          ]);
        }
      }
    }

    loadPrices();

    return () => {
      isMounted = false;
    };
  }, [
    open,
    isEdit,
    subproduct,
    relevantServers,
    setFieldValue,
    currentServerPricesLength,
  ]);

  // Manejo de seleccion/deseleccion de servidor
  const handleToggleServer = (serverId: number) => {
    const currentPrices = [...(formik.values.server_prices || [])];
    const index = currentPrices.findIndex((p) => p.server_id === serverId);

    if (index >= 0) {
      // Remover servidor
      const filtered = currentPrices.filter((p) => p.server_id !== serverId);
      formik.setFieldValue("server_prices", filtered);
    } else {
      // Agregar servidor con precio por defecto o vacio
      const initialPrice = bulkPrice !== "" ? Number(bulkPrice) : "";
      formik.setFieldValue("server_prices", [
        ...currentPrices,
        {
          server_id: serverId,
          price: initialPrice,
          is_active: true,
        },
      ]);
    }
  };

  // Manejo de cambio de precio especifico de un servidor
  const handleServerPriceChange = (serverId: number, value: string) => {
    const currentPrices = [...(formik.values.server_prices || [])];
    const index = currentPrices.findIndex((p) => p.server_id === serverId);

    if (index >= 0) {
      currentPrices[index] = {
        ...currentPrices[index],
        price: value === "" ? "" : Number(value),
      };
      formik.setFieldValue("server_prices", currentPrices);
    } else {
      formik.setFieldValue("server_prices", [
        ...currentPrices,
        {
          server_id: serverId,
          price: value === "" ? "" : Number(value),
          is_active: true,
        },
      ]);
    }
  };

  // Manejo de toggle de estado activo del precio de un servidor
  const handleServerActiveToggle = (serverId: number) => {
    const currentPrices = [...(formik.values.server_prices || [])];
    const index = currentPrices.findIndex((p) => p.server_id === serverId);

    if (index >= 0) {
      currentPrices[index] = {
        ...currentPrices[index],
        is_active: !currentPrices[index].is_active,
      };
      formik.setFieldValue("server_prices", currentPrices);
    }
  };

  // Seleccionar todos los servidores relevantes
  const handleSelectAllServers = () => {
    const defaultPriceVal = bulkPrice !== "" ? Number(bulkPrice) : "";
    const currentMap = new Map(
      (formik.values.server_prices || []).map((p) => [p.server_id, p]),
    );

    const nextPrices: SubProductServerPriceFormValue[] = relevantServers.map(
      (s) => {
        const existing = currentMap.get(s.id);
        return {
          server_id: s.id,
          price:
            existing?.price !== undefined ? existing.price : defaultPriceVal,
          is_active: existing?.is_active ?? true,
        };
      },
    );

    formik.setFieldValue("server_prices", nextPrices);
  };

  // Limpiar todos los servidores
  const handleClearServers = () => {
    formik.setFieldValue("server_prices", []);
  };

  // Aplicar precio uniforme a todos los servidores seleccionados
  const handleApplyBulkPrice = () => {
    if (bulkPrice === "" || Number.isNaN(Number(bulkPrice))) return;
    const numPrice = Number(bulkPrice);
    const updated = (formik.values.server_prices || []).map((sp) => ({
      ...sp,
      price: numPrice,
    }));
    formik.setFieldValue("server_prices", updated);
  };

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

  // Resumen dinamico de precios calculados
  const priceSummary = useMemo(() => {
    const activePrices = (formik.values.server_prices || [])
      .filter((sp) => sp.price !== "" && !Number.isNaN(Number(sp.price)))
      .map((sp) => Number(sp.price));

    if (activePrices.length === 0) {
      return { text: "Sin precios configurados", isRange: false, count: 0 };
    }

    const min = Math.min(...activePrices);
    const max = Math.max(...activePrices);

    if (min === max) {
      return {
        text: `$${min.toLocaleString("es-MX")} USD`,
        isRange: false,
        count: activePrices.length,
      };
    }

    return {
      text: `$${min.toLocaleString("es-MX")} - $${max.toLocaleString("es-MX")} USD`,
      isRange: true,
      count: activePrices.length,
    };
  }, [formik.values.server_prices]);

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

  const serverPricesMap = useMemo(() => {
    const map = new Map<number, SubProductServerPriceFormValue>();
    for (const sp of formik.values.server_prices || []) {
      map.set(sp.server_id, sp);
    }
    return map;
  }, [formik.values.server_prices]);

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
              className="relative my-8 w-full max-w-[840px] rounded-xl border border-neon-primary/30 bg-bg-elevated shadow-[0_0_60px_-12px_rgba(0,240,255,0.4)]"
            >
              {/* ─── Header ─── */}
              <header className="flex items-center justify-between border-b border-white/5 px-6 py-5">
                <div>
                  <span
                    data-text={
                      isEdit
                        ? "GESTION :: EDITAR SUBPRODUCTO"
                        : "GESTION :: NUEVO SUBPRODUCTO"
                    }
                    className="glitch font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-neon-primary"
                  >
                    {isEdit
                      ? "Gestion :: Editar subproducto"
                      : "Gestion :: Nuevo subproducto"}
                  </span>
                  <h2
                    id="subproduct-form-title"
                    className="mt-1 font-display text-xl font-semibold text-text-primary"
                  >
                    {isEdit
                      ? `Editar subproducto #${subproduct?.id}`
                      : "Crear nuevo subproducto"}
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
                {/* ─── Fila 1: Nombre del Subproducto ─── */}
                <div className="grid grid-cols-1 gap-4">
                  <Field
                    id="subproduct-form-name"
                    label="Nombre del subproducto"
                    error={formik.touched.name ? formik.errors.name : undefined}
                  >
                    <FormInput
                      id="subproduct-form-name"
                      ref={nameInputRef}
                      name="name"
                      type="text"
                      placeholder="ej. Paquete 1000 Diamantes / Rango VIP"
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

                {/* ─── Fila 2: Relaciones (Producto Padre, Subcategoria) ─── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      onChange={(e) => {
                        const nextProdId =
                          e.target.value === "" ? "" : Number(e.target.value);
                        formik.setFieldValue("product_id", nextProdId);
                      }}
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
                </div>

                {/* ─── Fila 3: Precios por Servidor (Tarifas Dinamicas) ─── */}
                <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-bg-surface p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <ServerIcon className="h-4 w-4 text-neon-primary" />
                      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text-primary">
                        Precios por Servidor (
                        {formik.values.server_prices?.length || 0} configurados)
                      </span>
                    </div>

                    {/* Resumen Dinamico del Precio */}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-text-muted">
                        Resumen:
                      </span>
                      <span className="inline-flex items-center rounded border border-neon-primary/30 bg-neon-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-neon-primary shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                        {priceSummary.text}
                      </span>
                    </div>
                  </div>

                  {/* Acciones rapidas y aplicacion masiva de precios */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllServers}
                        className="text-neon-primary transition-colors hover:underline cursor-pointer"
                      >
                        Seleccionar todos
                      </button>
                      <span className="text-text-muted">|</span>
                      <button
                        type="button"
                        onClick={handleClearServers}
                        className="text-text-muted transition-colors hover:text-neon-pink cursor-pointer"
                      >
                        Limpiar seleccion
                      </button>
                    </div>

                    {/* Helper: Aplicar precio masivo */}
                    <div className="flex items-center gap-1.5">
                      <label
                        htmlFor="subproduct-form-bulk-price"
                        className="sr-only"
                      >
                        Precio para todos los servidores
                      </label>
                      <input
                        id="subproduct-form-bulk-price"
                        name="subproduct-form-bulk-price"
                        type="number"
                        min="0"
                        placeholder="Precio $ USD"
                        value={bulkPrice}
                        onChange={(e) => setBulkPrice(e.target.value)}
                        className="w-28 rounded border border-white/10 bg-bg-primary px-2 py-1 font-mono text-xs text-text-primary focus:border-neon-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyBulkPrice}
                        disabled={bulkPrice === ""}
                        className="inline-flex items-center gap-1 rounded border border-neon-primary/40 bg-neon-primary/10 px-2.5 py-1 font-mono text-xs font-semibold text-neon-primary transition-all hover:bg-neon-primary/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <BoltIcon className="h-3 w-3" />
                        <span>Aplicar a seleccionados</span>
                      </button>
                    </div>
                  </div>

                  {/* Lista de servidores con input de precio individual */}
                  {loadingPrices ? (
                    <div className="py-4 text-center font-mono text-xs text-text-muted animate-pulse">
                      Cargando tarifas de servidores...
                    </div>
                  ) : relevantServers.length === 0 ? (
                    <span className="font-mono text-xs text-text-muted italic py-3">
                      No hay servidores registrados para este producto padre.
                    </span>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5 pt-2 max-h-60 overflow-y-auto pr-1">
                      {relevantServers.map((server) => {
                        const configured = serverPricesMap.get(server.id);
                        const isSelected = Boolean(configured);

                        return (
                          <div
                            key={server.id}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-3 transition-all ${
                              isSelected
                                ? "border-neon-primary/40 bg-neon-primary/5 shadow-[0_0_12px_rgba(0,240,255,0.08)]"
                                : "border-white/5 bg-bg-primary/40 opacity-70 hover:opacity-100"
                            }`}
                          >
                            {/* Checkbox selector + Nombre del servidor */}
                            <div className="flex items-center gap-2.5">
                              <label
                                htmlFor={`server-toggle-${server.id}`}
                                className="inline-flex items-center gap-2 cursor-pointer"
                              >
                                <input
                                  id={`server-toggle-${server.id}`}
                                  name={`server-toggle-${server.id}`}
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleServer(server.id)}
                                  className="h-4 w-4 rounded border-white/20 bg-bg-primary text-neon-primary focus:ring-neon-primary cursor-pointer"
                                />
                                <span className="font-display text-sm font-semibold text-text-primary">
                                  {server.server_name}
                                </span>
                              </label>
                              <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
                                ID #{server.id}
                              </span>
                            </div>

                            {/* Controles de Precio y Estado por Servidor */}
                            {isSelected && (
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                  <label
                                    htmlFor={`server-price-${server.id}`}
                                    className="font-mono text-[11px] text-text-secondary whitespace-nowrap"
                                  >
                                    Precio ($ USD):
                                  </label>
                                  <input
                                    id={`server-price-${server.id}`}
                                    name={`server-price-${server.id}`}
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="0"
                                    value={configured?.price ?? ""}
                                    onChange={(e) =>
                                      handleServerPriceChange(
                                        server.id,
                                        e.target.value,
                                      )
                                    }
                                    className="w-24 rounded border border-white/15 bg-bg-primary px-2.5 py-1 font-mono text-xs font-bold text-neon-primary focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                                  />
                                </div>

                                <label
                                  htmlFor={`server-active-${server.id}`}
                                  className="inline-flex items-center gap-1.5 font-mono text-[11px] text-text-muted cursor-pointer"
                                  title="Disponibilidad en este servidor"
                                >
                                  <input
                                    id={`server-active-${server.id}`}
                                    name={`server-active-${server.id}`}
                                    type="checkbox"
                                    checked={configured?.is_active ?? true}
                                    onChange={() =>
                                      handleServerActiveToggle(server.id)
                                    }
                                    className="h-3.5 w-3.5 rounded border-white/20 bg-bg-primary text-neon-green focus:ring-neon-green cursor-pointer"
                                  />
                                  <span>Activo</span>
                                </label>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {formik.touched.server_prices &&
                    formik.errors.server_prices && (
                      <span className="font-mono text-xs text-neon-pink mt-1">
                        {typeof formik.errors.server_prices === "string"
                          ? formik.errors.server_prices
                          : "Configura al menos un servidor con un precio valido"}
                      </span>
                    )}
                </div>

                {/* ─── Fila 4: Imagen y Estado General en Tienda ─── */}
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

                  {/* Toggle Activo General */}
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
