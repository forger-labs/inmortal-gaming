"use client";

import { cyberSuccess } from "@shared/toasts";
import type {
  JsonShapeArrayConfig,
  JsonShapeFieldConfig,
  JsonShapeMap,
  JsonShapeStringConfig,
  JsonShapeTag,
  SubProductDataMap,
} from "@shared/types";
import { createElement, useMemo, useState } from "react";

interface SubproductDynamicDataProps {
  productData?: SubProductDataMap | null;
  jsonShape?: JsonShapeMap | null;
}

const FONT_WEIGHT_CLASSES: Record<string, string> = {
  "400": "font-normal",
  "500": "font-medium",
  "600": "font-semibold",
  "700": "font-bold",
};

const TITLE_TAG_STYLES: Record<string, string> = {
  h1: "font-display text-xl text-text-primary",
  h2: "font-display text-lg text-text-primary",
  h3: "font-display text-base text-text-primary",
  h4: "font-display text-sm text-text-primary",
  h5: "font-display text-xs text-text-primary uppercase tracking-wider",
  h6: "font-display text-[11px] text-text-muted uppercase tracking-widest",
  span: "font-body text-sm text-text-primary",
  p: "font-body text-sm text-text-primary",
  paragraph: "font-body text-sm text-text-primary",
};

const DATA_TAG_STYLES: Record<string, string> = {
  h1: "font-display text-lg text-neon-primary",
  h2: "font-display text-base text-neon-primary",
  h3: "font-display text-sm text-text-primary",
  h4: "font-body text-sm text-text-primary",
  h5: "font-body text-xs text-text-secondary",
  h6: "font-body text-xs text-text-muted",
  span: "font-body text-sm text-text-secondary",
  p: "font-body text-sm text-text-secondary leading-relaxed",
  paragraph: "font-body text-sm text-text-secondary leading-relaxed",
};

function normalizeTag(tag?: JsonShapeTag): string {
  if (!tag) return "p";
  if (tag === "paragraph") return "p";
  return tag;
}

function getFontWeightClass(weight?: string): string {
  if (!weight) return "";
  return FONT_WEIGHT_CLASSES[weight] || "font-normal";
}

export function SubproductDynamicData({
  productData,
  jsonShape,
}: SubproductDynamicDataProps) {
  const [showRawJson, setShowRawJson] = useState(false);

  const entries = useMemo(() => {
    if (!productData) return [];
    return Object.entries(productData);
  }, [productData]);

  const handleCopyJson = () => {
    if (!productData) return;
    navigator.clipboard.writeText(JSON.stringify(productData, null, 2));
    cyberSuccess("Especificaciones JSON copiadas al portapapeles.");
  };

  if (!productData || entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border-subtle bg-bg-surface/50 p-8 text-center">
        <p className="font-mono text-xs text-text-muted">
          NO HAY ESPECIFICACIONES DINAMICAS DISPONIBLES PARA ESTE SUBPRODUCTO.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-border-subtle bg-bg-surface/70 p-5 backdrop-blur-sm">
      {/* Header bar */}
      <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-3">
        <div>
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-neon-primary">
            Especificaciones y Datos del Subproducto
          </h2>
          <p className="font-body text-[11px] text-text-muted">
            Configuracion dinamica generada segun el esquema de la subcategoria
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRawJson(!showRawJson)}
          className="rounded-md border border-border-subtle bg-bg-surface px-2.5 py-1 font-mono text-[11px] text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary"
        >
          {showRawJson ? "Ver diseño" : "Ver JSON"}
        </button>
      </div>

      {showRawJson ? (
        <div className="relative rounded-lg border border-white/10 bg-black/80 p-4">
          <button
            type="button"
            onClick={handleCopyJson}
            className="absolute right-3 top-3 rounded border border-white/10 bg-bg-surface px-2.5 py-1 font-mono text-[10px] text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary"
          >
            Copiar JSON
          </button>
          <pre className="overflow-x-auto font-mono text-xs text-neon-green/90 whitespace-pre">
            {JSON.stringify(productData, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {entries.map(([fieldKey, rawFieldValue], index) => {
            const fieldConfig = jsonShape?.[fieldKey] as
              | JsonShapeFieldConfig
              | undefined;

            const valueObj = rawFieldValue as {
              title?: string;
              description?: string;
              data?: string | string[];
            };

            const titleText = valueObj?.title || fieldKey;
            const descriptionText = valueObj?.description;
            const dataContent = valueObj?.data;

            // Extract tag configurations
            const titleTag = normalizeTag(fieldConfig?.title_tag || "h4");
            const titleWeight = getFontWeightClass(
              fieldConfig?.title_font_weight,
            );
            const titleClasses = `${TITLE_TAG_STYLES[titleTag] || TITLE_TAG_STYLES.h4} ${titleWeight}`;

            const isArray =
              (fieldConfig?.field_type === "array" ||
                Array.isArray(dataContent)) &&
              Array.isArray(dataContent);

            return (
              <div
                key={fieldKey}
                style={{ "--i": index } as React.CSSProperties}
                className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border-subtle bg-bg-surface p-4 transition-all duration-200 hover:border-neon-primary/40 hover:bg-bg-surface-hover"
              >
                {/* Subtle top indicator */}
                <div className="pointer-events-none absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-neon-primary/40 via-neon-purple/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div>
                  {/* Field Tag and Key */}
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-text-muted">
                      {fieldKey}
                    </span>
                    <span className="font-mono text-[10px] text-neon-purple/80">
                      {isArray ? "ARRAY" : "STRING"}
                    </span>
                  </div>

                  {/* Title dynamically rendered with title_tag & title_font_weight */}
                  <div className="mb-1.5">
                    {createElement(
                      titleTag,
                      { className: titleClasses },
                      titleText,
                    )}
                  </div>

                  {/* Description if present */}
                  {descriptionText && (
                    <p className="mb-2 font-body text-xs text-text-muted">
                      {descriptionText}
                    </p>
                  )}
                </div>

                {/* Data dynamically rendered */}
                <div className="mt-3 border-t border-border-subtle pt-3">
                  {isArray
                    ? (() => {
                        const arrayConfig = fieldConfig as
                          | JsonShapeArrayConfig
                          | undefined;
                        const isOrdered = Boolean(arrayConfig?.ordered);
                        const dataWeight = getFontWeightClass(
                          arrayConfig?.data_weight,
                        );
                        const ListTag = isOrdered ? "ol" : "ul";
                        const listStyleClass = isOrdered
                          ? "list-decimal pl-5"
                          : "list-disc pl-5";

                        return (
                          <ListTag
                            className={`space-y-1 font-body text-xs text-text-secondary ${listStyleClass} ${dataWeight}`}
                          >
                            {(dataContent as string[]).map((item) => (
                              <li
                                key={`${fieldKey}-${String(item)}`}
                                className="text-text-primary/90"
                              >
                                {item}
                              </li>
                            ))}
                          </ListTag>
                        );
                      })()
                    : (() => {
                        const stringConfig = fieldConfig as
                          | JsonShapeStringConfig
                          | undefined;
                        const dataTag = normalizeTag(stringConfig?.tag || "p");
                        const dataWeight = getFontWeightClass(
                          stringConfig?.data_weight,
                        );
                        const dataClasses = `${DATA_TAG_STYLES[dataTag] || DATA_TAG_STYLES.p} ${dataWeight}`;

                        return createElement(
                          dataTag,
                          { className: dataClasses },
                          String(dataContent ?? ""),
                        );
                      })()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
