"use client";

import { ChevronRightIcon, ProductsIcon } from "@shared/icons";
import type { SubProductEntity } from "@shared/types";
import { getR2ImageUrl } from "@shared/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ROUTES } from "@/constants";

interface CatalogSubProductCardProps {
  subproduct: SubProductEntity;
}

export function CatalogSubProductCard({
  subproduct,
}: CatalogSubProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getR2ImageUrl(subproduct.image);

  // Determine display price if available
  const hasPrice =
    subproduct.price !== undefined &&
    subproduct.price !== null &&
    subproduct.price > 0;

  return (
    <Link
      href={ROUTES.subproduct(subproduct.id)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-neon-primary hover:shadow-[0_12px_36px_rgba(0,240,255,0.2)]"
    >
      {/* Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-bg-surface-hover border-b border-border-subtle">
        {imageUrl && !imgError ? (
          <Image
            src={imageUrl}
            alt={`Imagen de ${subproduct.name}`}
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
              subproduct.is_active
                ? "border-neon-green/40 bg-neon-green/15 text-neon-green"
                : "border-border-subtle bg-bg-surface text-text-muted"
            }`}
          >
            {subproduct.is_active ? "Disponible" : "Inactivo"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <h3 className="font-display text-xl font-bold tracking-tight text-text-primary group-hover:text-neon-primary transition-colors">
            {subproduct.name}
          </h3>

          {hasPrice ? (
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-xs text-text-muted">Precio:</span>
              <span className="font-mono text-xl font-bold text-neon-primary drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
                ${subproduct.price?.toFixed(2)}
              </span>
            </div>
          ) : (
            <p className="mt-3 font-mono text-xs text-neon-primary/80">
              Precios por servidor disponibles
            </p>
          )}
        </div>

        {/* Footer Link */}
        <div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-3.5 font-mono text-xs font-semibold text-text-secondary group-hover:text-neon-primary transition-colors">
          <span>Ver opciones y comprar</span>
          <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
