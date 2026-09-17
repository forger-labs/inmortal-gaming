"use client";

import { DeleteIcon, MinusIcon, PlusIcon, ServerIcon } from "@shared/icons";
import type { CartItemDetailDTO } from "@shared/types";
import { getR2ImageUrl } from "@shared/utils";
import { motion } from "framer-motion";
import Image from "next/image";

import { EASE_OUT_EXPO } from "@/constants";
import { useCart } from "@/context/CartContext";

interface CartItemProps {
  item: CartItemDetailDTO;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  disabled?: boolean;
  rate: number;
}

export function CartItem({
  item,
  onIncrement,
  onDecrement,
  rate,
  onRemove,
  disabled = false,
}: CartItemProps) {
  const { priceInBs } = useCart();

  const imageUrl = getR2ImageUrl(item.image);
  const lineTotal = (item.price || 0) * (item.quantity || 1);
  const lineTotalFmt = priceInBs ? rate * lineTotal : lineTotal;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
      className="neon-card group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border-subtle bg-bg-surface/80 p-5 backdrop-blur-sm transition-all sm:flex-row sm:items-center sm:gap-6 hover:border-neon-primary/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
    >
      {/* Background glow on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-neon-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Image / Thumbnail */}
      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg border border-white/5 bg-bg-elevated sm:h-24 sm:w-24">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.product_name}
            fill
            sizes="(max-width: 640px) 100vw, 96px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-bg-surface-hover font-mono text-xs text-text-muted">
            <span className="font-bold text-neon-primary">INMORTAL</span>
          </div>
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-neon-primary/5 mix-blend-overlay"
        />
      </div>

      {/* Item info */}
      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-sm border border-neon-primary/30 bg-neon-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-neon-primary">
                SUB-ID #{String(item.sub_product_id).padStart(3, "0")}
              </span>
              {item.server_name && (
                <span className="inline-flex items-center gap-1 rounded-sm border border-neon-green/30 bg-neon-green/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-neon-green">
                  <ServerIcon className="h-3 w-3" />
                  {item.server_name}
                </span>
              )}
            </div>
            <h3 className="font-display text-lg font-bold text-text-primary group-hover:text-neon-primary transition-colors">
              {item.product_name}
            </h3>
            <p className="font-mono text-xs text-text-secondary">
              Precio unitario:{" "}
              <span className="font-semibold text-text-primary">
                $
                {priceInBs
                  ? (item.price * rate).toFixed(2)
                  : item.price.toFixed(2)}{" "}
                {priceInBs ? "VES" : "USD"}
              </span>
            </p>
          </div>

          {/* Delete Action Button */}
          <button
            type="button"
            disabled={disabled}
            onClick={onRemove}
            className="rounded-lg border border-transparent p-2 text-text-muted transition-all hover:border-neon-pink/30 hover:bg-neon-pink/10 hover:text-neon-pink cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Eliminar ${item.product_name} del carrito`}
          >
            <DeleteIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Quantity and Line Total */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          {/* Quantity Controls */}
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-bg-primary/90 p-1">
            <motion.button
              type="button"
              disabled={disabled}
              whileTap={{ scale: 0.9 }}
              onClick={onDecrement}
              className="flex h-7 w-7 items-center justify-center rounded text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-neon-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Disminuir cantidad"
            >
              <MinusIcon className="h-4 w-4" />
            </motion.button>

            <span className="w-8 text-center font-mono text-sm font-bold text-text-primary tabular-nums">
              {item.quantity}
            </span>

            <motion.button
              type="button"
              disabled={disabled}
              whileTap={{ scale: 0.9 }}
              onClick={onIncrement}
              className="flex h-7 w-7 items-center justify-center rounded text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-neon-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Aumentar cantidad"
            >
              <PlusIcon className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Subtotal line */}
          <div className="text-right">
            <span className="font-mono text-lg font-bold text-neon-primary tabular-nums">
              {priceInBs ? "Bs. " : "$"}
              {lineTotalFmt.toFixed(2)}{" "}
              <span className="text-xs font-normal text-text-muted">
                {priceInBs ? "VES" : "USD"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
