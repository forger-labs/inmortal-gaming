"use client";

import { CloseIcon, GridIcon, ListIcon, SearchIcon } from "@shared/icons";
import type {
  ProductEntity,
  SubcategoryEntity,
  SubProductFilters,
} from "@shared/types";

import type { ProductViewMode } from "@/types/products";

interface SubproductsFilterBarProps {
  filters: SubProductFilters;
  onChange: (filters: SubProductFilters) => void;
  products: ProductEntity[];
  subcategories: SubcategoryEntity[];
  viewMode: ProductViewMode;
  onViewModeChange: (mode: ProductViewMode) => void;
  resultCount: number;
}

const hasActiveFilters = (filters: SubProductFilters) =>
  filters.search.trim() !== "" ||
  filters.product_id !== "ALL" ||
  filters.sub_category_id !== "ALL" ||
  filters.min_price !== "" ||
  filters.max_price !== "" ||
  filters.status !== "ALL";

const resetFilters = (): SubProductFilters => ({
  search: "",
  product_id: "ALL",
  sub_category_id: "ALL",
  min_price: "",
  max_price: "",
  status: "ALL",
});

export function SubproductsFilterBar({
  filters,
  onChange,
  products,
  subcategories,
  viewMode,
  onViewModeChange,
  resultCount,
}: SubproductsFilterBarProps) {
  const active = hasActiveFilters(filters);

  return (
    <div className="flex flex-col gap-4 border-b border-white/5 bg-bg-surface px-6 py-4">
      {/* ─── Fila Superior de Filtros ─── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-12 md:items-end">
        {/* Busqueda por nombre */}
        <div className="flex flex-col gap-1.5 md:col-span-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="subproducts-search"
              className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Buscar subproducto
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
              id="subproducts-search"
              type="search"
              placeholder="Buscar por nombre de subproducto..."
              value={filters.search}
              onChange={(event) =>
                onChange({ ...filters, search: event.target.value })
              }
              className="w-full rounded-md border border-white/10 bg-bg-primary py-2.5 pl-9 pr-3 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/50 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
            />
          </div>
        </div>

        {/* Filtro por Producto */}
        <div className="flex flex-col gap-1.5 md:col-span-3">
          <label
            htmlFor="subproducts-filter-product"
            className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
          >
            Producto Padre
          </label>
          <select
            id="subproducts-filter-product"
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
            className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          >
            <option value="ALL">Todos los productos</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Subcategoria */}
        <div className="flex flex-col gap-1.5 md:col-span-3">
          <label
            htmlFor="subproducts-filter-subcategory"
            className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
          >
            Subcategoria
          </label>
          <select
            id="subproducts-filter-subcategory"
            value={filters.sub_category_id}
            onChange={(event) =>
              onChange({
                ...filters,
                sub_category_id:
                  event.target.value === "ALL"
                    ? "ALL"
                    : Number(event.target.value),
              })
            }
            className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          >
            <option value="ALL">Todas las subcategorias</option>
            {subcategories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.subcategory_name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Estado */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label
            htmlFor="subproducts-filter-status"
            className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
          >
            Estado
          </label>
          <select
            id="subproducts-filter-status"
            value={filters.status}
            onChange={(event) =>
              onChange({
                ...filters,
                status: event.target.value as SubProductFilters["status"],
              })
            }
            className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          >
            <option value="ALL">Todos</option>
            <option value="ACTIVE">Activos</option>
            <option value="INACTIVE">Inactivos</option>
          </select>
        </div>
      </div>

      {/* ─── Fila Inferior: Rango de Precios y Controles de Vista ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/5 pt-3">
        {/* Rango de Precios */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Precio:
          </span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="0"
              placeholder="Min $"
              value={filters.min_price}
              onChange={(e) =>
                onChange({ ...filters, min_price: e.target.value })
              }
              aria-label="Precio minimo"
              className="w-24 rounded border border-white/10 bg-bg-primary px-2.5 py-1 font-mono text-xs text-text-primary placeholder:text-text-muted/50 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
            />
            <span className="text-text-muted">-</span>
            <input
              type="number"
              min="0"
              placeholder="Max $"
              value={filters.max_price}
              onChange={(e) =>
                onChange({ ...filters, max_price: e.target.value })
              }
              aria-label="Precio maximo"
              className="w-24 rounded border border-white/10 bg-bg-primary px-2.5 py-1 font-mono text-xs text-text-primary placeholder:text-text-muted/50 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
            />
          </div>

          {active && (
            <button
              type="button"
              onClick={() => onChange(resetFilters())}
              className="flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-text-secondary transition-colors hover:border-neon-pink/40 hover:text-neon-pink cursor-pointer ml-2"
            >
              <CloseIcon className="h-3 w-3" />
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Switcher de Vista y Contador de Resultados */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="font-mono text-xs text-text-muted">
            <strong className="text-neon-primary font-bold">
              {resultCount}
            </strong>{" "}
            subproductos
          </span>

          <div className="flex items-center rounded-md border border-white/10 bg-bg-primary p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              aria-pressed={viewMode === "list"}
              aria-label="Vista de lista"
              title="Vista en tabla"
              className={`rounded p-1.5 transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-neon-primary text-black shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("catalog")}
              aria-pressed={viewMode === "catalog"}
              aria-label="Vista de catalogo"
              title="Vista en cuadricula"
              className={`rounded p-1.5 transition-colors cursor-pointer ${
                viewMode === "catalog"
                  ? "bg-neon-primary text-black shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <GridIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
