"use client";

import type {
  JsonShapeArrayConfig,
  JsonShapeStringConfig,
  SubcategoryEntity,
} from "@shared/types";

import { SubproductArrayField } from "./SubproductArrayField";
import { SubproductStringField } from "./SubproductStringField";

interface SubproductDynamicFieldsProps {
  subcategory?: SubcategoryEntity;
  productData: Record<
    string,
    {
      title: string;
      description?: string;
      data: string | string[];
    }
  >;
  onChangeStringField: (
    fieldKey: string,
    prop: "title" | "data",
    value: string,
  ) => void;
  onChangeArrayField: (
    fieldKey: string,
    prop: "title" | "description",
    value: string,
  ) => void;
  onArrayItemChange: (
    fieldKey: string,
    itemIndex: number,
    value: string,
  ) => void;
  onAddArrayItem: (fieldKey: string) => void;
  onRemoveArrayItem: (fieldKey: string, itemIndex: number) => void;
}

export function SubproductDynamicFields({
  subcategory,
  productData,
  onChangeStringField,
  onChangeArrayField,
  onArrayItemChange,
  onAddArrayItem,
  onRemoveArrayItem,
}: SubproductDynamicFieldsProps) {
  const shapeEntries = Object.entries(subcategory?.json_shape || {});

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-bg-primary/60 p-4">
      {/* ─── Cabecera de la seccion dinamica ─── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
        <div>
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neon-primary">
            Especificaciones dinamicas (Product Data)
          </h3>
          <p className="mt-0.5 font-body text-xs text-text-muted">
            Campos del esquema segun subcategoria:{" "}
            <strong className="text-text-primary">
              {subcategory?.subcategory_name || "Ninguna seleccionada"}
            </strong>
          </p>
        </div>

        {shapeEntries.length > 0 && (
          <span className="font-mono text-[11px] text-text-secondary">
            {shapeEntries.length}{" "}
            {shapeEntries.length === 1
              ? "campo detectado"
              : "campos detectados"}
          </span>
        )}
      </div>

      {/* ─── Lista de campos o estado vacio ─── */}
      {shapeEntries.length === 0 ? (
        <div className="rounded-md border border-white/5 bg-bg-surface/50 p-4 text-center">
          <p className="font-body text-xs italic text-text-muted">
            {subcategory
              ? "Esta subcategoria no tiene configurado un json_shape de atributos."
              : "Selecciona una subcategoria para cargar sus atributos y especificaciones dinamicas."}
          </p>
        </div>
      ) : (
        <div className="mt-1 flex flex-col gap-4">
          {shapeEntries.map(([fieldKey, configRaw]) => {
            const isArray =
              typeof configRaw === "object" && configRaw !== null
                ? (configRaw as JsonShapeArrayConfig).field_type === "array"
                : String(configRaw).includes("array");

            const current = productData[fieldKey];

            if (isArray) {
              const arrayConfig =
                typeof configRaw === "object" && configRaw !== null
                  ? (configRaw as JsonShapeArrayConfig)
                  : undefined;

              const titleVal = current?.title ?? fieldKey;
              const descVal = current?.description ?? "";
              const dataVal = Array.isArray(current?.data)
                ? current.data
                : typeof current?.data === "string" && current.data
                  ? [current.data]
                  : [""];

              return (
                <SubproductArrayField
                  key={fieldKey}
                  fieldKey={fieldKey}
                  config={arrayConfig}
                  title={titleVal}
                  description={descVal}
                  data={dataVal}
                  onChange={onChangeArrayField}
                  onItemChange={onArrayItemChange}
                  onAddItem={onAddArrayItem}
                  onRemoveItem={onRemoveArrayItem}
                />
              );
            }

            const stringConfig =
              typeof configRaw === "object" && configRaw !== null
                ? (configRaw as JsonShapeStringConfig)
                : undefined;

            const titleVal = current?.title ?? fieldKey;
            const dataVal =
              typeof current?.data === "string"
                ? current.data
                : Array.isArray(current?.data)
                  ? current.data.join(", ")
                  : "";

            return (
              <SubproductStringField
                key={fieldKey}
                fieldKey={fieldKey}
                config={stringConfig}
                title={titleVal}
                data={dataVal}
                onChange={onChangeStringField}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
