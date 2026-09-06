"use client";

import { DeleteIcon, EditIcon, ProductsIcon } from "@shared/icons";
import type { ProductEntity } from "@shared/types";
import { getR2ImageUrl } from "@shared/utils";
import Image from "next/image";
import { useState } from "react";

interface ProductCatalogCardProps {
  product: ProductEntity;
  categoryName: string;
  onEdit: (product: ProductEntity) => void;
  onDelete: (product: ProductEntity) => void;
}

export function ProductCatalogCard({
  product,
  categoryName,
  onEdit,
  onDelete,
}: ProductCatalogCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getR2ImageUrl(product.image);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-bg-surface p-4 transition-all duration-200 hover:-translate-y-1 hover:border-neon-primary/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]">
      {/* ─── Imagen de Cabecera ─── */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/5 bg-bg-primary">
        {imageUrl && !imgError ? (
          <Image
            src={imageUrl}
            alt={product.name}
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
          #{String(product.id).padStart(3, "0")}
        </div>

        {/* Badge de Estado flotante */}
        <div className="absolute right-2.5 top-2.5">
          <span
            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-semibold backdrop-blur-sm ${
              product.is_active
                ? "border border-neon-green/40 bg-black/70 text-neon-green"
                : "border border-white/20 bg-black/70 text-text-muted"
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
        </div>
      </div>

      {/* ─── Informacion del Producto ─── */}
      <div className="mt-3.5 flex flex-1 flex-col">
        {/* Categoria */}
        <div className="mb-1.5">
          <span className="inline-flex items-center rounded border border-neon-purple/30 bg-neon-purple/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-neon-purple">
            {categoryName || `Categoria #${product.category_id}`}
          </span>
        </div>

        {/* Titulo */}
        <h3 className="font-display text-base font-semibold text-text-primary group-hover:text-neon-primary transition-colors">
          {product.name}
        </h3>

        {/* Descripcion */}
        <p className="mt-1 line-clamp-2 font-body text-xs leading-relaxed text-text-secondary">
          {product.description || "Sin descripcion disponible"}
        </p>

        {/* ─── Footer: Acciones ─── */}
        <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-white/5 pt-3">
          <button
            type="button"
            onClick={() => onEdit(product)}
            aria-label={`Editar producto ${product.name}`}
            className="flex items-center gap-1 rounded-sm border border-white/10 px-2.5 py-1.5 font-mono text-xs text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary active:scale-95 cursor-pointer"
          >
            <EditIcon className="h-3.5 w-3.5" />
            <span>Editar</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(product)}
            aria-label={`Eliminar producto ${product.name}`}
            className="flex items-center gap-1 rounded-sm border border-white/10 px-2.5 py-1.5 font-mono text-xs text-text-muted transition-colors hover:border-neon-pink hover:text-neon-pink active:scale-95 cursor-pointer"
          >
            <DeleteIcon className="h-3.5 w-3.5" />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
