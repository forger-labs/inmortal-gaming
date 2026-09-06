import type { ListHeaderProps } from "@/types/list";

export function ListHeader({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
  children,
}: ListHeaderProps) {
  return (
    <header className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="font-display text-3xl font-semibold text-text-primary">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-neon-primary">
            {subtitle}
          </p>
        )}
      </div>

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="btn-neon-primary flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-bg-primary transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95 cursor-pointer"
        >
          {actionIcon}
          {actionLabel}
        </button>
      ) : (
        children
      )}
    </header>
  );
}
