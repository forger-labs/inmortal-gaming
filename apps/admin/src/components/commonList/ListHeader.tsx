import type { ListHeaderProps } from "@/types/list";

export function ListHeader({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
  actionDisabled = false,
  children,
  className = "",
}: ListHeaderProps) {
  const hasAction = Boolean(actionLabel && onAction);

  return (
    <header
      className={`mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end ${className}`}
    >
      {/* ─── Titulo y subtitulo ─── */}
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl [text-wrap:balance]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-wider text-neon-primary/90">
            <span
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-neon-primary shadow-[0_0_8px_#00f0ff]"
              aria-hidden="true"
            />
            <span className="truncate">{subtitle}</span>
          </p>
        )}
      </div>

      {/* ─── Acciones y elementos complementarios ─── */}
      {(hasAction || children) && (
        <div className="flex w-full shrink-0 flex-wrap items-center gap-2.5 sm:w-auto sm:justify-end">
          {children}

          {hasAction && (
            <button
              type="button"
              onClick={onAction}
              disabled={actionDisabled}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-sm border border-neon-primary/50 bg-neon-primary px-5 font-mono text-xs font-semibold uppercase tracking-wider text-bg-primary shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all duration-150 hover:scale-[1.02] hover:bg-neon-primary/90 hover:shadow-[0_0_24px_rgba(0,240,255,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none sm:h-10 sm:w-auto cursor-pointer motion-reduce:transition-none motion-reduce:transform-none"
            >
              {actionIcon && (
                <span className="shrink-0" aria-hidden="true">
                  {actionIcon}
                </span>
              )}
              <span>{actionLabel}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
