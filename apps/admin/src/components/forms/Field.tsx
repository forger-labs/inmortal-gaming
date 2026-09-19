import type { FieldProps } from "@/types/forms";

export function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neon-primary/80"
      >
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="font-body text-xs text-neon-pink">
          {error}
        </p>
      )}
    </div>
  );
}
