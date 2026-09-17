"use client";

import { ChevronRightIcon, GridIcon, ProductsIcon } from "@shared/icons";
import type {
  CategoryEntity,
  ProductEntity,
  SubcategoryEntity,
} from "@shared/types";
import { getR2ImageUrl } from "@shared/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ROUTES } from "@/constants";

interface CategoryCardProps {
  category: CategoryEntity;
  subcategories: SubcategoryEntity[];
  previewProducts?: ProductEntity[];
  index?: number;
}

export function CategoryCard({
  category,
  subcategories,
  previewProducts = [],
  index = 0,
}: CategoryCardProps) {
  const [imgError, setImgError] = useState(false);
  const categorySlugOrId = category.slug || category.id.toString();

  // Find the first valid product image for cover
  const coverProduct = previewProducts.find((p) => p.image);
  const coverImageUrl = coverProduct ? getR2ImageUrl(coverProduct.image) : null;

  // Thematic neon accents
  const accents = [
    {
      glow: "group-hover:shadow-[0_12px_40px_rgba(0,240,255,0.22)]",
      border: "border-border-subtle group-hover:border-neon-primary/70",
      accentTag: "bg-neon-primary/15 text-neon-primary border-neon-primary/40",
      accentBar: "from-neon-primary via-cyan-400 to-transparent",
      badge: "border-neon-primary/30 text-neon-primary bg-neon-primary/10",
    },
    {
      glow: "group-hover:shadow-[0_12px_40px_rgba(123,45,255,0.22)]",
      border: "border-border-subtle group-hover:border-purple-500/70",
      accentTag: "bg-purple-500/15 text-purple-400 border-purple-500/40",
      accentBar: "from-purple-500 via-violet-400 to-transparent",
      badge: "border-purple-500/30 text-purple-400 bg-purple-500/10",
    },
    {
      glow: "group-hover:shadow-[0_12px_40px_rgba(255,45,123,0.22)]",
      border: "border-border-subtle group-hover:border-pink-500/70",
      accentTag: "bg-pink-500/15 text-pink-400 border-pink-500/40",
      accentBar: "from-pink-500 via-rose-400 to-transparent",
      badge: "border-pink-500/30 text-pink-400 bg-pink-500/10",
    },
    {
      glow: "group-hover:shadow-[0_12px_40px_rgba(0,255,136,0.22)]",
      border: "border-border-subtle group-hover:border-emerald-500/70",
      accentTag: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
      accentBar: "from-emerald-500 via-teal-400 to-transparent",
      badge: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    },
  ];

  const theme = accents[index % accents.length];

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-bg-surface transition-all duration-300 hover:-translate-y-1.5 ${theme.border} ${theme.glow}`}
    >
      {/* Top Banner & Artwork (Takes a fair amount of the card space ~180px) */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-bg-surface-hover border-b border-border-subtle">
        {coverImageUrl && !imgError ? (
          <>
            <Image
              src={coverImageUrl}
              alt={`Portada de ${category.category_name}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={() => setImgError(true)}
              className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
            />
            {/* Cinematic Cyberpunk Vignette & Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-bg-surface/60 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-neon-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-bg-surface-hover via-bg-surface to-bg-primary">
            {/* Decorative Cyber Graphic */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.08)_0%,transparent_70%)]" />
            <GridIcon className="h-16 w-16 text-text-muted/25 transition-transform duration-500 group-hover:scale-110 group-hover:text-neon-primary/40" />
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute inset-x-4 top-4 flex items-center justify-between z-10">
          <span
            className={`rounded-md border px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${theme.accentTag}`}
          >
            {category.category_name}
          </span>

          <span
            className={`rounded-md border px-2.5 py-1 font-mono text-[11px] font-bold backdrop-blur-md ${theme.badge}`}
          >
            {subcategories.length}{" "}
            {subcategories.length === 1 ? "subcategoría" : "subcategorías"}
          </span>
        </div>

        {/* Category Title Over Banner */}
        <div className="absolute inset-x-4 bottom-3 z-10">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white drop-shadow-md group-hover:text-neon-primary transition-colors">
            <Link href={ROUTES.catalogCategory(categorySlugOrId)}>
              {category.category_name}
            </Link>
          </h2>
        </div>
      </div>

      {/* Card Body: Subcategories & Navigation */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Subcategorías principales
            </span>
            <span className="font-mono text-[10px] text-text-muted">
              Stock garantizado
            </span>
          </div>

          {subcategories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border-subtle bg-bg-primary/50 py-6 text-center">
              <ProductsIcon className="mx-auto h-6 w-6 text-text-muted opacity-40 mb-1" />
              <p className="font-body text-xs text-text-muted">
                Próximamente nuevos servicios en esta categoría.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {subcategories.map((subcat) => {
                const subcatSlugOrId = subcat.slug || subcat.id.toString();

                return (
                  <Link
                    key={subcat.id}
                    href={ROUTES.catalogSubcategory(
                      categorySlugOrId,
                      subcatSlugOrId,
                    )}
                    className="group/item flex items-center justify-between rounded-xl border border-border-subtle/80 bg-bg-primary/60 px-3.5 py-2.5 transition-all duration-200 hover:border-neon-primary/70 hover:bg-bg-surface-hover hover:shadow-[0_0_16px_rgba(0,240,255,0.12)]"
                  >
                    <span className="truncate font-body text-sm font-semibold text-text-primary group-hover/item:text-neon-primary transition-colors">
                      {subcat.subcategory_name}
                    </span>
                    <ChevronRightIcon className="h-4 w-4 shrink-0 text-text-muted transition-transform group-hover/item:translate-x-1 group-hover/item:text-neon-primary" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom CTA Action Button */}
        <div className="mt-6 border-t border-border-subtle pt-4">
          <Link
            href={ROUTES.catalogCategory(categorySlugOrId)}
            className="flex w-full items-center justify-between rounded-xl border border-neon-primary/40 bg-neon-primary/10 px-4 py-3 font-display text-sm font-bold uppercase tracking-wider text-neon-primary transition-all duration-200 hover:bg-neon-primary hover:text-bg-primary hover:shadow-[0_0_20px_rgba(0,240,255,0.35)]"
          >
            <span>Explorar catálogo de {category.category_name}</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
