import type { FormSubmitButtonProps } from "@/types/forms";

export function FormSubmitButton({
  submitting = false,
  isEdit = false,
  loadingLabel = "Guardando...",
  createLabel = "Crear",
  editLabel = "Guardar cambios",
  disabled,
  children,
  className = "",
  ...props
}: FormSubmitButtonProps) {
  const content =
    children ?? (submitting ? loadingLabel : isEdit ? editLabel : createLabel);

  return (
    <button
      type="submit"
      disabled={disabled || submitting}
      className={`btn-neon-primary flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-bg-primary transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {content}
    </button>
  );
}
