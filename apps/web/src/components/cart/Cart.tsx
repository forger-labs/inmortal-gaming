"use client";

import { CartIcon, DeleteIcon, ShieldCheckIcon } from "@shared/icons";
import { cyberInfo } from "@shared/toasts";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Link from "next/link";

import { useCart } from "@/context/CartContext";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

export function Cart({rate}:{rate:number}) {
  const { items, loading, totalItems, updateQuantity, removeItem, clearCart } =
    useCart();

  const handleClearCart = async () => {
    if (items.length === 0) return;
    await clearCart();
    cyberInfo("El carrito ha sido vaciado correctamente.", "[CARRITO]");
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 animate-pulse">
        <div className="flex flex-col gap-4 lg:col-span-8">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-32 rounded-xl border border-white/5 bg-bg-surface/50 p-6"
            />
          ))}
        </div>
        <div className="lg:col-span-4">
          <div className="h-96 rounded-xl border border-white/5 bg-bg-surface/50 p-6" />
        </div>
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <section id="cart" aria-label="Carrito de compras">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Cart Items Column */}
            <div className="flex flex-col gap-5 lg:col-span-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Productos Seleccionados ({totalItems})
                </span>
                <span className="font-mono text-xs text-neon-green">
                  Stock sincronizado
                </span>
              </div>

              <AnimatePresence mode="popLayout" initial={false}>
                {items.map((item) => (
                  <CartItem
                    rate={rate}
                    key={`${item.sub_product_id}-${item.item_price_id}-${item.id}`}
                    item={item}
                    onIncrement={() =>
                      updateQuantity(
                        item.id,
                        item.quantity + 1,
                        item.item_price_id,
                      )
                    }
                    onDecrement={() =>
                      updateQuantity(
                        item.id,
                        item.quantity - 1,
                        item.item_price_id,
                      )
                    }
                    onRemove={() => removeItem(item.id, item.item_price_id)}
                  />
                ))}
              </AnimatePresence>

              {/* Bottom Actions */}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="inline-flex items-center gap-2 rounded-lg border border-neon-pink/40 bg-neon-pink/5 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-neon-pink transition-colors hover:bg-neon-pink/15 cursor-pointer"
                >
                  <DeleteIcon className="h-4 w-4" />
                  Vaciar carrito
                </button>

                <Link
                  href="/catalogo"
                  className="font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:text-neon-primary"
                >
                  + Seguir explorando catalogo
                </Link>
              </div>

              {/* Security Banner */}
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/5 bg-bg-surface/40 p-4 font-mono text-xs text-text-secondary">
                <ShieldCheckIcon className="h-5 w-5 shrink-0 text-neon-primary" />
                <span>
                  Tus transacciones estan protegidas. Las ordenes se confirman
                  de forma personalizada y segura via WhatsApp con soporte 24/7.
                </span>
              </div>
            </div>

            {/* Summary Column */}
            <CartSummary rate={rate} />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-border-neon/30 bg-bg-surface/40 px-6 py-24 text-center backdrop-blur-sm shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-neon-primary/30 bg-neon-primary/10 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <CartIcon className="h-10 w-10 text-neon-primary" />
            </div>

            <div className="max-w-md space-y-2">
              <h2
                className="glitch font-display text-3xl font-bold tracking-tight text-text-primary"
                data-text="TU CARRITO ESTA VACIO"
              >
                TU CARRITO ESTA VACIO
              </h2>
              <p className="font-body text-sm leading-relaxed text-text-secondary">
                Aun no has agregado ningun producto o servicio digital. Explora
                nuestro catalogo con entrega inmediata.
              </p>
            </div>

            <Link
              href="/catalogo"
              className="btn-neon-primary mt-2 rounded-lg px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:scale-105"
            >
              Explorar catalogo
            </Link>
          </motion.div>
        )}
      </section>
    </MotionConfig>
  );
}
