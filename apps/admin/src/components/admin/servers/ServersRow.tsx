import { DeleteIcon, EditIcon, ServerIcon } from "@shared/icons";
import type { ServerEntity } from "@shared/types";

interface ServersRowProps {
  index: number;
  server: ServerEntity;
  productName: string;
  onEdit: (server: ServerEntity) => void;
  onDelete: (server: ServerEntity) => void;
}

export function ServersRow({
  server,
  productName,
  onEdit,
  onDelete,
  index,
}: ServersRowProps) {
  return (
    <tr
      key={server.id}
      style={{ "--i": index } as React.CSSProperties}
      className="row-in group border-b border-white/5 transition-colors hover:bg-bg-primary/70"
    >
      <td className="px-6 py-3.5">
        <span className="font-mono text-xs font-semibold text-text-muted">
          #{String(server.id).padStart(3, "0")}
        </span>
      </td>
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-neon-primary/30 bg-neon-primary/10 font-mono text-xs font-bold text-neon-primary">
            <ServerIcon className="h-4 w-4" />
          </span>
          <span className="font-body text-sm font-medium text-text-primary">
            {server.server_name}
          </span>
        </div>
      </td>
      <td className="px-6 py-3.5">
        <span className="inline-flex items-center rounded border border-neon-purple/30 bg-neon-purple/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-neon-purple">
          {productName || `Producto #${server.product_id}`}
        </span>
      </td>
      <td className="px-6 py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(server)}
            aria-label={`Editar servidor ${server.server_name}`}
            className="rounded-sm border border-white/10 p-2 text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary active:scale-90 cursor-pointer"
          >
            <EditIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(server)}
            aria-label={`Eliminar servidor ${server.server_name}`}
            className="rounded-sm border border-white/10 p-2 text-text-muted transition-colors hover:border-neon-pink hover:text-neon-pink active:scale-90 cursor-pointer"
          >
            <DeleteIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
