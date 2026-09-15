import { ShieldCheckIcon } from "@shared/icons";
import type { UserMeDTO } from "@shared/types";

interface ProfileSummaryCardProps {
  user: UserMeDTO;
}

export default function ProfileSummaryCard({ user }: ProfileSummaryCardProps) {
  const initials =
    user.name && user.last_name
      ? `${user.name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
      : user.username?.slice(0, 2).toUpperCase() || "IG";

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-white/10 bg-bg-surface/80 p-6 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {/* Avatar & Identidad */}
      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-neon-primary/40 bg-bg-elevated font-display text-xl font-bold text-neon-primary shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          {initials}
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-neon-green border-2 border-bg-surface" />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-display text-lg font-bold text-text-primary">
            {user.name} {user.last_name}
          </span>
          <span className="truncate font-mono text-xs text-neon-primary">
            @{user.username}
          </span>
          <span className="mt-1 inline-flex w-fit items-center gap-1 rounded border border-white/10 bg-bg-primary/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-secondary">
            <ShieldCheckIcon className="h-3 w-3 text-neon-green" />
            {user.role || "USER"}
          </span>
        </div>
      </div>

      {/* Detalle rapido */}
      <div className="flex flex-col gap-3 border-t border-white/5 pt-4 text-xs font-mono">
        <div className="flex items-center justify-between">
          <span className="text-text-muted">ID DE USUARIO</span>
          <span className="text-text-secondary">#{user.id}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-muted">ESTADO</span>
          <span className="text-neon-green font-semibold">ACTIVO</span>
        </div>
        {/*<div className="flex items-center justify-between">
          <span className="text-text-muted">NIVEL DE CUENTA</span>
          <span className="text-neon-primary font-semibold">OPERADOR</span>
        </div>*/}
      </div>

      {/* Banner decorativo cyberpunk */}
      <div className="rounded-lg border border-neon-primary/20 bg-neon-primary/5 p-3 text-xs text-text-secondary">
        <p className="font-body leading-relaxed">
          Mantener los datos actualizados garantiza la correcta entrega de tus
          compras y el soporte directo en nuestros canales de atencion.
        </p>
      </div>
    </div>
  );
}
