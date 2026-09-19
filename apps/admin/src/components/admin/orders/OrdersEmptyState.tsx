import { OrdersIcon } from "@shared/icons";

export interface OrdersEmptyStateProps {
  title?: string;
  description?: string;
}

export function OrdersEmptyState({
  title = "Sin ordenes encontradas",
  description = "No se encontraron registros de pedidos con los criterios de busqueda y filtros seleccionados.",
}: OrdersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-bg-surface text-text-muted shadow-[0_0_20px_rgba(0,0,0,0.4)]">
        <OrdersIcon className="h-8 w-8 text-neon-primary/60" />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-text-primary">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm font-body text-sm text-text-secondary">
        {description}
      </p>
    </div>
  );
}
