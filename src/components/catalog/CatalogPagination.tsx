import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

const PAGES = [1, 2, 3];

export function CatalogPagination() {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {/* Previous */}
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded border border-border-subtle bg-bg-surface text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary"
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      {/* Page numbers */}
      {PAGES.map((page) => (
        <button
          key={page}
          type="button"
          className={`flex h-10 w-10 items-center justify-center rounded font-mono text-sm font-bold transition-colors ${
            page === 1
              ? "bg-neon-primary text-bg-primary"
              : "border border-border-subtle bg-bg-surface text-text-secondary hover:border-neon-primary hover:text-neon-primary"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded border border-border-subtle bg-bg-surface text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary"
        aria-label="Next page"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
