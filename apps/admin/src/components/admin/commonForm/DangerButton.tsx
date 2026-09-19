import type { DangerButtonProps } from "@/types/forms";

export function DangerButton({
  submitting = false,
  loadingLabel = "Eliminando...",
  label = "Eliminar",
  disabled,
  children,
  className = "",
  ...props
}: DangerButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || submitting}
      className={`flex items-center justify-center gap-2 rounded-sm border border-neon-pink/50 bg-neon-pink px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-neon-pink/90 hover:shadow-[0_0_20px_rgba(255,45,123,0.4)] active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children ?? (submitting ? loadingLabel : label)}
    </button>
  );
}
