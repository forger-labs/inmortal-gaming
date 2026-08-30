import { ActivateIcon, DeactivateIcon, EditIcon } from "@shared/icons";
import type { AdminUser } from "@shared/types";

import { RoleBadge } from "./RoleBadge";
import { StatusBadge } from "./StatustBadge";

export function UsersRow({
  user,
  onEdit,
  onToggleStatus,
  index,
}: {
  index: number;
  user: AdminUser;
  onEdit: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
}) {
  return (
    <tr
      key={user.id}
      style={{ "--i": index } as React.CSSProperties}
      className="row-in group border-b border-white/5 transition-colors hover:bg-bg-primary/70"
    >
      <td className="px-6 py-3.5">
        <span className="font-mono text-sm text-neon-primary">
          @{user.username}
        </span>
      </td>
      <td className="px-6 py-3.5 font-body text-sm text-text-primary">
        {user.name}
      </td>
      <td className="px-6 py-3.5 font-body text-sm text-text-primary">
        {user.lastname}
      </td>
      <td className="px-6 py-3.5">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-6 py-3.5">
        <StatusBadge status={user.status} />
      </td>
      <td className="px-6 py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(user)}
            aria-label={`Editar a ${user.name} ${user.lastname}`}
            className="rounded-sm border border-white/10 p-2 text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary active:scale-90 cursor-pointer"
          >
            <EditIcon className="h-4 w-4" />
          </button>

          {user.status === "active" ? (
            <button
              type="button"
              onClick={() => onToggleStatus(user)}
              aria-label={`Desactivar a ${user.name} ${user.lastname}`}
              className="rounded-sm border border-white/10 p-2 text-neon-pink/80 transition-colors hover:border-neon-pink hover:text-neon-pink active:scale-90 cursor-pointer"
            >
              <DeactivateIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onToggleStatus(user)}
              aria-label={`Activar a ${user.name} ${user.lastname}`}
              className="rounded-sm border border-white/10 p-2 text-neon-green/80 transition-colors hover:border-neon-green hover:text-neon-green active:scale-90 cursor-pointer"
            >
              <ActivateIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
