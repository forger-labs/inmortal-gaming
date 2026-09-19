"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@shared/icons";

interface PaginationBarProps {
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  availableLimits?: number[];
}

export function PaginationBar({
  page,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onLimitChange,
  availableLimits = [6, 12, 18, 20],
}: PaginationBarProps) {
  if (totalItems <= 0) return null;

  // Generate visible page numbers
  const pages: number[] = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-border-subtle bg-bg-surface p-4 sm:flex-row">
      {/* Total Count and Limit Select */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-text-secondary">
          Mostrando{" "}
          <strong className="text-text-primary">
            {(page - 1) * limit + 1}
          </strong>{" "}
          -{" "}
          <strong className="text-text-primary">
            {Math.min(page * limit, totalItems)}
          </strong>{" "}
          de <strong className="text-neon-primary">{totalItems}</strong>{" "}
          resultados
        </span>

        <div className="flex items-center gap-2">
          <label
            htmlFor="pagination-limit-select"
            className="font-mono text-xs text-text-muted"
          >
            Por página:
          </label>
          <select
            id="pagination-limit-select"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded border border-border-subtle bg-bg-primary px-2.5 py-1 font-mono text-xs text-text-primary outline-none transition-colors focus:border-neon-primary focus:ring-1 focus:ring-neon-primary"
          >
            {availableLimits.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Previous Page */}
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex h-9 w-9 items-center justify-center rounded border border-border-subtle bg-bg-primary text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Página anterior"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        {pages.map((p) => {
          const isCurrent = p === page;

          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`flex h-9 min-w-[36px] items-center justify-center rounded px-2 font-mono text-xs font-bold transition-all ${
                isCurrent
                  ? "bg-neon-primary text-bg-primary shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                  : "border border-border-subtle bg-bg-primary text-text-secondary hover:border-neon-primary hover:text-neon-primary"
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* Next Page */}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex h-9 w-9 items-center justify-center rounded border border-border-subtle bg-bg-primary text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Página siguiente"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
