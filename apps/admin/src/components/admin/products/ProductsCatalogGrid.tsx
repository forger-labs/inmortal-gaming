"use client";

import { ProductsIcon } from "@shared/icons";
import type { CategoryEntity, ProductEntity } from "@shared/types";

import { ProductCatalogCard } from "./ProductCatalogCard";
import { ProductsCatalogSkeleton } from "./ProductsCatalogSkeleton";

interface ProductsCatalogGridProps {
  products: ProductEntity[];
  categories: CategoryEntity[];
  loading?: boolean;
  onEdit: (product: ProductEntity) => void;
  onDelete: (product: ProductEntity) => void;
}

export function ProductsCatalogGrid({
  products,
  categories,
  loading = false,
  onEdit,
  onDelete,
}: ProductsCatalogGridProps) {
  const categoryMap = new Map(categories.map((c) => [c.id, c.category_name]));

  if (loading) {
    return <ProductsCatalogSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-bg-primary text-text-muted mb-3">
          <ProductsIcon className="h-6 w-6" />
        </div>
        <h3 className="font-display text-base font-semibold text-text-primary">
          Sin productos
        </h3>
        <p className="mt-1 max-w-md font-body text-xs text-text-secondary">
          No se encontraron productos registrados o que coincidan con los
          filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCatalogCard
          key={product.id}
          product={product}
          categoryName={categoryMap.get(product.category_id) ?? ""}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
