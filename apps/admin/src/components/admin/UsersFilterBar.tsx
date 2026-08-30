"use client";

import { CloseIcon, SearchIcon } from "@shared/icons";
import type {
  AdminUserFilters,
  AdminUserRole,
  AdminUserStatus,
} from "@shared/types";

interface UsersFilterBarProps {
  filters: AdminUserFilters;
  onChange: (filters: AdminUserFilters) => void;
  resultCount: number;
}

const hasActiveFilters = (filters: AdminUserFilters) =>
  filters.search.trim() !== "" ||
  filters.role !== "all" ||
  filters.status !== "all";

const resetFilters = (): AdminUserFilters => ({
  search: "",
  role: "all",
  status: "all",
});

export function UsersFilterBar({
  filters,
  onChange,
  resultCount,
}: UsersFilterBarProps) {
  const active = hasActiveFilters(filters);

  return (
    <div className="flex flex-col gap-3 border-b border-white/5 bg-bg-surface px-6 py-4 lg:flex-row lg:items-end lg:gap-4">
      {/* ─── Búsqueda por nombre / usuario / apellido ─── */}
      <div className="flex w-full flex-col gap-1.5 lg:max-w-xs">
        <label
          htmlFor="users-search"
          className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
        >
          Buscar
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            id="users-search"
            type="search"
            placeholder="Nombre, usuario o apellido"
            value={filters.search}
            onChange={(event) =>
              onChange({ ...filters, search: event.target.value })
            }
            className="w-full rounded-md border border-white/10 bg-bg-primary py-2.5 pl-9 pr-3 font-body text-sm text-text-primary transition-all placeholder:text-text-muted/50 focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary"
          />
        </div>
      </div>

      {/* ─── Filtro rol ─── */}
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
          <option value="all">Todos</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* ─── Filtro estado ─── */}
      <div className="flex w-full flex-col gap-1.5 sm:w-auto">
        <label
          htmlFor="users-status"
          className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
        >
          Estado
        </label>
        <select
          id="users-status"
          value={filters.status}
          onChange={(event) =>
            onChange({
              ...filters,
              status: event.target.value as AdminUserStatus | "all",
            })
          }
          className="w-full cursor-pointer rounded-md border border-white/10 bg-bg-primary px-3 py-2.5 font-body text-sm text-text-primary transition-all focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary sm:w-40"
        >
          <option value="all">Todos</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
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
