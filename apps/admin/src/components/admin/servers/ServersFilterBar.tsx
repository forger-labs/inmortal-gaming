"use client";

import { CloseIcon, SearchIcon } from "@shared/icons";
import type { ProductEntity, ServerFilters } from "@shared/types";

interface ServersFilterBarProps {
  filters: ServerFilters;
  onChange: (filters: ServerFilters) => void;
  products: ProductEntity[];
  resultCount: number;
}

const hasActiveFilters = (filters: ServerFilters) =>
  filters.search.trim() !== "" || filters.product_id !== "ALL";

const resetFilters = (): ServerFilters => ({
  search: "",
  product_id: "ALL",
});

export function ServersFilterBar({
  filters,
  onChange,
  products,
  resultCount,
}: ServersFilterBarProps) {
  const active = hasActiveFilters(filters);

  return (
    <div className="flex flex-col gap-3 border-b border-white/5 bg-bg-surface px-6 py-4 sm:flex-row sm:items-end sm:gap-4">
      {/* ─── Busqueda por nombre de servidor ─── */}
      <div className="flex w-full flex-col gap-1.5 sm:max-w-xs">
        <div className="flex items-center justify-between">
          <label
            htmlFor="servers-search"
            className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
          >
            Buscar servidor
          </label>
          <span className="font-mono text-[10px] text-text-muted">
            Filtro por nombre
          </span>
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            id="servers-search"
            type="search"
            placeholder="Buscar por servidor..."
            value={filters.search}
            onChange={(event) =>
              onChange({ ...filters, search: event.target.value })
            }
            className="w-full rounded-md border border-white/10 bg-bg-primary py-2.5 pl-9 pr-3 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/50 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          />
        </div>
      </div>

      {/* ─── Filtro por producto ─── */}
      <div className="flex w-full flex-col gap-1.5 sm:max-w-xs">
        <label
          htmlFor="servers-product-filter"
          className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
        >
          Filtrar por producto
        </label>
        <select
          id="servers-product-filter"
          value={filters.product_id}
          onChange={(event) =>
            onChange({
              ...filters,
              product_id:
                event.target.value === "ALL"
                  ? "ALL"
                  : Number(event.target.value),
            })
          }
          className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
        >
          <option value="ALL">Todos los productos</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      {/* ─── Resumen + limpiar ─── */}
      <div className="flex items-center gap-3 sm:ml-auto">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
          {resultCount} {resultCount === 1 ? "servidor" : "servidores"}
        </span>
        {active && (
          <button
            type="button"
            onClick={() => onChange(resetFilters())}
            className="flex items-center gap-1.5 rounded-sm border border-white/10 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary active:scale-95 cursor-pointer"
          >
            <CloseIcon className="h-3.5 w-3.5" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
