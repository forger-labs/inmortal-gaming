import type { CancelButtonProps } from "@/types/forms";

export function CancelButton({
  label = "Cancelar",
  children,
  className = "",
  ...props
}: CancelButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-sm border border-white/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary active:scale-95 cursor-pointer ${className}`}
      {...props}
    >
      {children ?? label}
    </button>
  );
}
