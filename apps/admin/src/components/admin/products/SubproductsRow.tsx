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

interface SubproductsRowProps {
  index: number;
  subproduct: SubProductEntity;
  productName: string;
  subcategoryName: string;
  serverNames: string[];
  onEdit: (subproduct: SubProductEntity) => void;
  onDelete: (subproduct: SubProductEntity) => void;
  onToggleStatus: (subproduct: SubProductEntity) => void;
  onPreview: (subproduct: SubProductEntity) => void;
}

export function SubproductsRow({
  index,
  subproduct,
  productName,
  subcategoryName,
  serverNames,
  onEdit,
  onDelete,
  onToggleStatus,
  onPreview,
}: SubproductsRowProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getR2ImageUrl(subproduct.image);

  return (
    <tr
      style={{ "--i": index } as React.CSSProperties}
      className="row-in group border-b border-white/5 transition-colors hover:bg-bg-primary/70"
    >
      {/* ID */}
      <td className="px-6 py-3.5">
        <span className="font-mono text-xs font-semibold text-text-muted">
          #{String(subproduct.id).padStart(3, "0")}
        </span>
      </td>

      {/* Imagen + Nombre */}
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-white/10 bg-bg-primary">
            {imageUrl && !imgError ? (
              <Image
                src={imageUrl}
                alt={subproduct.name}
                fill
                sizes="40px"
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-text-muted">
                <ProductsIcon className="h-5 w-5 opacity-40" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-body text-sm font-medium text-text-primary group-hover:text-neon-primary transition-colors">
              {subproduct.name}
            </span>
          </div>
        </div>
      </td>

      {/* Producto */}
      <td className="px-6 py-3.5">
        <span className="inline-flex items-center rounded border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-xs text-text-secondary">
          {productName || `Producto #${subproduct.product_id}`}
        </span>
      </td>

      {/* Subcategoria */}
      <td className="px-6 py-3.5">
        <span className="inline-flex items-center rounded border border-neon-purple/30 bg-neon-purple/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-neon-purple">
          {subcategoryName || `Subcat #${subproduct.sub_category_id}`}
        </span>
      </td>

      {/* Servidores */}
      <td className="px-6 py-3.5">
        <div className="flex flex-wrap items-center gap-1 max-w-[200px]">
          {serverNames.length === 0 ? (
            <span className="font-mono text-xs text-text-muted">
              Sin servidor
            </span>
          ) : (
            serverNames.slice(0, 2).map((srvName) => (
              <span
                key={srvName}
                className="inline-flex items-center rounded border border-neon-primary/20 bg-neon-primary/5 px-2 py-0.5 font-mono text-[11px] text-neon-primary/90 truncate max-w-[120px]"
              >
                {srvName}
              </span>
            ))
          )}
          {serverNames.length > 2 && (
            <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
              +{serverNames.length - 2}
            </span>
          )}
        </div>
      </td>

      {/* Precio */}
      <td className="px-6 py-3.5">
        <span className="font-mono text-sm font-bold text-neon-primary">
          ${subproduct.price.toLocaleString("es-MX")}
        </span>
      </td>

      {/* Estado (Boton Toggle) */}
      <td className="px-6 py-3.5">
        <button
          type="button"
          onClick={() => onToggleStatus(subproduct)}
          aria-label={
            subproduct.is_active
              ? "Desactivar subproducto"
              : "Activar subproducto"
          }
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
            subproduct.is_active
              ? "border border-neon-green/30 bg-neon-green/10 text-neon-green hover:bg-neon-green/20"
              : "border border-white/10 bg-white/5 text-text-muted hover:border-white/20 hover:text-text-primary"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              subproduct.is_active
                ? "bg-neon-green animate-pulse"
                : "bg-text-muted"
            }`}
          />
          <span>{subproduct.is_active ? "Activo" : "Inactivo"}</span>
        </button>
      </td>

      {/* Acciones */}
      <td className="px-6 py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          {/* Toggle de activacion rapida */}
          <button
            type="button"
            onClick={() => onToggleStatus(subproduct)}
            aria-label={
              subproduct.is_active
                ? `Desactivar ${subproduct.name}`
                : `Activar ${subproduct.name}`
            }
            title={subproduct.is_active ? "Desactivar" : "Activar"}
            className={`rounded-sm border p-2 transition-colors cursor-pointer ${
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

          {/* Vista previa */}
          <button
            type="button"
            onClick={() => onPreview(subproduct)}
            aria-label={`Ver vista previa de ${subproduct.name}`}
            title="Vista previa completa"
            className="rounded-sm border border-white/10 p-2 text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary active:scale-90 cursor-pointer"
          >
            <EyeIcon className="h-4 w-4" />
          </button>

          {/* Editar */}
          <button
            type="button"
            onClick={() => onEdit(subproduct)}
            aria-label={`Editar subproducto ${subproduct.name}`}
            title="Editar subproducto"
            className="rounded-sm border border-white/10 p-2 text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary active:scale-90 cursor-pointer"
          >
            <EditIcon className="h-4 w-4" />
          </button>

          {/* Eliminar */}
          <button
            type="button"
            onClick={() => onDelete(subproduct)}
            aria-label={`Eliminar subproducto ${subproduct.name}`}
            title="Eliminar subproducto"
            className="rounded-sm border border-white/10 p-2 text-text-muted transition-colors hover:border-neon-pink hover:text-neon-pink active:scale-90 cursor-pointer"
          >
            <DeleteIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
