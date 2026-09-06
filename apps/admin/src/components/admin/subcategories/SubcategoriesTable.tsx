"use client";

import type { CategoryEntity, SubcategoryEntity } from "@shared/types";

import { TableEmptyState } from "@/components/commonList/TableEmptyState";
import { SubcategoriesRow } from "./SubcategoriesRow";
import { SubcategoriesTableSkeleton } from "./SubcategoriesTableSkeleton";

interface SubcategoriesTableProps {
  subcategories: SubcategoryEntity[];
  categories: CategoryEntity[];
  loading?: boolean;
  onEdit: (subcategory: SubcategoryEntity) => void;
  onDelete: (subcategory: SubcategoryEntity) => void;
}

export function SubcategoriesTable({
  subcategories,
  categories,
  loading = false,
  onEdit,
  onDelete,
}: SubcategoriesTableProps) {
  const categoryMap = new Map(categories.map((c) => [c.id, c.category_name]));

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
              Subcategoria
            </th>
            <th
              scope="col"
              className="w-48 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Categoria
            </th>
            <th
              scope="col"
              className="px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Esquema JSON
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
            <SubcategoriesTableSkeleton />
          ) : subcategories.length === 0 ? (
            <TableEmptyState
              colSpan={5}
              title="Sin resultados"
              description="No se encontraron subcategorias registradas o que coincidan con los filtros aplicados."
            />
          ) : (
            subcategories.map((subcategory, index) => (
              <SubcategoriesRow
                key={subcategory.id}
                index={index}
                subcategory={subcategory}
                categoryName={categoryMap.get(subcategory.category_id) ?? ""}
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
