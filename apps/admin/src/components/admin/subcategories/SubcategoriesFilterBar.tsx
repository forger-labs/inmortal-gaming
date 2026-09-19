"use client";

import { CloseIcon, SearchIcon } from "@shared/icons";
import type { CategoryEntity, SubcategoryFilters } from "@shared/types";

interface SubcategoriesFilterBarProps {
  filters: SubcategoryFilters;
  onChange: (filters: SubcategoryFilters) => void;
  categories: CategoryEntity[];
  resultCount: number;
}

const hasActiveFilters = (filters: SubcategoryFilters) =>
  filters.search.trim() !== "" || filters.category_id !== "ALL";

const resetFilters = (): SubcategoryFilters => ({
  search: "",
  category_id: "ALL",
});

export function SubcategoriesFilterBar({
  filters,
  onChange,
  categories,
  resultCount,
}: SubcategoriesFilterBarProps) {
  const active = hasActiveFilters(filters);

  return (
    <div className="flex flex-col gap-3 border-b border-white/5 bg-bg-surface px-6 py-4 sm:flex-row sm:items-end sm:gap-4">
      {/* ─── Busqueda por nombre de subcategoria ─── */}
      <div className="flex w-full flex-col gap-1.5 sm:max-w-xs">
        <div className="flex items-center justify-between">
          <label
            htmlFor="subcategories-search"
            className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
          >
            Buscar subcategoria
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
            id="subcategories-search"
            type="search"
            placeholder="Buscar por subcategoria..."
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
          htmlFor="subcategories-category-filter"
          className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
        >
          Filtrar por categoria
        </label>
        <select
          id="subcategories-category-filter"
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

      {/* ─── Resumen + limpiar ─── */}
      <div className="flex items-center gap-3 sm:ml-auto">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
          {resultCount} {resultCount === 1 ? "subcategoria" : "subcategorias"}
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
