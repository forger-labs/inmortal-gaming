"use client";

import {
  ActivateIcon,
  DeactivateIcon,
  DeleteIcon,
  EditIcon,
  EyeIcon,
  ProductsIcon,
} from "@shared/icons";
import type { SubProductEntity } from "@shared/types";
import { getR2ImageUrl } from "@shared/utils";
import Image from "next/image";
import { useState } from "react";

interface SubproductCatalogCardProps {
  subproduct: SubProductEntity;
  productName: string;
  subcategoryName: string;
  serverNames: string[];
  onEdit: (subproduct: SubProductEntity) => void;
  onDelete: (subproduct: SubProductEntity) => void;
  onToggleStatus: (subproduct: SubProductEntity) => void;
  onPreview: (subproduct: SubProductEntity) => void;
}

export function SubproductCatalogCard({
  subproduct,
  productName,
  subcategoryName,
  serverNames,
  onEdit,
  onDelete,
  onToggleStatus,
  onPreview,
}: SubproductCatalogCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getR2ImageUrl(subproduct.image);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-bg-surface p-4 transition-all duration-200 hover:-translate-y-1 hover:border-neon-primary/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]">
      {/* ─── Imagen de Cabecera ─── */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/5 bg-bg-primary">
        {imageUrl && !imgError ? (
          <Image
            src={imageUrl}
            alt={subproduct.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ProductsIcon className="h-10 w-10 text-text-muted/40" />
          </div>
        )}

        {/* Badge ID flotante */}
        <div className="absolute left-2.5 top-2.5 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] font-semibold text-text-muted backdrop-blur-sm">
          #{String(subproduct.id).padStart(3, "0")}
        </div>

        {/* Badge de Estado flotante */}
        <div className="absolute right-2.5 top-2.5">
          <span
            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-semibold backdrop-blur-sm ${
              subproduct.is_active
                ? "border border-neon-green/40 bg-black/70 text-neon-green"
                : "border border-white/20 bg-black/70 text-text-muted"
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

      {/* ─── Informacion del Subproducto ─── */}
      <div className="mt-3.5 flex flex-1 flex-col">
        <h3 className="line-clamp-1 font-display text-base font-semibold text-text-primary group-hover:text-neon-primary transition-colors">
          {subproduct.name}
        </h3>

        {/* Badges de Relacion */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-text-secondary truncate max-w-[150px]">
            {productName}
          </span>
          <span className="inline-flex items-center rounded border border-neon-purple/30 bg-neon-purple/10 px-2 py-0.5 font-mono text-[11px] text-neon-purple truncate max-w-[150px]">
            {subcategoryName}
          </span>
          {serverNames.length > 0 && (
            <span className="inline-flex items-center rounded border border-neon-primary/20 bg-neon-primary/5 px-2 py-0.5 font-mono text-[11px] text-neon-primary/80 truncate max-w-[130px]">
              {serverNames.length === 1
                ? serverNames[0]
                : `${serverNames[0]} (+${serverNames.length - 1})`}
            </span>
          )}
        </div>

        {/* Precio y Botones de Accion */}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase text-text-muted">
              Precio
            </span>
            <span className="font-mono text-base font-bold text-neon-primary">
              ${subproduct.price.toLocaleString("es-MX")}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Toggle Activo */}
            <button
              type="button"
              onClick={() => onToggleStatus(subproduct)}
              aria-label={
                subproduct.is_active
                  ? "Desactivar subproducto"
                  : "Activar subproducto"
              }
              title={
                subproduct.is_active
                  ? "Desactivar subproducto"
                  : "Activar subproducto"
              }
              className={`rounded-sm border p-1.5 transition-colors cursor-pointer ${
                subproduct.is_active
                  ? "border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                  : "border-white/10 text-text-muted hover:border-neon-green hover:text-neon-green"
              }`}
            >
              {subproduct.is_active ? (
                <ActivateIcon className="h-4 w-4" />
              ) : (
                <DeactivateIcon className="h-4 w-4" />
              )}
            </button>

            {/* Vista Previa */}
            <button
              type="button"
              onClick={() => onPreview(subproduct)}
              aria-label={`Ver detalles de ${subproduct.name}`}
              title="Vista previa completa"
              className="rounded-sm border border-white/10 p-1.5 text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary active:scale-95 cursor-pointer"
            >
              <EyeIcon className="h-4 w-4" />
            </button>

            {/* Editar */}
            <button
              type="button"
              onClick={() => onEdit(subproduct)}
              aria-label={`Editar ${subproduct.name}`}
              title="Editar subproducto"
              className="rounded-sm border border-white/10 p-1.5 text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary active:scale-95 cursor-pointer"
            >
              <EditIcon className="h-4 w-4" />
            </button>

            {/* Eliminar */}
            <button
              type="button"
              onClick={() => onDelete(subproduct)}
              aria-label={`Eliminar ${subproduct.name}`}
              title="Eliminar subproducto"
              className="rounded-sm border border-white/10 p-1.5 text-text-muted transition-colors hover:border-neon-pink hover:text-neon-pink active:scale-95 cursor-pointer"
            >
              <DeleteIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
