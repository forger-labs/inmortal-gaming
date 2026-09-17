"use client";

import { CloseIcon, SearchIcon } from "@shared/icons";
import type { OrderFilters } from "@shared/types";

export interface OrdersFilterBarProps {
  filters: OrderFilters;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFiltersChange: (filters: OrderFilters) => void;
  resultCount: number;
}

const hasActiveFilters = (filters: OrderFilters, searchQuery: string) =>
  Boolean(
    searchQuery.trim() !== "" ||
      (filters.status && filters.status !== "all") ||
      filters.created_at ||
      filters.min_total_amount !== undefined ||
      filters.max_total_amount !== undefined ||
      (filters.sort_created_at && filters.sort_created_at !== "desc"),
  );

export function OrdersFilterBar({
  filters,
  searchQuery,
  onSearchChange,
  onFiltersChange,
  resultCount,
}: OrdersFilterBarProps) {
  const active = hasActiveFilters(filters, searchQuery);

  const handleReset = () => {
    onSearchChange("");
    onFiltersChange({
      status: "all",
      sort_created_at: "desc",
      created_at: undefined,
      min_total_amount: undefined,
      max_total_amount: undefined,
      user_id: undefined,
    });
  };

  return (
    <div className="flex flex-col gap-4 border-b border-white/5 bg-bg-surface p-5 lg:p-6">
      {/* ─── Fila Superior: Busqueda y Estado ─── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {/* Busqueda por ID de usuario o referencia */}
        <div className="flex flex-col gap-1.5 lg:col-span-4">
          <label
            htmlFor="orders-search"
            className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
          >
            Buscar orden / cliente
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              <SearchIcon className="h-4 w-4" />
            </span>
            <input
              id="orders-search"
              type="search"
              placeholder="Buscar por ID, telefono..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-bg-primary py-2.5 pl-9 pr-3 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/50 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
            />
          </div>
        </div>

        {/* Filtro de Estado */}
        <div className="flex flex-col gap-1.5 lg:col-span-3">
          <label
            htmlFor="orders-status-filter"
            className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
          >
            Estado del pedido
          </label>
          <select
            id="orders-status-filter"
            value={filters.status ?? "all"}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                status: e.target.value as OrderFilters["status"],
              })
            }
            className="w-full rounded-md border border-white/10 bg-bg-primary px-3 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          >
            <option value="all">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Pagado">Pagado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        {/* Filtro de Orden por Fecha (asc / desc) */}
        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <label
            htmlFor="orders-sort-filter"
            className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
          >
            Orden fecha
          </label>
          <select
            id="orders-sort-filter"
            value={filters.sort_created_at ?? "desc"}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                sort_created_at: e.target.value as "asc" | "desc",
              })
            }
            className="w-full rounded-md border border-white/10 bg-bg-primary px-3 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          >
            <option value="desc">Mas recientes primero</option>
            <option value="asc">Mas antiguas primero</option>
          </select>
        </div>

        {/* Filtro por Fecha especifica */}
        <div className="flex flex-col gap-1.5 lg:col-span-3">
          <label
            htmlFor="orders-date-filter"
            className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
          >
            Fecha de creacion
          </label>
          <input
            id="orders-date-filter"
            type="date"
            value={filters.created_at ?? ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                created_at: e.target.value || undefined,
              })
            }
            className="w-full rounded-md border border-white/10 bg-bg-primary px-3 py-2 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          />
        </div>
      </div>

      {/* ─── Fila Inferior: Rango de montos + Conteo y Limpiar ─── */}
      <div className="flex flex-col gap-4 pt-2 border-t border-white/5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Monto Minimo */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="orders-min-amount-filter"
              className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted"
            >
              Monto Min ($)
            </label>
            <input
              id="orders-min-amount-filter"
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={filters.min_total_amount ?? ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  min_total_amount: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="w-28 rounded-md border border-white/10 bg-bg-primary px-3 py-1.5 font-mono text-xs text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
            />
          </div>

          <span className="self-end pb-2 font-mono text-xs text-text-muted">
            –
          </span>

          {/* Monto Maximo */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="orders-max-amount-filter"
              className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted"
            >
              Monto Max ($)
            </label>
            <input
              id="orders-max-amount-filter"
              type="number"
              min="0"
              step="any"
              placeholder="9999.00"
              value={filters.max_total_amount ?? ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  max_total_amount: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="w-28 rounded-md border border-white/10 bg-bg-primary px-3 py-1.5 font-mono text-xs text-text-primary transition-all placeholder:text-text-muted/40 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
            />
          </div>
        </div>

        {/* Resumen de resultados y boton de reset */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
            {resultCount} {resultCount === 1 ? "orden" : "ordenes"}
          </span>
          {active && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-sm border border-white/10 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary active:scale-95 cursor-pointer"
            >
              <CloseIcon className="h-3.5 w-3.5" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
