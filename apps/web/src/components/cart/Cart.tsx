"use client";

import { CartIcon, DeleteIcon } from "@shared/icons";
import { AnimatePresence, MotionConfig } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { sileo } from "sileo";

import type { CartEntry } from "@/data/cart";
import { MOCK_CART } from "@/data/cart";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

export function Cart() {
  const [entries, setEntries] = useState<CartEntry[]>(MOCK_CART);

  const setQuantity = (productId: string, quantity: number) => {
    setEntries((prev) =>
      prev.flatMap((entry) =>
        entry.product.id === productId
          ? quantity <= 0
            ? []
            : [{ ...entry, quantity }]
          : [entry],
      ),
    );
  };

  const removeEntry = (productId: string) => {
    setQuantity(productId, 0);
  };

  const clearCart = () => {
    setEntries([]);
    sileo.info({ title: "Carrito vaciado", position: "top-center" });
  };

  return (
    <MotionConfig reducedMotion="user">
      <section id="cart">
        {entries.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Cart items */}
            <div className="flex flex-col gap-6 lg:col-span-8">
              <AnimatePresence initial={false}>
                {entries.map((entry) => (
                  <CartItem
                    key={entry.product.id}
                    entry={entry}
                    onIncrement={() =>
                      setQuantity(entry.product.id, entry.quantity + 1)
                    }
                    onDecrement={() =>
                      setQuantity(entry.product.id, entry.quantity - 1)
                    }
                    onRemove={() => removeEntry(entry.product.id)}
                  />
                ))}
              </AnimatePresence>

              {/* Clear cart */}
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center gap-2 rounded border border-neon-pink px-6 py-3 font-body text-[13px] font-semibold uppercase tracking-wider text-neon-pink transition-colors hover:bg-neon-pink/10"
                >
                  <DeleteIcon className="h-[18px] w-[18px]" />
                  Vaciar carrito
                </button>
              </div>
            </div>

            {/* Summary */}
            <CartSummary entries={entries} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-dashed border-border-subtle bg-bg-surface/50 px-6 py-20 text-center">
            <CartIcon className="h-12 w-12 text-text-muted" />
            <div>
              <h2 className="font-display text-2xl font-bold text-text-primary">
                Tu carrito está vacío
              </h2>
              <p className="mt-2 max-w-md font-body text-text-secondary">
                Explora el catálogo y agrega productos para comenzar tu pedido
                por WhatsApp.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="btn-neon-primary rounded px-8 py-3 text-sm font-semibold uppercase tracking-wider"
            >
              Explorar catálogo
            </Link>
          </div>
        )}
      </section>
    </MotionConfig>
  );
}
