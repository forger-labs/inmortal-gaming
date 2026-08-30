"use client";

import type { ProductCategory, StockStatus } from "@/types";

interface CategoryOption {
  id: ProductCategory;
  label: string;
  color: string;
}

interface StatusOption {
  id: StockStatus;
  label: string;
  active: string;
  idle: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { id: "game-items", label: "Ítems de juego", color: "text-neon-purple" },
  {
    id: "virtual-currency",
    label: "Monedas virtuales",
    color: "text-neon-pink",
  },
  { id: "gift-cards", label: "Gift cards", color: "text-neon-green" },
  {
    id: "digital-services",
    label: "Servicios digitales",
    color: "text-neon-amber",
  },
];

const STATUS_OPTIONS: StatusOption[] = [
  {
    id: "available",
    label: "Disponible",
    active: "border-neon-green text-neon-green bg-neon-green/10",
    idle: "border-border-subtle text-text-secondary bg-bg-surface-hover hover:border-neon-green hover:text-neon-green",
  },
  {
    id: "low",
    label: "Poco stock",
    active: "border-neon-amber text-neon-amber bg-neon-amber/10",
    idle: "border-border-subtle text-text-secondary bg-bg-surface-hover hover:border-neon-amber hover:text-neon-amber",
  },
  {
    id: "out-of-stock",
    label: "Agotado",
    active: "border-text-muted text-text-muted bg-bg-surface-hover",
    idle: "border-border-subtle text-text-secondary bg-bg-surface-hover hover:border-text-muted hover:text-text-primary",
  },
];

interface FiltersProps {
  selectedCategories: ProductCategory[];
  onToggleCategory: (category: ProductCategory) => void;
  selectedStatus: StockStatus[];
  onToggleStatus: (status: StockStatus) => void;
  categoryCounts: Record<ProductCategory, number>;
}

export function Filters({
  selectedCategories,
  onToggleCategory,
  selectedStatus,
  onToggleStatus,
  categoryCounts,
}: FiltersProps) {
  return (
    <aside className="w-full">
      <div className="rounded-lg border-l border-neon-primary/30 bg-bg-surface p-6">
        {/* Header */}
        <h2 className="mb-6 border-b border-border-subtle pb-2 font-display text-lg font-semibold uppercase tracking-wide text-neon-primary">
          Filtros
        </h2>

        {/* Category group */}
        <div className="mb-6">
          <h3 className="mb-3 font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
            Categoría
          </h3>
          <ul className="space-y-2">
            {CATEGORY_OPTIONS.map((category) => {
              const checked = selectedCategories.includes(category.id);
              return (
                <li key={category.id}>
                  <label className="flex cursor-pointer items-center justify-between gap-2 font-body text-sm text-text-secondary transition-colors hover:text-neon-primary">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleCategory(category.id)}
                        className="h-4 w-4 rounded border-border-subtle bg-bg-surface-hover accent-neon-primary focus:ring-neon-primary"
                      />
                      {category.label}
                    </span>
                    <span className={`font-mono text-xs ${category.color}`}>
                      {categoryCounts[category.id] ?? 0}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Status group */}
        <div>
          <h3 className="mb-3 font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
            Estado
          </h3>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((status) => {
              const active = selectedStatus.includes(status.id);
              return (
                <button
                  key={status.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggleStatus(status.id)}
                  className={`rounded-sm border px-2 py-1 font-mono text-xs transition-colors ${
                    active ? status.active : status.idle
                  }`}
                >
                  {status.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
