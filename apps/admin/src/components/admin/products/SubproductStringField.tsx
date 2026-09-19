"use client";

import type { JsonShapeStringConfig } from "@shared/types";

interface SubproductStringFieldProps {
  fieldKey: string;
  config?: JsonShapeStringConfig | Record<string, unknown>;
  title: string;
  data: string;
  onChange: (fieldKey: string, prop: "title" | "data", value: string) => void;
}

export function SubproductStringField({
  fieldKey,
  config,
  title,
  data,
  onChange,
}: SubproductStringFieldProps) {
  const titleInputId = `subproduct-pd-title-${fieldKey}`;
  const dataInputId = `subproduct-pd-data-${fieldKey}`;

  const titleTag = (config?.title_tag as string) || "";
  const dataTag = (config?.tag as string) || "";
  const titleFontWeight = (config?.title_font_weight as string) || "";
  const dataWeight = (config?.data_weight as string) || "";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-bg-surface p-3.5 transition-all hover:border-white/20">
      {/* ─── Encabezado del campo ─── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
            {fieldKey}
          </span>
          <span className="rounded border border-neon-cyan/30 bg-neon-cyan/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-neon-cyan">
            Texto / String
          </span>
        </div>

        {/* Metadatos y badges visuales del esquema */}
        <div className="flex flex-wrap items-center gap-1.5">
          {titleTag && (
            <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
              title: &lt;{titleTag}&gt;
            </span>
          )}
          {dataTag && (
            <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
              tag: &lt;{dataTag}&gt;
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

      {/* ─── Inputs de Titulo y Data ─── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Titulo */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={titleInputId}
            className="font-mono text-[11px] uppercase tracking-wider text-text-muted"
          >
            Titulo / Etiqueta visible
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

        {/* Data */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={dataInputId}
            className="font-mono text-[11px] uppercase tracking-wider text-text-muted"
          >
            Contenido / Valor
          </label>
          <input
            id={dataInputId}
            name={dataInputId}
            type="text"
            value={data}
            onChange={(e) => onChange(fieldKey, "data", e.target.value)}
            placeholder="ej. LGA 1700, 32GB, 750W..."
            className="w-full rounded-md border border-white/10 bg-bg-primary px-3 py-2 font-body text-xs text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          />
        </div>
      </div>
    </div>
  );
}
