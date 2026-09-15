import { ChevronLeftIcon, ChevronRightIcon } from "@shared/icons";

interface OrdersPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  disabled?: boolean;
}

export default function OrdersPagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: OrdersPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      {/* Pagina anterior */}
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-bg-surface text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Pagina anterior"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      {/* Numeros de pagina */}
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          disabled={disabled || p === page}
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg font-mono text-sm font-bold transition-all ${
            p === page
              ? "border border-neon-primary bg-neon-primary/20 text-neon-primary shadow-[0_0_15px_rgba(0,240,255,0.25)]"
              : "border border-white/10 bg-bg-surface text-text-secondary hover:border-white/30 hover:text-text-primary disabled:opacity-40"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Pagina siguiente */}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= totalPages}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-bg-surface text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Pagina siguiente"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
