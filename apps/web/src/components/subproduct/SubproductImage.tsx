"use client";

import { ProductsIcon } from "@shared/icons";
import { getR2ImageUrl } from "@shared/utils";
import Image from "next/image";
import { useState } from "react";

interface SubproductImageProps {
  image?: string;
  name: string;
  isActive: boolean;
}

export function SubproductImage({
  image,
  name,
  isActive,
}: SubproductImageProps) {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getR2ImageUrl(image);

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-bg-surface shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] lg:aspect-4/3">
      {/* Cyberpunk corner accents */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 h-4 w-4 border-l-2 border-t-2 border-neon-primary" />
      <div className="pointer-events-none absolute right-0 top-0 z-20 h-4 w-4 border-r-2 border-t-2 border-neon-primary" />
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-4 w-4 border-b-2 border-l-2 border-neon-primary" />
      <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-4 w-4 border-b-2 border-r-2 border-neon-primary" />

      {/* Cyber cyan glow overlay on hover */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-bg-primary/80 via-transparent to-neon-primary/5 transition-opacity duration-300 group-hover:opacity-60" />

      {imageUrl && !hasError ? (
        <Image
          src={imageUrl}
          alt={`Visualizacion de ${name}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-bg-surface-hover text-text-muted">
          <ProductsIcon className="h-16 w-16 opacity-30" />
          <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
            SIN IMAGEN DISPONIBLE
          </span>
        </div>
      )}

      {/* Status indicator bottom badge */}
      <div className="absolute bottom-3 left-3 z-20">
        <span
          className={`rounded-sm border px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${
            isActive
              ? "border-neon-green/50 bg-bg-primary/80 text-neon-green"
              : "border-text-muted/50 bg-bg-primary/80 text-text-muted"
          }`}
        >
          {isActive ? "INSTANT DISPATCH" : "STOCK AGOTADO"}
        </span>
      </div>
    </div>
  );
}
