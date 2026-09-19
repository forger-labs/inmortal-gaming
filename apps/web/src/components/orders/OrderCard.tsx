import { OrdersIcon, WalletIcon } from "@shared/icons";
import type { OrderEntity } from "@shared/types";

import OrderStatusBadge from "./OrderStatusBadge";

interface OrderCardProps {
  order: OrderEntity;
  index: number;
}

export default function OrderCard({ order, index }: OrderCardProps) {
  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Reciente";

  return (
    <div
      style={{ "--i": index } as React.CSSProperties}
      className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-xl border border-white/10 bg-bg-surface/80 p-5 backdrop-blur-sm transition-all duration-200 hover:border-neon-primary/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.1)]"
    >
      {/* Informacion de la orden */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-bg-elevated text-neon-primary group-hover:border-neon-primary/40 transition-colors">
          <OrdersIcon className="h-6 w-6" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-text-primary">
              Orden #{order.id}
            </span>
            <span className="font-mono text-xs text-text-muted">
              • {formattedDate}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs font-body text-text-secondary">
            <WalletIcon className="h-3.5 w-3.5 text-neon-primary/70" />
            <span>Metodo:</span>
            <span className="font-mono font-medium text-text-primary">
              {order.payment_method || "No especificado"}
            </span>
          </div>
        </div>
      </div>

      {/* Monto y Estado */}
      <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
        <div className="flex flex-col items-start sm:items-end">
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Total
          </span>
          <span className="font-mono text-lg font-bold text-neon-primary">
            $
            {Number(order.total_amount).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>
    </div>
  );
}
