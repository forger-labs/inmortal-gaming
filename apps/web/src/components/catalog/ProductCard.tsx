import { CartIcon } from "@shared/icons";
import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/constants";
import type { ProductDisplay } from "@/types";

const STOCK_STYLES: Record<
  ProductDisplay["stockStatus"],
  { label: string; classes: string }
> = {
  available: {
    label: "Disponible",
    classes: "border-neon-green text-neon-green bg-neon-green/10",
  },
  low: {
    label: "Poco stock",
    classes: "border-neon-amber text-neon-amber bg-neon-amber/10",
  },
  "out-of-stock": {
    label: "Agotado",
    classes: "border-text-muted text-text-muted bg-bg-surface-hover",
  },
};

const CATEGORY_COLORS: Record<ProductDisplay["categoryColor"], string> = {
  "neon-purple": "text-neon-purple",
  "neon-pink": "text-neon-pink",
  "neon-green": "text-neon-green",
  "neon-amber": "text-neon-amber",
};

interface ProductCardProps {
  product: ProductDisplay;
  itemType?: "product" | "subproduct";
}

export function ProductCard({ product, itemType }: ProductCardProps) {
  const stock = STOCK_STYLES[product.stockStatus];
  const categoryColor = CATEGORY_COLORS[product.categoryColor];

  const isSubproduct =
    itemType === "subproduct" ||
    product.itemType === "subproduct" ||
    product.displayCategory?.toLowerCase() === "subproducto";

  const href = isSubproduct
    ? ROUTES.subproduct(product.id)
    : ROUTES.product(product.id);

  return (
    <Link
      href={href}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border-l border-neon-primary bg-bg-surface shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-bg-surface-hover">
        {/* Cyan overlay that fades on hover */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-neon-primary/5 transition-colors duration-300 group-hover:bg-transparent" />

        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Stock badge */}
        <div className="absolute right-2 top-2 z-20">
          <span
            className={`rounded-sm border px-2 py-1 font-mono text-xs ${stock.classes}`}
          >
            {stock.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-grow flex-col p-4">
        {/* Category label */}
        <span
          className={`mb-1 font-body text-xs font-semibold uppercase tracking-wider ${categoryColor}`}
        >
          {product.displayCategory}
        </span>

        {/* Title */}
        <h4 className="mb-2 font-display text-base font-semibold text-text-primary transition-colors group-hover:text-neon-primary">
          {product.name}
        </h4>

        {/* Bottom: price + cart */}
        <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-4">
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="rounded-sm border border-neon-primary p-2 text-neon-primary transition-colors hover:bg-neon-primary/10"
            aria-label={`Add ${product.name} to cart`}
          >
            <CartIcon className="h-5 w-5" />
          </button>

          <span className="font-display text-lg font-semibold text-text-primary transition-colors group-hover:text-neon-primary">
            $ {product.price}
          </span>
        </div>
      </div>
    </Link>
  );
}
