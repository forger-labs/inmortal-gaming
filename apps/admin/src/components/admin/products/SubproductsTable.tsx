"use client";

import type {
  ProductEntity,
  ServerEntity,
  SubcategoryEntity,
  SubProductEntity,
} from "@shared/types";
import { useMemo } from "react";

import { TableEmptyState } from "@/components/commonList/TableEmptyState";
import { SubproductsRow } from "./SubproductsRow";
import { SubproductsTableSkeleton } from "./SubproductsTableSkeleton";

interface SubproductsTableProps {
  subproducts: SubProductEntity[];
  products: ProductEntity[];
  subcategories: SubcategoryEntity[];
  servers: ServerEntity[];
  loading: boolean;
  onEdit: (subproduct: SubProductEntity) => void;
  onDelete: (subproduct: SubProductEntity) => void;
  onToggleStatus: (subproduct: SubProductEntity) => void;
  onPreview: (subproduct: SubProductEntity) => void;
}

export function SubproductsTable({
  subproducts,
  products,
  subcategories,
  servers,
  loading,
  onEdit,
  onDelete,
  onToggleStatus,
  onPreview,
}: SubproductsTableProps) {
  const productMap = useMemo(
    () => new Map(products.map((p) => [p.id, p.name])),
    [products],
  );

  const subcategoryMap = useMemo(
    () => new Map(subcategories.map((s) => [s.id, s.subcategory_name])),
    [subcategories],
  );

  const serverMap = useMemo(
    () => new Map(servers.map((s) => [s.id, s.server_name])),
    [servers],
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/5 font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Subproducto
            </th>
            <th scope="col" className="px-6 py-3">
              Producto
            </th>
            <th scope="col" className="px-6 py-3">
              Subcategoria
            </th>
            <th scope="col" className="px-6 py-3">
              Servidores
            </th>
            <th scope="col" className="px-6 py-3">
              Precio
            </th>
            <th scope="col" className="px-6 py-3">
              Estado
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <SubproductsTableSkeleton />
          ) : subproducts.length === 0 ? (
            <TableEmptyState
              colSpan={8}
              title="No se encontraron subproductos"
              description="No hay subproductos registrados o que coincidan con los filtros aplicados."
            />
          ) : (
            subproducts.map((subproduct, index) => {
              const serverNames = (subproduct.server_ids || []).map(
                (id) => serverMap.get(id) || `ID #${id}`,
              );

              return (
                <SubproductsRow
                  key={subproduct.id}
                  index={index}
                  subproduct={subproduct}
                  productName={productMap.get(subproduct.product_id) ?? ""}
                  subcategoryName={
                    subcategoryMap.get(subproduct.sub_category_id) ?? ""
                  }
                  serverNames={serverNames}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleStatus={onToggleStatus}
                  onPreview={onPreview}
                />
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
