import type { AdminUserStatus } from "@shared/types";

const STATUS_LABELS: Record<AdminUserStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
};

export function StatusBadge({ status }: { status: AdminUserStatus }) {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 ${
        isActive
          ? "border-neon-green/30 bg-neon-green/10 text-neon-green"
          : "border-white/10 bg-white/5 text-text-secondary"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-neon-green" : "bg-text-muted"
        }`}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
