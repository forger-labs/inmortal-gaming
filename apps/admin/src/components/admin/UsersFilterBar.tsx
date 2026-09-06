"use client";

import { CloseIcon, SearchIcon } from "@shared/icons";
import type { AdminUserFilters, AdminUserRole } from "@shared/types";

interface UsersFilterBarProps {
  filters: AdminUserFilters;
  onChange: (filters: AdminUserFilters) => void;
  resultCount: number;
}

const hasActiveFilters = (filters: AdminUserFilters) =>
  filters.search.trim() !== "" || filters.role !== "all";

const resetFilters = (): AdminUserFilters => ({
  search: "",
  role: "all",
});

export function UsersFilterBar({
  filters,
  onChange,
  resultCount,
}: UsersFilterBarProps) {
  const active = hasActiveFilters(filters);

  return (
    <div className="flex flex-col gap-3 border-b border-white/5 bg-bg-surface px-6 py-4 lg:flex-row lg:items-end lg:gap-4">
      {/* ─── Búsqueda por nombre o correo (placeholder) ─── */}
      <div className="flex w-full flex-col gap-1.5 lg:max-w-sm">
        <div className="flex items-center justify-between">
          <label
            htmlFor="users-search"
            className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
          >
            Buscar
          </label>
          <span className="font-mono text-[10px] text-text-muted">
            Filtro local
          </span>
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            id="users-search"
            type="search"
            placeholder="Buscar por nombre o correo..."
            value={filters.search}
            onChange={(event) =>
              onChange({ ...filters, search: event.target.value })
            }
            className="w-full rounded-md border border-white/10 bg-bg-primary py-2.5 pl-9 pr-3 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/50 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          />
        </div>
      </div>

      {/* ─── Filtro por rol (placeholder) ─── */}
      <div className="flex w-full flex-col gap-1.5 sm:w-auto">
        <label
          htmlFor="users-role"
          className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
        >
          Rol
        </label>
        <select
          id="users-role"
          value={filters.role}
          onChange={(event) =>
            onChange({
              ...filters,
              role: event.target.value as AdminUserRole | "all",
            })
          }
          className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary sm:w-44"
        >
          <option value="all">Todos los roles</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* ─── Resumen + limpiar ─── */}
      <div className="ml-auto flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
          {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
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
