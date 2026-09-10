"use client";

import { CloseIcon, SearchIcon } from "@shared/icons";
import type { CategoryEntity, LandingFilters } from "@shared/types";

interface LandingFilterBarProps {
  filters: LandingFilters;
  onChange: (filters: LandingFilters) => void;
  categories: CategoryEntity[];
  resultCount: number;
}

const hasActiveFilters = (filters: LandingFilters) =>
  filters.search.trim() !== "" ||
  filters.status !== "ALL" ||
  filters.type !== "ALL" ||
  filters.category_id !== "ALL";

const resetFilters = (): LandingFilters => ({
  search: "",
  status: "ALL",
  type: "ALL",
  category_id: "ALL",
});

export function LandingFilterBar({
  filters,
  onChange,
  categories,
  resultCount,
}: LandingFilterBarProps) {
  const active = hasActiveFilters(filters);

  return (
    <div className="flex flex-col gap-3 border-b border-white/5 bg-bg-surface px-6 py-4 lg:flex-row lg:items-end lg:gap-4">
      {/* ─── Busqueda por texto ─── */}
      <div className="flex w-full flex-col gap-1.5 lg:max-w-xs">
        <div className="flex items-center justify-between">
          <label
            htmlFor="landing-search"
            className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
          >
            Buscar seccion
          </label>
          <span className="font-mono text-[10px] text-text-muted">
            Titulo / Descripcion
          </span>
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            id="landing-search"
            type="search"
            placeholder="Buscar seccion en landing..."
            value={filters.search}
            onChange={(event) =>
              onChange({ ...filters, search: event.target.value })
            }
            className="w-full rounded-md border border-white/10 bg-bg-primary py-2.5 pl-9 pr-3 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/50 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          />
        </div>
      </div>

      {/* ─── Filtro por Estado (Activo / Inactivo) ─── */}
      <div className="flex w-full flex-col gap-1.5 sm:w-44">
        <label
          htmlFor="landing-status-filter"
          className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
        >
          Estado
        </label>
        <select
          id="landing-status-filter"
          value={filters.status}
          onChange={(event) =>
            onChange({
              ...filters,
              status: event.target.value as LandingFilters["status"],
            })
          }
          className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
        >
          <option value="ALL">Todos los estados</option>
          <option value="ACTIVE">Solo activos</option>
          <option value="INACTIVE">Solo inactivos</option>
        </select>
      </div>

      {/* ─── Filtro por Tipo (Categoria / Subcategoria) ─── */}
      <div className="flex w-full flex-col gap-1.5 sm:w-44">
        <label
          htmlFor="landing-type-filter"
          className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
        >
          Tipo de seccion
        </label>
        <select
          id="landing-type-filter"
          value={filters.type}
          onChange={(event) =>
            onChange({
              ...filters,
              type: event.target.value as LandingFilters["type"],
            })
          }
          className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3.5 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
        >
          <option value="ALL">Todas las secciones</option>
          <option value="CATEGORY">Categorias</option>
          <option value="SUBCATEGORY">Subcategorias</option>
        </select>
      </div>

      {/* ─── Filtro por Categoria ─── */}
      <div className="flex w-full flex-col gap-1.5 sm:w-48">
        <label
          htmlFor="landing-category-filter"
          className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
        >
          Categoria relacionada
        </label>
        <select
          id="landing-category-filter"
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

      {/* ─── Resumen + Limpiar ─── */}
      <div className="flex items-center gap-3 lg:ml-auto">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
          {resultCount} {resultCount === 1 ? "seccion" : "secciones"}
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
