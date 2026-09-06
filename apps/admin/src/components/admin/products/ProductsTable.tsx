"use client";

import type { CategoryEntity, ProductEntity } from "@shared/types";

import { TableEmptyState } from "@/components/commonList/TableEmptyState";
import { ProductsRow } from "./ProductsRow";
import { ProductsTableSkeleton } from "./ProductsTableSkeleton";

interface ProductsTableProps {
  products: ProductEntity[];
  categories: CategoryEntity[];
  loading?: boolean;
  onEdit: (product: ProductEntity) => void;
  onDelete: (product: ProductEntity) => void;
}

export function ProductsTable({
  products,
  categories,
  loading = false,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const categoryMap = new Map(categories.map((c) => [c.id, c.category_name]));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-160 border-collapse text-left">
        <thead>
          <tr className="border-b border-neon-primary/20 bg-bg-primary">
            <th
              scope="col"
              className="w-20 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Producto
            </th>
            <th
              scope="col"
              className="w-44 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Categoria
            </th>
            <th
              scope="col"
              className="w-32 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Estado
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
            <ProductsTableSkeleton />
          ) : products.length === 0 ? (
            <TableEmptyState
              colSpan={5}
              title="Sin productos"
              description="No se encontraron productos registrados o que coincidan con los filtros aplicados."
            />
          ) : (
            products.map((product, index) => (
              <ProductsRow
                key={product.id}
                index={index}
                product={product}
                categoryName={categoryMap.get(product.category_id) ?? ""}
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
