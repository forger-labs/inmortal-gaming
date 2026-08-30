"use client";

import { DeleteIcon, MinusIcon, PlusIcon } from "@shared/icons";
import { motion } from "framer-motion";
import Image from "next/image";

import { EASE_OUT_EXPO } from "@/constants";
import type { CartEntry } from "@/data/cart";
import type { ProductDisplay } from "@/types";

const STOCK_STYLES: Record<
  ProductDisplay["stockStatus"],
  { label: string; classes: string }
> = {
  available: {
    label: "Disponible",
    classes: "border-neon-green text-neon-green bg-neon-green/5",
  },
  low: {
    label: "Poco stock",
    classes: "border-neon-amber text-neon-amber bg-neon-amber/5",
  },
  "out-of-stock": {
    label: "Agotado",
    classes: "border-text-muted text-text-muted bg-bg-surface-hover",
  },
};

interface CartItemProps {
  entry: CartEntry;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartItem({
  entry,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) {
  const { product, quantity } = entry;
  const stock = STOCK_STYLES[product.stockStatus];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 16, scale: 0.98 }}
      transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
      className="neon-card group relative flex flex-col gap-4 overflow-hidden p-5 sm:flex-row sm:gap-6"
    >
      {/* Hover gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-neon-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

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
              className={`mb-1 inline-block rounded-sm border px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider ${stock.classes}`}
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
            onClick={onRemove}
            className="rounded p-1.5 text-text-muted transition-colors hover:bg-neon-pink/10 hover:text-neon-pink"
            aria-label={`Quitar ${product.name} del carrito`}
          >
            <DeleteIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Bottom row: quantity controls + price */}
        <div className="mt-auto flex items-end justify-between">
          {/* Quantity controls */}
          <div className="inline-flex items-center gap-1 rounded border border-bg-elevated bg-bg-elevated p-1">
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={onDecrement}
              className="flex h-8 w-8 items-center justify-center rounded text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-neon-primary"
              aria-label="Quitar uno"
            >
              <MinusIcon className="h-5 w-5" />
            </motion.button>

            <span className="w-6 text-center font-mono text-sm text-text-primary tabular-nums">
              {quantity}
            </span>

            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={onIncrement}
              className="flex h-8 w-8 items-center justify-center rounded text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-neon-primary"
              aria-label="Agregar uno"
            >
              <PlusIcon className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Price */}
          <span className="font-mono text-xl font-bold text-neon-primary tabular-nums">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
