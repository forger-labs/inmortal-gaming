import { DeleteIcon, EditIcon } from "@shared/icons";
import type { SubcategoryEntity } from "@shared/types";

interface SubcategoriesRowProps {
  index: number;
  subcategory: SubcategoryEntity;
  categoryName: string;
  onEdit: (subcategory: SubcategoryEntity) => void;
  onDelete: (subcategory: SubcategoryEntity) => void;
}

export function SubcategoriesRow({
  subcategory,
  categoryName,
  onEdit,
  onDelete,
  index,
}: SubcategoriesRowProps) {
  const shapeEntries = Object.entries(subcategory.json_shape || {});

  return (
    <tr
      key={subcategory.id}
      style={{ "--i": index } as React.CSSProperties}
      className="row-in group border-b border-white/5 transition-colors hover:bg-bg-primary/70"
    >
      <td className="px-6 py-3.5">
        <span className="font-mono text-xs font-semibold text-text-muted">
          #{String(subcategory.id).padStart(3, "0")}
        </span>
      </td>
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-neon-primary/30 bg-neon-primary/10 font-mono text-xs font-bold text-neon-primary">
            {subcategory.subcategory_name.slice(0, 2).toUpperCase()}
          </span>
          <span className="font-body text-sm font-medium text-text-primary">
            {subcategory.subcategory_name}
          </span>
        </div>
      </td>
      <td className="px-6 py-3.5">
        <span className="inline-flex items-center rounded border border-neon-purple/30 bg-neon-purple/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-neon-purple">
          {categoryName || `Categoria #${subcategory.category_id}`}
        </span>
      </td>
      <td className="px-6 py-3.5">
        <div className="flex flex-wrap items-center gap-1.5 max-w-xs sm:max-w-md">
          {shapeEntries.length === 0 ? (
            <span className="font-mono text-xs text-text-muted">
              Sin campos
            </span>
          ) : (
            shapeEntries.slice(0, 3).map(([key, config]) => {
              const fieldType =
                typeof config === "object" && config !== null
                  ? (config as { field_type?: string }).field_type || "campo"
                  : String(config);
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 rounded bg-bg-primary border border-white/10 px-2 py-0.5 font-mono text-[11px] text-text-secondary"
                >
                  <span className="text-text-primary">{key}:</span>
                  <span className="text-neon-primary/90">{fieldType}</span>
                </span>
              );
            })
          )}
          {shapeEntries.length > 3 && (
            <span className="inline-flex items-center rounded bg-white/5 border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
              +{shapeEntries.length - 3} mas
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(subcategory)}
            aria-label={`Editar subcategoria ${subcategory.subcategory_name}`}
            className="rounded-sm border border-white/10 p-2 text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary active:scale-90 cursor-pointer"
          >
            <EditIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(subcategory)}
            aria-label={`Eliminar subcategoria ${subcategory.subcategory_name}`}
            className="rounded-sm border border-white/10 p-2 text-text-muted transition-colors hover:border-neon-pink hover:text-neon-pink active:scale-90 cursor-pointer"
          >
            <DeleteIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
