"use client";

import type {
  ProductEntity,
  ServerEntity,
  SubcategoryEntity,
  SubProductEntity,
} from "@shared/types";
import { useMemo } from "react";

import { TableEmptyState } from "@/components/commonList/TableEmptyState";
import { SubproductCatalogCard } from "./SubproductCatalogCard";
import { SubproductsCatalogSkeleton } from "./SubproductsCatalogSkeleton";

interface SubproductsCatalogGridProps {
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

export function SubproductsCatalogGrid({
  subproducts,
  products,
  subcategories,
  servers,
  loading,
  onEdit,
  onDelete,
  onToggleStatus,
  onPreview,
}: SubproductsCatalogGridProps) {
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

  if (loading) {
    return <SubproductsCatalogSkeleton />;
  }

  if (subproducts.length === 0) {
    return (
      <TableEmptyState
        colSpan={1}
        title="No se encontraron subproductos"
        description="No hay subproductos que coincidan con los filtros aplicados."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {subproducts.map((subproduct) => (
        <SubproductCatalogCard
          key={subproduct.id}
          subproduct={subproduct}
          productName={productMap.get(subproduct.product_id) ?? ""}
          subcategoryName={subcategoryMap.get(subproduct.sub_category_id) ?? ""}
          serverName={serverMap.get(subproduct.server_id) ?? ""}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}
