"use client";

import Image from "next/image";

import { DeleteIcon, MinusIcon, PlusIcon } from "@/components/icons";
import type { CartEntry } from "@/data/cart";
import type { ProductDisplay } from "@/types";

/* ─── Stock badge ─── */

const STOCK_STYLES: Record<
  ProductDisplay["stockStatus"],
  { label: string; classes: string }
> = {
  available: {
    label: "IN STOCK",
    classes: "border-neon-green text-neon-green",
  },
  low: {
    label: "LOW STOCK",
    classes: "border-neon-amber text-neon-amber",
  },
  "out-of-stock": {
    label: "OUT OF STOCK",
    classes: "border-text-muted text-text-muted",
  },
};

/* ─── Props ─── */

interface CartItemProps {
  entry: CartEntry;
}

export function CartItem({ entry }: CartItemProps) {
  const { product, quantity } = entry;
  const stock = STOCK_STYLES[product.stockStatus];

  return (
    <article className="neon-card relative flex flex-col gap-4 overflow-hidden p-5 sm:flex-row sm:gap-6">
      {/* Hover gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-neon-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {/* Image */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded bg-bg-surface-hover sm:w-32">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        )}
        <div className="pointer-events-none absolute inset-0 z-10 bg-neon-primary/5 mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="flex flex-grow flex-col gap-3">
        {/* Top row: info + delete */}
        <div className="flex items-start justify-between">
          <div>
            {/* Stock badge */}
            <span
              className={`mb-1 inline-block rounded-sm border px-2 py-0.5 font-label text-[10px] font-semibold uppercase tracking-wider ${stock.classes} bg-neon-green/5`}
            >
              {stock.label}
            </span>
            <h3 className="font-display text-lg font-semibold text-text-primary">
              {product.name}
            </h3>
            <p className="mt-0.5 font-mono text-xs text-text-muted">
              SKU: {product.id.toUpperCase()}
            </p>
          </div>

          {/* Delete button — top right */}
          <button
            type="button"
            className="rounded text-text-muted transition-colors hover:text-neon-pink"
            aria-label={`Remove ${product.name} from cart`}
          >
            <DeleteIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Bottom row: quantity controls + price */}
        <div className="mt-auto flex items-end justify-between">
          {/* Quantity controls — container with border + background */}
          <div className="inline-flex items-center gap-1 rounded border border-bg-elevated bg-bg-elevated p-1">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-neon-primary"
              aria-label="Remove one"
            >
              <MinusIcon className="h-5 w-5" />
            </button>

            <span className="w-4 text-center font-mono text-sm text-text-primary tabular-nums">
              {quantity}
            </span>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-neon-primary"
              aria-label="Add one"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Price */}
          <span className="font-mono text-xl font-bold text-neon-primary tabular-nums">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </article>
  );
}
