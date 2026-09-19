"use client";

import { CloseIcon, GridIcon, ListIcon, SearchIcon } from "@shared/icons";
import type { CategoryEntity, ProductFilters } from "@shared/types";

import type { ProductViewMode } from "@/types/products";

interface ProductsFilterBarProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  categories: CategoryEntity[];
  viewMode: ProductViewMode;
  onViewModeChange: (mode: ProductViewMode) => void;
  resultCount: number;
}

const hasActiveFilters = (filters: ProductFilters) =>
  filters.search.trim() !== "" ||
  filters.category_id !== "ALL" ||
  filters.status !== "ALL";

const resetFilters = (): ProductFilters => ({
  search: "",
  category_id: "ALL",
  status: "ALL",
});

export function ProductsFilterBar({
  filters,
  onChange,
  categories,
  viewMode,
  onViewModeChange,
  resultCount,
}: ProductsFilterBarProps) {
  const active = hasActiveFilters(filters);

  return (
    <div className="flex flex-col gap-4 border-b border-white/5 bg-bg-surface px-6 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        {/* ─── Busqueda por nombre de producto ─── */}
        <div className="flex w-full flex-col gap-1.5 sm:max-w-xs">
          <div className="flex items-center justify-between">
            <label
              htmlFor="products-search"
              className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Buscar producto
            </label>
            <span className="font-mono text-[10px] text-text-muted">
              Por nombre
            </span>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              <SearchIcon className="h-4 w-4" />
            </span>
            <input
              id="products-search"
              type="search"
              placeholder="Buscar por nombre de producto..."
              value={filters.search}
              onChange={(event) =>
                onChange({ ...filters, search: event.target.value })
              }
              className="w-full rounded-md border border-white/10 bg-bg-primary py-2.5 pl-9 pr-3 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/50 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
            />
          </div>
        </div>

        {/* ─── Filtro por categoria ─── */}
        <div className="flex w-full flex-col gap-1.5 sm:max-w-xs">
          <label
            htmlFor="products-category-filter"
            className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
          >
            Filtrar por categoria
          </label>
          <select
            id="products-category-filter"
            value={filters.category_id}
            onChange={(event) =>
              onChange({
                ...filters,
                category_id:
                  event.target.value === "ALL"
                    ? "ALL"
                    : Number(event.target.value),
              })
            }
            className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          >
            <option value="ALL">Todas las categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* ─── Filtro por estado ─── */}
        <div className="flex w-full flex-col gap-1.5 sm:max-w-[170px]">
          <label
            htmlFor="products-status-filter"
            className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
          >
            Estado
          </label>
          <select
            id="products-status-filter"
            value={filters.status}
            onChange={(event) =>
              onChange({
                ...filters,
                status: event.target.value as ProductFilters["status"],
              })
            }
            className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          >
            <option value="ALL">Todos los estados</option>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
        </div>

        {/* ─── Selector de Vista (Lista / Catalogo) + Conteo + Limpiar ─── */}
        <div className="flex items-center gap-3 sm:ml-auto">
          {/* Toggle de vistas */}
          <div className="flex items-center rounded-lg border border-white/10 bg-bg-primary p-1">
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              aria-label="Vista de lista"
              title="Vista de lista"
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-neon-primary/20 text-neon-primary shadow-[0_0_10px_rgba(0,240,255,0.25)]"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <ListIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Lista</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("catalog")}
              aria-label="Vista de catalogo"
              title="Vista de catalogo"
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "catalog"
                  ? "bg-neon-primary/20 text-neon-primary shadow-[0_0_10px_rgba(0,240,255,0.25)]"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <GridIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Catalogo</span>
            </button>
          </div>

          <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
            {resultCount} {resultCount === 1 ? "producto" : "productos"}
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
    </div>
  );
}
