"use client";

import { DeleteIcon, PlusIcon } from "@shared/icons";
import type { JsonShapeArrayConfig } from "@shared/types";

interface SubproductArrayFieldProps {
  fieldKey: string;
  config?: JsonShapeArrayConfig | Record<string, unknown>;
  title: string;
  description: string;
  data: string[];
  onChange: (
    fieldKey: string,
    prop: "title" | "description",
    value: string,
  ) => void;
  onItemChange: (fieldKey: string, itemIndex: number, value: string) => void;
  onAddItem: (fieldKey: string) => void;
  onRemoveItem: (fieldKey: string, itemIndex: number) => void;
}

export function SubproductArrayField({
  fieldKey,
  config,
  title,
  description,
  data,
  onChange,
  onItemChange,
  onAddItem,
  onRemoveItem,
}: SubproductArrayFieldProps) {
  const titleInputId = `subproduct-pd-title-${fieldKey}`;
  const descInputId = `subproduct-pd-desc-${fieldKey}`;

  const isOrdered = Boolean(config?.ordered);
  const titleTag = (config?.title_tag as string) || "";
  const titleFontWeight = (config?.title_font_weight as string) || "";
  const dataWeight = (config?.data_weight as string) || "";

  const items = data.length > 0 ? data : [""];

  return (
    <div className="flex flex-col gap-3.5 rounded-lg border border-white/10 bg-bg-surface p-3.5 transition-all hover:border-white/20">
      {/* ─── Encabezado del campo ─── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
            {fieldKey}
          </span>
          <span className="rounded border border-neon-purple/30 bg-neon-purple/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-neon-purple">
            {isOrdered ? "Lista Ordenada / Array" : "Lista / Array"}
          </span>
        </div>

        {/* Metadatos y badges visuales */}
        <div className="flex flex-wrap items-center gap-1.5">
          {isOrdered && (
            <span className="rounded bg-neon-purple/20 px-1.5 py-0.5 font-mono text-[10px] text-neon-purple">
              ordered: true
            </span>
          )}
          {titleTag && (
            <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
              title: &lt;{titleTag}&gt;
            </span>
          )}
          {titleFontWeight && (
            <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
              w:{titleFontWeight}
            </span>
          )}
          {dataWeight && (
            <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
              data-w:{dataWeight}
            </span>
          )}
        </div>
      </div>

      {/* ─── Fila 1: Titulo y Descripcion ─── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Titulo */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={titleInputId}
            className="font-mono text-[11px] uppercase tracking-wider text-text-muted"
          >
            Titulo / Encabezado de seccion
          </label>
          <input
            id={titleInputId}
            name={titleInputId}
            type="text"
            value={title}
            onChange={(e) => onChange(fieldKey, "title", e.target.value)}
            placeholder={`ej. ${fieldKey}`}
            className="w-full rounded-md border border-white/10 bg-bg-primary px-3 py-2 font-body text-xs text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          />
        </div>

        {/* Descripcion */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={descInputId}
            className="font-mono text-[11px] uppercase tracking-wider text-text-muted"
          >
            Descripcion de la seccion
          </label>
          <input
            id={descInputId}
            name={descInputId}
            type="text"
            value={description}
            onChange={(e) => onChange(fieldKey, "description", e.target.value)}
            placeholder="ej. Caracteristicas y detalles incluidos"
            className="w-full rounded-md border border-white/10 bg-bg-primary px-3 py-2 font-body text-xs text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          />
        </div>
      </div>

      {/* ─── Fila 2: Lista Dinamica de Elementos (Array Data) ─── */}
      <div className="flex flex-col gap-2 rounded-md border border-white/5 bg-bg-primary/40 p-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
            Elementos de la lista ({items.length})
          </span>
          <button
            type="button"
            onClick={() => onAddItem(fieldKey)}
            aria-label={`Agregar elemento a ${fieldKey}`}
            className="inline-flex items-center gap-1.5 rounded border border-neon-primary/40 bg-neon-primary/10 px-2.5 py-1 font-mono text-[10px] font-semibold text-neon-primary transition-all hover:bg-neon-primary hover:text-bg-primary cursor-pointer active:scale-95"
          >
            <PlusIcon className="h-3 w-3" />
            <span>Agregar elemento</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {items.map((itemValue, itemIdx) => {
            const itemId = `array-item-${fieldKey}-${itemIdx}`;
            return (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: dynamic string array input list
                key={`${fieldKey}-item-${itemIdx}`}
                className="flex items-center gap-2"
              >
                <label
                  htmlFor={itemId}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-white/10 bg-bg-primary font-mono text-[11px] font-bold text-text-muted"
                >
                  {isOrdered ? `${itemIdx + 1}` : "•"}
                </label>
                <input
                  id={itemId}
                  name={itemId}
                  type="text"
                  value={itemValue}
                  onChange={(e) =>
                    onItemChange(fieldKey, itemIdx, e.target.value)
                  }
                  placeholder={`Elemento ${itemIdx + 1}`}
                  className="flex-1 rounded-md border border-white/10 bg-bg-primary px-3 py-1.5 font-body text-xs text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
                />
                <button
                  type="button"
                  disabled={items.length <= 1}
                  onClick={() => onRemoveItem(fieldKey, itemIdx)}
                  aria-label={`Eliminar elemento ${itemIdx + 1} de ${fieldKey}`}
                  className="rounded-md border border-white/10 p-1.5 text-text-muted transition-colors hover:border-neon-pink hover:text-neon-pink disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                >
                  <DeleteIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
