"use client";

import type { CategoryEntity } from "@shared/types";

import { TableEmptyState } from "@/components/commonList/TableEmptyState";
import { CategoriesRow } from "./CategoriesRow";
import { CategoriesTableSkeleton } from "./CategoriesTableSkeleton";

interface CategoriesTableProps {
  categories: CategoryEntity[];
  loading?: boolean;
  onEdit: (category: CategoryEntity) => void;
  onDelete: (category: CategoryEntity) => void;
}

export function CategoriesTable({
  categories,
  loading = false,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-160 border-collapse text-left">
        <thead>
          <tr className="border-b border-neon-primary/20 bg-bg-primary">
            <th
              scope="col"
              className="w-24 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Nombre de categoria
            </th>
            <th
              scope="col"
              className="w-36 px-6 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <CategoriesTableSkeleton />
          ) : categories.length === 0 ? (
            <TableEmptyState
              colSpan={3}
              title="Sin resultados"
              description="No se encontraron categorias registradas o que coincidan con el filtro. Prueba con otro termino o crea una nueva categoria."
            />
          ) : (
            categories.map((category, index) => (
              <CategoriesRow
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                category={category}
                key={category.id}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
