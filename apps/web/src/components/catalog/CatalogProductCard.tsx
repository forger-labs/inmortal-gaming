"use client";

import { ChevronRightIcon, ProductsIcon } from "@shared/icons";
import type { ProductEntity } from "@shared/types";
import { getR2ImageUrl } from "@shared/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ROUTES } from "@/constants";

interface CatalogProductCardProps {
  product: ProductEntity;
}

export function CatalogProductCard({ product }: CatalogProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getR2ImageUrl(product.image);

  return (
    <Link
      href={ROUTES.product(product.id)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-neon-primary hover:shadow-[0_12px_36px_rgba(0,240,255,0.2)]"
    >
      {/* Top Image Container with generous height */}
      <div className="relative h-52 w-full overflow-hidden bg-bg-surface-hover border-b border-border-subtle">
        {imageUrl && !imgError ? (
          <Image
            src={imageUrl}
            alt={`Imagen de ${product.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgError(true)}
            className="object-cover transition-transform duration-700 group-hover:scale-108 group-hover:brightness-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-bg-surface-hover to-bg-primary text-text-muted">
            <ProductsIcon className="h-12 w-12 opacity-30 group-hover:text-neon-primary group-hover:opacity-80 transition-all" />
          </div>
        )}

        {/* Cyberpunk Scanline / Cyan Tint */}
        <div className="pointer-events-none absolute inset-0 bg-neon-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-surface/80 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute right-3 top-3 z-10">
          <span
            className={`rounded-md border px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${
              product.is_active
                ? "border-neon-green/40 bg-neon-green/15 text-neon-green"
                : "border-border-subtle bg-bg-surface text-text-muted"
            }`}
          >
            {product.is_active ? "Disponible" : "Inactivo"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <h3 className="font-display text-xl font-bold tracking-tight text-text-primary group-hover:text-neon-primary transition-colors">
            {product.name}
          </h3>

          <p className="mt-2 line-clamp-2 font-body text-sm leading-relaxed text-text-secondary">
            {product.description || "Sin descripción disponible."}
          </p>
        </div>

        {/* Footer Link */}
        <div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-3.5 font-mono text-xs font-semibold text-text-secondary group-hover:text-neon-primary transition-colors">
          <span>Ver servidores y opciones</span>
          <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
