import {
  ActivateIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DeactivateIcon,
  DeleteIcon,
  EditIcon,
} from "@shared/icons";
import type {
  CategoryEntity,
  LandingItemEntity,
  SubcategoryEntity,
} from "@shared/types";

const SORT_BY_LABELS: Record<string, string> = {
  mostSell: "Mas vendidos",
  newest: "Mas nuevos",
  oldest: "Mas antiguos",
  cheaper: "Menor precio",
  mostExpensive: "Mayor precio",
};

interface LandingRowProps {
  item: LandingItemEntity;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  categories: CategoryEntity[];
  subcategories: SubcategoryEntity[];
  onMoveUp: (item: LandingItemEntity) => void;
  onMoveDown: (item: LandingItemEntity) => void;
  onToggleStatus: (item: LandingItemEntity) => void;
  onEdit: (item: LandingItemEntity) => void;
  onDelete: (item: LandingItemEntity) => void;
}

export function LandingRow({
  item,
  index,
  isFirst,
  isLast,
  categories,
  subcategories,
  onMoveUp,
  onMoveDown,
  onToggleStatus,
  onEdit,
  onDelete,
}: LandingRowProps) {
  const isSubcategory = Boolean(item.sub_category_id);

  let targetName = "No especificado";
  if (isSubcategory) {
    const sub = subcategories.find((s) => s.id === item.sub_category_id);
    if (sub) {
      const parent = categories.find((c) => c.id === sub.category_id);
      targetName = parent
        ? `${sub.subcategory_name} (${parent.category_name})`
        : sub.subcategory_name;
    } else {
      targetName = `Subcategoria #${item.sub_category_id}`;
    }
  } else if (item.category_id) {
    const cat = categories.find((c) => c.id === item.category_id);
    targetName = cat ? cat.category_name : `Categoria #${item.category_id}`;
  }

  const sortByText = SORT_BY_LABELS[item.sort_by] ?? item.sort_by;

  return (
    <tr
      key={item.id}
      style={{ "--i": index } as React.CSSProperties}
      className="row-in group border-b border-white/5 transition-colors hover:bg-bg-primary/70"
    >
      {/* ─── Posicion / Orden con botones arriba/abajo ─── */}
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-1.5">
          <div className="flex flex-col">
            <button
              type="button"
              disabled={isFirst}
              onClick={() => onMoveUp(item)}
              aria-label={`Subir posicion de ${item.title}`}
              title="Mover arriba"
              className="rounded p-0.5 text-text-muted transition-colors hover:text-neon-primary disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
            >
              <ChevronUpIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={() => onMoveDown(item)}
              aria-label={`Bajar posicion de ${item.title}`}
              title="Mover abajo"
              className="rounded p-0.5 text-text-muted transition-colors hover:text-neon-primary disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
            >
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="flex h-6 min-w-6 items-center justify-center rounded border border-white/10 bg-bg-primary px-1.5 font-mono text-[11px] font-bold text-neon-primary">
            {item.order}
          </span>
        </div>
      </td>

      {/* ─── Titulo y descripcion ─── */}
      <td className="max-w-xs px-6 py-3.5">
        <div className="flex flex-col">
          <span className="truncate font-body text-sm font-semibold text-text-primary">
            {item.title}
          </span>
          <span className="line-clamp-1 font-body text-xs text-text-secondary">
            {item.description}
          </span>
        </div>
      </td>

      {/* ─── Tipo y Referencia ─── */}
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
              isSubcategory
                ? "border-neon-purple/40 bg-neon-purple/10 text-neon-purple"
                : "border-neon-primary/40 bg-neon-primary/10 text-neon-primary"
            }`}
          >
            {isSubcategory ? "Subcategoria" : "Categoria"}
          </span>
          <span className="truncate font-body text-xs text-text-primary">
            {targetName}
          </span>
        </div>
      </td>

      {/* ─── Cantidad de productos ─── */}
      <td className="px-6 py-3.5">
        <span className="font-mono text-xs font-semibold text-text-primary">
          {item.qt_products_show}{" "}
          <span className="font-normal text-text-muted">items</span>
        </span>
      </td>

      {/* ─── Ordenamiento ─── */}
      <td className="px-6 py-3.5">
        <span className="inline-flex items-center rounded-sm border border-white/10 bg-bg-surface px-2 py-0.5 font-mono text-[11px] text-text-secondary">
          {sortByText}
        </span>
      </td>

      {/* ─── Estado visible ─── */}
      <td className="px-6 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
            item.show
              ? "border-neon-green/30 bg-neon-green/10 text-neon-green"
              : "border-white/10 bg-white/5 text-text-muted"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              item.show
                ? "bg-neon-green shadow-[0_0_6px_#00ff88]"
                : "bg-text-muted"
            }`}
          />
          {item.show ? "Activo" : "Inactivo"}
        </span>
      </td>

      {/* ─── Acciones ─── */}
      <td className="px-6 py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          {/* Boton Activar / Desactivar */}
          <button
            type="button"
            onClick={() => onToggleStatus(item)}
            aria-label={
              item.show
                ? `Desactivar seccion ${item.title}`
                : `Activar seccion ${item.title}`
            }
            title={item.show ? "Desactivar" : "Activar"}
            className={`rounded-sm border p-2 transition-colors active:scale-90 cursor-pointer ${
              item.show
                ? "border-white/10 text-neon-green hover:border-neon-amber/50 hover:text-neon-amber"
                : "border-white/10 text-text-muted hover:border-neon-green/50 hover:text-neon-green"
            }`}
          >
            {item.show ? (
              <DeactivateIcon className="h-4 w-4" />
            ) : (
              <ActivateIcon className="h-4 w-4" />
            )}
          </button>

          {/* Boton Editar */}
          <button
            type="button"
            onClick={() => onEdit(item)}
            aria-label={`Editar seccion ${item.title}`}
            title="Editar seccion"
            className="rounded-sm border border-white/10 p-2 text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary active:scale-90 cursor-pointer"
          >
            <EditIcon className="h-4 w-4" />
          </button>

          {/* Boton Eliminar */}
          <button
            type="button"
            onClick={() => onDelete(item)}
            aria-label={`Eliminar seccion ${item.title}`}
            title="Eliminar de landing"
            className="rounded-sm border border-white/10 p-2 text-text-muted transition-colors hover:border-neon-pink hover:text-neon-pink active:scale-90 cursor-pointer"
          >
            <DeleteIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
