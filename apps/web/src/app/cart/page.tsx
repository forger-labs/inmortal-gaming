import type { Metadata } from "next";

import { Cart } from "@/components/cart/Cart";
import { NodeBackground } from "@/components/hero/NodeBackground";

export const metadata: Metadata = {
  title: "Carrito de Compras — Inmortal Gaming",
  description:
    "Revisa tus productos y completa tu orden con entrega inmediata por WhatsApp.",
};

export default function CartPage() {
  return (
    <main className="relative min-h-screen pt-20 pb-24 overflow-hidden">
      {/* Dynamic Cyberpunk Node Background */}
      <NodeBackground />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-8 md:px-12 md:py-12">
        {/* Page Header */}
        <header className="mb-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-neon-primary/30 bg-neon-primary/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-neon-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-primary animate-pulse" />
            Terminal de Checkout
          </div>

          <h1
            data-text="TU CARRITO"
            className="glitch font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl"
          >
            TU CARRITO
          </h1>

          <p className="font-body text-base leading-relaxed text-text-secondary">
            Verifica los items de tu pedido antes de formalizar la orden. Al
            confirmar, se generara tu orden y te redirigiremos a WhatsApp para
            el pago y la entrega inmediata.
          </p>
        </header>

        {/* Cart View Component */}
        <Cart />
      </div>
    </main>
  );
}
