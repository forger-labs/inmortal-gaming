"use client";

import { DeleteIcon, EditIcon, ProductsIcon } from "@shared/icons";
import type { ProductEntity } from "@shared/types";
import { getR2ImageUrl } from "@shared/utils";
import Image from "next/image";
import { useState } from "react";

interface ProductsRowProps {
  index: number;
  product: ProductEntity;
  categoryName: string;
  onEdit: (product: ProductEntity) => void;
  onDelete: (product: ProductEntity) => void;
}

export function ProductsRow({
  product,
  categoryName,
  onEdit,
  onDelete,
  index,
}: ProductsRowProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getR2ImageUrl(product.image);

  return (
    <tr
      key={product.id}
      style={{ "--i": index } as React.CSSProperties}
      className="row-in group border-b border-white/5 transition-colors hover:bg-bg-primary/70"
    >
      {/* ID */}
      <td className="px-6 py-3.5">
        <span className="font-mono text-xs font-semibold text-text-muted">
          #{String(product.id).padStart(3, "0")}
        </span>
      </td>

      {/* Producto (Imagen + Nombre + Descripcion) */}
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-bg-primary">
            {imageUrl && !imgError ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="40px"
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <ProductsIcon className="h-5 w-5 text-text-muted" />
            )}
          </div>
          <div className="flex flex-col min-w-0 max-w-xs sm:max-w-md">
            <span className="truncate font-body text-sm font-medium text-text-primary">
              {product.name}
            </span>
            <span className="truncate font-body text-xs text-text-secondary">
              {product.description || "Sin descripcion"}
            </span>
          </div>
        </div>
      </td>

      {/* Categoria */}
      <td className="px-6 py-3.5">
        <span className="inline-flex items-center rounded border border-neon-purple/30 bg-neon-purple/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-neon-purple">
          {categoryName || `Categoria #${product.category_id}`}
        </span>
      </td>

      {/* Estado */}
      <td className="px-6 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[11px] font-semibold ${
            product.is_active
              ? "border border-neon-green/30 bg-neon-green/10 text-neon-green"
              : "border border-white/10 bg-white/5 text-text-muted"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              product.is_active
                ? "bg-neon-green animate-pulse"
                : "bg-text-muted"
            }`}
          />
          {product.is_active ? "Activo" : "Inactivo"}
        </span>
      </td>

      {/* Acciones */}
      <td className="px-6 py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(product)}
            aria-label={`Editar producto ${product.name}`}
            className="rounded-sm border border-white/10 p-2 text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary active:scale-90 cursor-pointer"
          >
            <EditIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(product)}
            aria-label={`Eliminar producto ${product.name}`}
            className="rounded-sm border border-white/10 p-2 text-text-muted transition-colors hover:border-neon-pink hover:text-neon-pink active:scale-90 cursor-pointer"
          >
            <DeleteIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
