import { ProductsIcon } from "@shared/icons";
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
}

export function SubproductHero({
  subproduct,
  product,
  subcategory,
  category,
}: SubproductHeroProps) {
  const formattedPrice =
    typeof subproduct.price === "number"
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

      {/* Price Bar */}
      <div className="flex items-baseline gap-3 rounded-lg border border-border-subtle bg-bg-surface/60 p-4 backdrop-blur-sm">
        <div className="flex flex-col">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-muted">
            PRECIO FINAL
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-bold text-neon-primary sm:text-3xl">
              $ {formattedPrice}
            </span>
            <span className="font-mono text-xs text-text-muted">USD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
