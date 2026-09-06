import { DeleteIcon, EditIcon } from "@shared/icons";
import type { CategoryEntity } from "@shared/types";

export function CategoriesRow({
  category,
  onEdit,
  onDelete,
  index,
}: {
  index: number;
  category: CategoryEntity;
  onEdit: (category: CategoryEntity) => void;
  onDelete: (category: CategoryEntity) => void;
}) {
  return (
    <tr
      key={category.id}
      style={{ "--i": index } as React.CSSProperties}
      className="row-in group border-b border-white/5 transition-colors hover:bg-bg-primary/70"
    >
      <td className="px-6 py-3.5">
        <span className="font-mono text-xs font-semibold text-text-muted">
          #{String(category.id).padStart(3, "0")}
        </span>
      </td>
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-neon-purple/30 bg-neon-purple/10 font-mono text-xs font-bold text-neon-purple">
            {category.category_name.slice(0, 2).toUpperCase()}
          </span>
          <span className="font-body text-sm font-medium text-text-primary">
            {category.category_name}
          </span>
        </div>
      </td>
      <td className="px-6 py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(category)}
            aria-label={`Editar categoria ${category.category_name}`}
            className="rounded-sm border border-white/10 p-2 text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary active:scale-90 cursor-pointer"
          >
            <EditIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(category)}
            aria-label={`Eliminar categoria ${category.category_name}`}
            className="rounded-sm border border-white/10 p-2 text-text-muted transition-colors hover:border-neon-pink hover:text-neon-pink active:scale-90 cursor-pointer"
          >
            <DeleteIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
