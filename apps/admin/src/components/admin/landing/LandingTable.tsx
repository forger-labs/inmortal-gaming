"use client";

import type {
  CategoryEntity,
  LandingItemEntity,
  SubcategoryEntity,
} from "@shared/types";

import { TableEmptyState } from "@/components/commonList/TableEmptyState";
import { LandingRow } from "./LandingRow";
import { LandingTableSkeleton } from "./LandingTableSkeleton";

interface LandingTableProps {
  items: LandingItemEntity[];
  categories: CategoryEntity[];
  subcategories: SubcategoryEntity[];
  loading?: boolean;
  onMoveUp: (item: LandingItemEntity) => void;
  onMoveDown: (item: LandingItemEntity) => void;
  onToggleStatus: (item: LandingItemEntity) => void;
  onEdit: (item: LandingItemEntity) => void;
  onDelete: (item: LandingItemEntity) => void;
}

export function LandingTable({
  items,
  categories,
  subcategories,
  loading = false,
  onMoveUp,
  onMoveDown,
  onToggleStatus,
  onEdit,
  onDelete,
}: LandingTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-neon-primary/20 bg-bg-primary">
            <th
              scope="col"
              className="w-24 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Orden
            </th>
            <th
              scope="col"
              className="px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Titulo / Descripcion
            </th>
            <th
              scope="col"
              className="px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Elemento referenciado
            </th>
            <th
              scope="col"
              className="w-28 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Cantidad
            </th>
            <th
              scope="col"
              className="w-36 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Ordenamiento
            </th>
            <th
              scope="col"
              className="w-28 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Estado
            </th>
            <th
              scope="col"
              className="w-44 px-6 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <LandingTableSkeleton />
          ) : items.length === 0 ? (
            <TableEmptyState
              colSpan={7}
              title="Sin secciones configuradas"
              description="No se encontraron elementos de landing page que coincidan con los filtros aplicados. Anade una nueva seccion para mostrar en la pagina principal."
            />
          ) : (
            items.map((item, index) => (
              <LandingRow
                key={item.id}
                item={item}
                index={index}
                isFirst={index === 0}
                isLast={index === items.length - 1}
                categories={categories}
                subcategories={subcategories}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onToggleStatus={onToggleStatus}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
