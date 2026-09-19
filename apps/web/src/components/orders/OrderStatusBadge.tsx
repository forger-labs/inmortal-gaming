import type { OrderStatus } from "@shared/types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const normalized = (status || "").toLowerCase();

  if (normalized === "pagado" || normalized === "completado") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-neon-green/40 bg-neon-green/10 px-3 py-1 font-mono text-xs font-semibold text-neon-green shadow-[0_0_10px_rgba(0,255,136,0.15)]">
        <span className="h-1.5 w-1.5 rounded-full bg-neon-green" />
        PAGADO
      </span>
    );
  }

  if (normalized === "cancelado" || normalized === "rechazado") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-neon-pink/40 bg-neon-pink/10 px-3 py-1 font-mono text-xs font-semibold text-neon-pink shadow-[0_0_10px_rgba(255,45,123,0.15)]">
        <span className="h-1.5 w-1.5 rounded-full bg-neon-pink" />
        CANCELADO
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-neon-amber/40 bg-neon-amber/10 px-3 py-1 font-mono text-xs font-semibold text-neon-amber shadow-[0_0_10px_rgba(255,187,0,0.15)]">
      <span className="h-1.5 w-1.5 rounded-full bg-neon-amber animate-pulse" />
      PENDIENTE
    </span>
  );
}
