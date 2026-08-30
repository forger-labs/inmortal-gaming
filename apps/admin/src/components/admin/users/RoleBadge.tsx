import type { AdminUserRole } from "@shared/types";

const ROLE_LABELS: Record<AdminUserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
};

export function RoleBadge({ role }: { role: AdminUserRole }) {
  const isSuper = role === "SUPER_ADMIN";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider ${
        isSuper
          ? "border-neon-primary/30 bg-neon-primary/10 text-neon-primary"
          : "border-neon-purple/30 bg-neon-purple/15 text-text-primary"
      }`}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
