import { ProductsIcon, ServerIcon } from "@shared/icons";
import type {
  CategoryEntity,
  ProductEntity,
  SubcategoryEntity,
  SubProductEntity,
} from "@shared/types";
import Link from "next/link";

import { ROUTES } from "@/constants";

interface SubproductHeroProps {
  subproduct: SubProductEntity;
  product?: ProductEntity | null;
  subcategory?: SubcategoryEntity | null;
  category?: CategoryEntity | null;
  currentPrice?: number;
  priceRange?: { min: number; max: number; isRange: boolean };
  selectedServerName?: string;
}

export function SubproductHero({
  subproduct,
  product,
  subcategory,
  category,
  currentPrice,
  priceRange,
  selectedServerName,
}: SubproductHeroProps) {
  const displayPrice =
    currentPrice !== undefined
      ? currentPrice.toFixed(2)
      : typeof subproduct.price === "number"
        ? subproduct.price.toFixed(2)
        : Number(subproduct.price || 0).toFixed(2);

  return (
    <div className="flex flex-col gap-4">
      {/* Category & Subcategory tags */}
      <div className="flex flex-wrap items-center gap-2">
        {category && (
          <span className="rounded-sm border border-neon-pink/40 bg-neon-pink/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-neon-pink">
            {category.category_name}
          </span>
        )}

        {subcategory && (
          <span className="rounded-sm border border-neon-purple/40 bg-neon-purple/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-neon-purple">
            {subcategory.subcategory_name}
          </span>
        )}

        <span className="rounded-sm border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-text-muted">
          SUB-ID #{String(subproduct.id).padStart(3, "0")}
        </span>
      </div>

      {/* Subproduct Title */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
          {subproduct.name}
        </h1>

        {/* Parent product link */}
        {product && (
          <div className="mt-2 flex items-center gap-2 font-body text-sm text-text-secondary">
            <span className="text-text-muted">Producto base:</span>
            <Link
              href={ROUTES.product(product.id)}
              className="inline-flex items-center gap-1.5 font-semibold text-neon-primary transition-colors hover:text-white"
            >
              <ProductsIcon className="h-3.5 w-3.5" />
              <span>{product.name}</span>
            </Link>
          </div>
        )}
      </div>

      {/* Dynamic Price Bar */}
      <div className="flex flex-col gap-2 rounded-lg border border-border-subtle bg-bg-surface/60 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-muted">
            {selectedServerName
              ? `PRECIO FINAL (${selectedServerName})`
              : "PRECIO FINAL"}
          </span>
          <div className="flex items-baseline gap-1.5">
            {priceRange?.isRange && !selectedServerName ? (
              <span className="font-mono text-2xl font-bold text-neon-primary sm:text-3xl">
                $ {priceRange.min.toFixed(2)} - {priceRange.max.toFixed(2)}
              </span>
            ) : (
              <span className="font-mono text-2xl font-bold text-neon-primary sm:text-3xl">
                $ {displayPrice}
              </span>
            )}
            <span className="font-mono text-xs text-text-muted">USD</span>
          </div>
        </div>

        {selectedServerName && (
          <div className="flex items-center gap-1.5 self-start rounded border border-neon-primary/30 bg-neon-primary/10 px-3 py-1 font-mono text-xs font-semibold text-neon-primary sm:self-center">
            <ServerIcon className="h-3.5 w-3.5 text-neon-primary" />
            <span>Servidor: {selectedServerName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
