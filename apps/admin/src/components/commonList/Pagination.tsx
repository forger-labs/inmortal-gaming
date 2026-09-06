"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@shared/icons";

import type { PaginationProps } from "@/types/list";

function getPageItems(
  page: number,
  pageCount: number,
): (
  | { type: "page"; key: number; value: number }
  | { type: "gap"; key: string; value: "…" }
)[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => ({
      type: "page" as const,
      key: i + 1,
      value: i + 1,
    }));
  }

  const items: (
    | { type: "page"; key: number; value: number }
    | { type: "gap"; key: string; value: "…" }
  )[] = [{ type: "page", key: 1, value: 1 }];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);

  if (start > 2) items.push({ type: "gap", key: `gap-1-${start}`, value: "…" });
  for (let value = start; value <= end; value += 1) {
    items.push({ type: "page", key: value, value });
  }
  if (end < pageCount - 1) {
    items.push({ type: "gap", key: `gap-${end}-${pageCount}`, value: "…" });
  }
  items.push({ type: "page", key: pageCount, value: pageCount });

  return items;
}

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onChange,
  ariaLabel = "Paginacion",
}: PaginationProps) {
  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label={ariaLabel}
      className="flex flex-col items-center justify-between gap-3 border-t border-white/5 bg-bg-surface px-6 py-4 sm:flex-row"
    >
      <p className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
        Mostrando {from}–{to} de {total}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          aria-label="Pagina anterior"
          className="rounded-sm border border-white/10 p-2 text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-text-secondary cursor-pointer"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        {getPageItems(page, pageCount).map((item) =>
          item.type === "gap" ? (
            <span
              key={item.key}
              aria-hidden="true"
              className="px-1.5 font-mono text-xs text-text-muted"
            >
              …
            </span>
          ) : (
            <button
              type="button"
              key={item.key}
              onClick={() => onChange(item.value)}
              aria-current={item.value === page ? "page" : undefined}
              aria-label={`Pagina ${item.value}`}
              className={`min-w-9 rounded-sm border px-2 py-2 font-mono text-xs font-semibold transition-colors active:scale-90 cursor-pointer ${
                item.value === page
                  ? "border-neon-primary bg-neon-primary/10 text-neon-primary"
                  : "border-white/10 text-text-secondary hover:border-neon-primary/40 hover:text-text-primary"
              }`}
            >
              {item.value}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Pagina siguiente"
          className="rounded-sm border border-white/10 p-2 text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-text-secondary cursor-pointer"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
