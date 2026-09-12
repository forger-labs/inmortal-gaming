"use client";

import { WalletIcon, WhatsAppIcon } from "@shared/icons";
import { cyberError, cyberSuccess } from "@shared/toasts";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { EASE_OUT_EXPO } from "@/constants";
import type { CartEntry } from "@/data/cart";

const TAX_RATE = 0.08;
const BUSINESS_WHATSAPP = "584161234567";
const PROMO_CODES: Record<string, number> = {
  BIENVENIDO10: 0.1,
  COMBO15: 0.15,
};

interface CartSummaryProps {
  entries: CartEntry[];
}

export function CartSummary({ entries }: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState("");
  const [discountRate, setDiscountRate] = useState(0);

  const itemCount = entries.reduce((acc, entry) => acc + entry.quantity, 0);
  const subtotal = entries.reduce(
    (acc, entry) => acc + entry.product.price * entry.quantity,
    0,
  );
  const discount = subtotal * discountRate;
  const tax = subtotal * TAX_RATE;
  const total = subtotal - discount + tax;

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    const rate = PROMO_CODES[code];
    if (rate) {
      setDiscountRate(rate);
      cyberSuccess(
        `Descuento del ${Math.round(rate * 100)}%`,
        "[CODIGO APLICADO]",
      );
    } else {
      setDiscountRate(0);
      cyberError(
        "Revisa el codigo e intentalo de nuevo.",
        "[CODIGO NO VALIDO]",
      );
    }
  };

  const message = `Hola Inmortal Gaming, quiero comprar: ${entries
    .map((entry) => `${entry.quantity}x ${entry.product.name}`)
    .join(", ")}. Total: $${total.toFixed(2)}.`;
  const whatsappHref = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08, ease: EASE_OUT_EXPO }}
      className="lg:col-span-4"
    >
      <div className="sticky top-24 rounded-lg bg-bg-elevated p-6 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        {/* Title */}
        <h2 className="flex items-center gap-2 border-b border-border-subtle pb-3 font-display text-2xl font-semibold text-text-primary">
          <WalletIcon className="h-6 w-6 text-neon-primary" />
          Resumen del pedido
        </h2>

        {/* Line items */}
        <div className="mt-6 flex flex-col gap-3 font-mono text-sm">
          <div className="flex justify-between text-text-secondary">
            <span>
              Subtotal ({itemCount} {itemCount === 1 ? "producto" : "productos"}
              )
            </span>
            <span className="tabular-nums">${subtotal.toFixed(2)}</span>
          </div>

          {discountRate > 0 && (
            <div className="flex justify-between text-neon-green">
              <span>Descuento ({Math.round(discountRate * 100)}%)</span>
              <span className="tabular-nums">-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-text-secondary">
            <span>Impuesto ({Math.round(TAX_RATE * 100)}%)</span>
            <span className="tabular-nums">${tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-text-secondary">
            <span>Envío</span>
            <span className="text-neon-green">Gratis</span>
          </div>

          {/* Divider + Total */}
          <div className="my-2 pt-3">
            <div className="flex items-end justify-between">
              <span className="font-display text-xl font-semibold text-text-primary">
                Total
              </span>
              <span className="text-glow font-mono text-2xl font-bold text-neon-primary tabular-nums">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Promo code */}
        <div className="mt-6">
          <label
            htmlFor="promo-code"
            className="mb-1 block font-body text-[13px] font-semibold uppercase tracking-wider text-text-secondary"
          >
            Código de promoción
          </label>
          <div className="flex gap-2">
            <input
              id="promo-code"
              type="text"
              value={promoCode}
              onChange={(event) => setPromoCode(event.target.value)}
              placeholder="BIENVENIDO10"
              className="w-full rounded bg-bg-surface-hover px-3 py-2 font-mono text-sm uppercase text-neon-primary transition-all placeholder:normal-case placeholder:text-text-muted focus:outline-none focus:shadow-[0_0_8px_rgba(0,240,255,0.3)]"
            />
            <button
              type="button"
              onClick={applyPromo}
              className="rounded border border-neon-primary px-5 py-2 font-body text-[13px] font-semibold uppercase tracking-wider text-neon-primary transition-colors hover:bg-neon-primary/10"
            >
              Aplicar
            </button>
          </div>
        </div>

        {/* Message preview */}
        <div className="mt-6 rounded bg-bg-primary p-4">
          <p className="mb-2 flex items-center gap-1.5 font-mono text-xs text-text-secondary">
            <WhatsAppIcon className="h-3.5 w-3.5" />
            Mensaje para WhatsApp:
          </p>
          <p className="border-l-2 border-neon-green pl-4 font-mono text-xs italic leading-relaxed text-text-muted">
            &ldquo;{message}&rdquo;
          </p>
        </div>

        {/* WhatsApp CTA */}
        <Link
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-neon-green py-3 font-display text-lg font-semibold text-black shadow-[0_0_15px_rgba(0,255,136,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,255,136,0.6)]"
        >
          <WhatsAppIcon className="h-6 w-6" title="WhatsApp" />
          Enviar por WhatsApp
        </Link>

        <p className="mt-2 text-center font-body text-xs text-text-muted">
          Te atendemos al instante para confirmar tu pedido
        </p>
      </div>
    </motion.aside>
  );
}
