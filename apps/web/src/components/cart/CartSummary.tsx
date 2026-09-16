"use client";

import { ShieldCheckIcon, WalletIcon, WhatsAppIcon } from "@shared/icons";
import { Field, Form, Formik } from "formik";
import { motion } from "framer-motion";

import { EASE_OUT_EXPO } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { CartForm } from "./CartForm";

// const PROMO_CODES: Record<string, number> = {
//   BIENVENIDO10: 0.1,
//   COMBO15: 0.15,
// };

export function CartSummary() {
  const {  totalPrice, totalItems } = useCart();
  // const [promoCode, setPromoCode] = useState("");
  // const [discountRate, setDiscountRate] = useState(0);

  // const discount = totalPrice * discountRate;
  const finalTotal = Math.max(0, totalPrice);

  // const applyPromo = () => {
  //   const code = promoCode.trim().toUpperCase();
  //   if (!code) return;

  //   const rate = PROMO_CODES[code];
  //   if (rate) {
  //     setDiscountRate(rate);
  //     cyberSuccess(
  //       `Descuento del ${Math.round(rate * 100)}% aplicado.`,
  //       "[CODIGO APLICADO]",
  //     );
  //   } else {
  //     setDiscountRate(0);
  //     cyberError(
  //       "Revisa el codigo e intentalo de nuevo.",
  //       "[CODIGO NO VALIDO]",
  //     );
  //   }
  // };

  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08, ease: EASE_OUT_EXPO }}
      className="lg:col-span-4"
    >
      <div className="sticky top-24 rounded-xl border border-border-neon/40 bg-bg-elevated/95 p-6 shadow-[0_4px_30px_rgba(0,0,0,0.7)] backdrop-blur-md">
        {/* Title */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-text-primary">
            <WalletIcon className="h-6 w-6 text-neon-primary" />
            Resumen
          </h2>
          <span className="rounded border border-neon-primary/30 bg-neon-primary/10 px-2.5 py-0.5 font-mono text-xs font-bold text-neon-primary">
            {totalItems} {totalItems === 1 ? "ITEM" : "ITEMS"}
          </span>
        </div>

        {/* Financial Breakdown */}
        <div className="mt-5 space-y-3 font-mono text-sm">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal</span>
            <span className="text-text-primary tabular-nums">
              ${totalPrice.toFixed(2)} USD
            </span>
          </div>

          {/*{discountRate > 0 && (
            <div className="flex justify-between text-neon-green">
              <span>Descuento ({Math.round(discountRate * 100)}%)</span>
              <span className="tabular-nums">-${discount.toFixed(2)} USD</span>
            </div>
          )}
*/}

          <div className="flex justify-between text-text-secondary">
            <span>Tarifa de entrega</span>
            <span className="font-semibold text-neon-green">Inmediata</span>
          </div>

          {/* Divider + Final Total */}
          <div className="my-2 border-t border-white/10 pt-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-display text-lg font-bold text-text-primary">
                  Total Final
                </span>
                <p className="font-body text-[11px] text-text-muted">
                  Tasa congelada al ordenar
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-2xl font-black text-neon-primary tabular-nums shadow-neon-glow">
                  ${finalTotal.toFixed(2)}
                </span>
                <span className="ml-1 font-mono text-xs text-text-muted">
                  USD
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Code Input */}
        {/*<div className="mt-5 rounded-lg border border-white/5 bg-bg-surface/60 p-3">
          <label
            htmlFor="promo-code-input"
            className="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-text-secondary"
          >
            Codigo de Descuento
          </label>
          <div className="flex gap-2">
            <input
              id="promo-code-input"
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="EJ: BIENVENIDO10"
              className="w-full rounded-md border border-white/10 bg-bg-primary px-3 py-2 font-mono text-xs uppercase text-neon-primary placeholder:text-text-muted focus:border-neon-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={applyPromo}
              className="rounded-md border border-neon-primary/60 bg-neon-primary/10 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-neon-primary transition-colors hover:bg-neon-primary hover:text-black cursor-pointer"
            >
              Aplicar
            </button>
          </div>
        </div>*/}

        {/* Formik Checkout Form */}
        <CartForm />
      </div>
    </motion.aside>
  );
}
