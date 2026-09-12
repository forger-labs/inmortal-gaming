"use client";

import { CloseIcon, ProductsIcon } from "@shared/icons";
import { cyberSuccess } from "@shared/toasts";
import type {
  CategoryEntity,
  ProductEntity,
  ServerEntity,
  SubcategoryEntity,
  SubProductEntity,
} from "@shared/types";
import { getR2ImageUrl } from "@shared/utils";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { EASE_OUT_EXPO } from "@/constants";

interface SubproductPreviewModalProps {
  open: boolean;
  subproduct?: SubProductEntity;
  products: ProductEntity[];
  subcategories: SubcategoryEntity[];
  servers: ServerEntity[];
  categories: CategoryEntity[];
  onClose: () => void;
}

export function SubproductPreviewModal({
  open,
  subproduct,
  products,
  subcategories,
  servers,
  categories,
  onClose,
}: SubproductPreviewModalProps) {
  const [imgError, setImgError] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  const product = useMemo(
    () => products.find((p) => p.id === subproduct?.product_id),
    [products, subproduct?.product_id],
  );

  const subcategory = useMemo(
    () => subcategories.find((s) => s.id === subproduct?.sub_category_id),
    [subcategories, subproduct?.sub_category_id],
  );

  const category = useMemo(() => {
    if (!subcategory) return null;
    return categories.find((c) => c.id === subcategory.category_id);
  }, [categories, subcategory]);

  const server = useMemo(
    () => servers.find((s) => s.id === subproduct?.server_id),
    [servers, subproduct?.server_id],
  );

  const imageUrl = subproduct ? getR2ImageUrl(subproduct.image) : "";

  // Enfoque y cierre con tecla Escape
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleCopyJson = () => {
    if (!subproduct?.product_data) return;
    navigator.clipboard.writeText(
      JSON.stringify(subproduct.product_data, null, 2),
    );
    cyberSuccess("Estructura JSON copiada al portapapeles.");
  };

  const productDataEntries = useMemo(() => {
    if (!subproduct?.product_data) return [];
    return Object.entries(subproduct.product_data);
  }, [subproduct?.product_data]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <motion.div
            key="subproduct-preview-backdrop"
            className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
        )}

        {open && subproduct && (
          <motion.div
            key="subproduct-preview-dialog"
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="subproduct-preview-title"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              className="relative my-8 w-full max-w-[760px] rounded-xl border border-neon-primary/30 bg-bg-elevated shadow-[0_0_60px_-12px_rgba(0,240,255,0.4)]"
            >
              {/* ─── Header ─── */}
              <header className="flex items-start justify-between gap-4 border-b border-white/5 px-6 py-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      data-text="CATALOGO :: SUBPRODUCTO"
                      className="glitch font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-neon-primary"
                    >
                      Catalogo :: Subproducto
                    </span>
                    <span className="font-mono text-xs text-text-muted">
                      #{String(subproduct.id).padStart(3, "0")}
                    </span>
                  </div>
                  <h2
                    id="subproduct-preview-title"
                    className="mt-1 font-display text-xl font-semibold text-text-primary"
                  >
                    {subproduct.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar vista previa"
                  className="rounded-md p-2 text-text-secondary transition-colors hover:text-neon-primary cursor-pointer"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </header>

              {/* ─── Body ─── */}
              <div className="flex flex-col gap-6 px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* ─── Tarjeta Superior: Imagen y Metadatos ─── */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 rounded-lg border border-white/10 bg-bg-surface/80 p-4">
                  <div className="relative aspect-video sm:col-span-5 w-full overflow-hidden rounded-lg border border-white/10 bg-bg-primary">
                    {imageUrl && !imgError ? (
                      <Image
                        src={imageUrl}
                        alt={`Imagen de ${subproduct.name}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 300px"
                        className="object-cover"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-text-muted">
                        <ProductsIcon className="h-12 w-12 opacity-40" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between sm:col-span-7 gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted">
                          Producto Padre
                        </span>
                        <span className="font-body text-sm font-medium text-text-primary">
                          {product?.name || `ID #${subproduct.product_id}`}
                        </span>
                      </div>

                      <div>
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted">
                          Subcategoria
                        </span>
                        <span className="font-body text-sm font-medium text-neon-purple">
                          {subcategory?.subcategory_name ||
                            `ID #${subproduct.sub_category_id}`}
                        </span>
                      </div>

                      <div>
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted">
                          Servidor
                        </span>
                        <span className="font-body text-sm font-medium text-text-secondary">
                          {server?.server_name || `ID #${subproduct.server_id}`}
                        </span>
                      </div>

                      <div>
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted">
                          Categoria General
                        </span>
                        <span className="font-body text-sm font-medium text-text-secondary">
                          {category?.category_name || "Sin categoria"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <div>
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted">
                          Precio
                        </span>
                        <span className="font-mono text-lg font-bold text-neon-primary">
                          ${subproduct.price.toLocaleString("es-MX")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs font-semibold ${
                            subproduct.is_active
                              ? "border border-neon-green/30 bg-neon-green/10 text-neon-green"
                              : "border border-white/10 bg-white/5 text-text-muted"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              subproduct.is_active
                                ? "bg-neon-green animate-pulse"
                                : "bg-text-muted"
                            }`}
                          />
                          {subproduct.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── Renderizado Dinamico de Product Data ─── */}
                <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-bg-surface/50 p-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neon-primary">
                      Especificaciones y Datos (Product Data)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowRawJson(!showRawJson)}
                      className="font-mono text-[11px] text-text-secondary hover:text-neon-primary transition-colors cursor-pointer"
                    >
                      {showRawJson ? "Ver render visual" : "Ver JSON crudo"}
                    </button>
                  </div>

                  {showRawJson ? (
                    <div className="relative rounded-md border border-white/5 bg-black/60 p-3">
                      <button
                        type="button"
                        onClick={handleCopyJson}
                        className="absolute right-3 top-3 rounded border border-white/10 bg-bg-surface px-2 py-1 font-mono text-[10px] text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary cursor-pointer"
                      >
                        Copiar JSON
                      </button>
                      <pre className="font-mono text-xs text-neon-green/90 overflow-x-auto whitespace-pre">
                        {JSON.stringify(subproduct.product_data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {productDataEntries.length === 0 ? (
                        <p className="font-body text-sm text-text-muted italic">
                          No hay campos dinamicos cargados en este subproducto.
                        </p>
                      ) : (
                        productDataEntries.map(([fieldName, rawValue]) => {
                          const val = rawValue as {
                            title?: string;
                            description?: string;
                            data?: string | string[];
                          };

                          const isArray = Array.isArray(val?.data);

                          return (
                            <div
                              key={fieldName}
                              className="flex flex-col gap-1.5 rounded-md border border-white/5 bg-bg-primary/50 p-3.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-display text-sm font-semibold text-text-primary">
                                  {val?.title || fieldName}
                                </span>
                                <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
                                  {fieldName}
                                </span>
                              </div>

                              {val?.description && (
                                <p className="font-body text-xs text-text-secondary">
                                  {val.description}
                                </p>
                              )}

                              <div className="mt-1">
                                {isArray ? (
                                  <ul className="flex flex-col gap-1 pl-4 list-disc font-body text-xs text-text-primary">
                                    {(val.data as string[]).map((item) => (
                                      <li
                                        key={`${fieldName}-${item}`}
                                        className="text-text-primary/90"
                                      >
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="font-body text-sm text-text-primary/90">
                                    {String(val?.data ?? "")}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ─── Footer ─── */}
              <footer className="flex items-center justify-end border-t border-white/5 px-6 py-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-white/10 bg-bg-surface px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:border-white/20 hover:text-text-primary cursor-pointer"
                >
                  Cerrar
                </button>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
