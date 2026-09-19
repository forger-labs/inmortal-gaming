"use client";

import { EyeIcon, OrdersIcon, UserIcon, WalletIcon } from "@shared/icons";
import type { OrderEntity } from "@shared/types";

import { OrderStatusBadge } from "./OrderStatusBadge";

export interface OrderCardItemProps {
  order: OrderEntity;
  index: number;
  onViewDetails: (order: OrderEntity) => void;
}

export function OrderCardItem({
  order,
  index,
  onViewDetails,
}: OrderCardItemProps) {
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
      className="group relative flex flex-col gap-4 rounded-xl border border-white/10 bg-bg-surface/90 p-5 backdrop-blur-sm transition-all duration-200 hover:border-neon-primary/40 hover:bg-bg-surface-hover hover:shadow-[0_0_25px_rgba(0,240,255,0.08)] sm:flex-row sm:items-center sm:justify-between"
    >
      {/* ─── Identificador de Orden y Fecha ─── */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-bg-elevated text-neon-primary transition-colors group-hover:border-neon-primary/40">
          <OrdersIcon className="h-6 w-6" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-base font-bold text-text-primary">
              Orden #{order.id}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
          <span className="font-mono text-xs text-text-muted">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* ─── Datos del Cliente y Metodo de Pago ─── */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-body text-text-secondary sm:gap-6">
        {/* Cliente */}
        <div className="flex items-center gap-1.5">
          <UserIcon className="h-4 w-4 text-neon-primary/70" />
          <span className="font-mono">
            {order.user_id ? `Usuario #${order.user_id}` : "Invitado"}
          </span>
        </div>

        {/* Telefono */}
        {order.phone_number && (
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-text-muted">Tel:</span>
            <span className="font-mono font-medium text-text-primary">
              {order.phone_number}
            </span>
          </div>
        )}

        {/* Metodo de Pago */}
        <div className="flex items-center gap-1.5">
          <WalletIcon className="h-4 w-4 text-neon-primary/70" />
          <span className="font-mono font-medium text-text-primary">
            {order.payment_method || "No especificado"}
          </span>
        </div>
      </div>

      {/* ─── Total y Accion ─── */}
      <div className="flex items-center justify-between gap-5 border-t border-white/5 pt-3 sm:border-t-0 sm:pt-0">
        <div className="flex flex-col items-start sm:items-end">
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Total
          </span>
          <span className="font-mono text-xl font-bold text-neon-primary">
            $
            {Number(order.total_amount).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(order)}
          className="flex items-center gap-2 rounded-md border border-neon-primary/40 bg-neon-primary/10 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-neon-primary transition-all duration-150 hover:border-neon-primary hover:bg-neon-primary hover:text-bg-primary hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-95 cursor-pointer"
        >
          <EyeIcon className="h-4 w-4" />
          <span>Ver detalles</span>
        </button>
      </div>
    </div>
  );
}
