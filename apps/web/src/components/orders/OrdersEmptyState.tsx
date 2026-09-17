import { BoltIcon, OrdersIcon } from "@shared/icons";
import Link from "next/link";

import { ROUTES } from "@/constants";

export default function OrdersEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-bg-surface/60 p-12 text-center backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-neon-primary/30 bg-bg-elevated text-neon-primary shadow-[0_0_25px_rgba(0,240,255,0.2)]">
        <OrdersIcon className="h-8 w-8" />
      </div>

      <span
        data-text="SIN REGISTRO DE PEDIDOS"
        className="glitch font-mono text-xs font-bold uppercase tracking-[0.2em] text-neon-primary"
      >
        Sin registro de pedidos
      </span>

      <h3 className="mt-2 font-display text-xl font-bold text-text-primary sm:text-2xl">
        Aun no tienes ordenes registradas
      </h3>

      <p className="mt-2 max-w-md font-body text-xs text-text-secondary sm:text-sm">
        Tus compras y pedidos de productos o subproductos apareceran listados
        aqui en tiempo real.
      </p>

      <div className="mt-6">
        <Link
          href={ROUTES.catalog}
          className="inline-flex items-center gap-2 rounded bg-neon-primary px-6 py-3 font-display text-xs font-semibold uppercase tracking-wider text-bg-primary transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
        >
          Explorar Catalogo
          <BoltIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
