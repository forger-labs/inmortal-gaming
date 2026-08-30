import type { CatalogSort } from "@/types";

interface CatalogToolbarProps {
  count: number;
  sortBy: CatalogSort;
  onSortChange: (sort: CatalogSort) => void;
  activeFilters: number;
  onClearFilters: () => void;
}

export function CatalogToolbar({
  count,
  sortBy,
  onSortChange,
  activeFilters,
  onClearFilters,
}: CatalogToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border-l border-neon-primary/20 bg-bg-surface p-4">
      <span className="font-mono text-sm text-text-secondary">
        {count} {count === 1 ? "producto" : "productos"}
      </span>

      {activeFilters > 0 && (
        <button
          type="button"
          onClick={onClearFilters}
          className="rounded-sm border border-neon-primary/30 px-3 py-1.5 font-mono text-xs text-neon-primary transition-colors hover:bg-neon-primary/10"
        >
          Filtros activos ({activeFilters}) · Limpiar
        </button>
      )}

      <div className="flex items-center gap-3">
        <label
          htmlFor="catalog-sort"
          className="font-body text-xs font-semibold uppercase text-text-muted"
        >
          Ordenar por:
        </label>
        <select
          id="catalog-sort"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as CatalogSort)}
          className="rounded border border-border-subtle bg-bg-surface-hover px-3 py-1.5 font-body text-sm text-text-secondary outline-none transition-colors focus:border-neon-primary focus:ring-1 focus:ring-neon-primary"
        >
          <option value="relevance">Relevancia</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
      </div>
    </div>
  );
}
