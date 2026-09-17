import type { OrderStatus } from "@shared/types";

export interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({
  status,
  className = "",
}: OrderStatusBadgeProps) {
  const normalized = (status || "").toLowerCase();

  if (normalized === "pagado") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border border-neon-green/30 bg-neon-green/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-neon-green shadow-[0_0_12px_rgba(0,255,136,0.15)] ${className}`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full bg-neon-green shadow-[0_0_6px_#00ff88]"
          aria-hidden="true"
        />
        Pagado
      </span>
    );
  }

  if (normalized === "cancelado") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border border-neon-pink/30 bg-neon-pink/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-neon-pink shadow-[0_0_12px_rgba(255,45,123,0.15)] ${className}`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full bg-neon-pink shadow-[0_0_6px_#ff2d7b]"
          aria-hidden="true"
        />
        Cancelado
      </span>
    );
  }

  // Por defecto "Pendiente"
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-neon-amber/30 bg-neon-amber/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-neon-amber shadow-[0_0_12px_rgba(255,187,0,0.15)] ${className}`}
    >
      <span
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-amber shadow-[0_0_6px_#ffbb00]"
        aria-hidden="true"
      />
      Pendiente
    </span>
  );
}
