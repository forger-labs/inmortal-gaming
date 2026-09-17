"use client";

import { CloseIcon, ProductsIcon, SearchIcon } from "@shared/icons";
import type {
  CategoryEntity,
  SubcategoryEntity,
  SubProductEntity,
} from "@shared/types";
import { useCallback, useEffect, useState } from "react";

import { CatalogSubProductCard } from "@/components/catalog/CatalogSubProductCard";
import { PaginationBar } from "@/components/catalog/PaginationBar";
import { webApi } from "@/libs/webApi";

interface SubcategoryProductsCatalogViewProps {
  category: CategoryEntity;
  subcategory: SubcategoryEntity;
  initialSubproducts?: SubProductEntity[];
  initialTotal?: number;
}

export function SubcategoryProductsCatalogView({
  subcategory,
  initialSubproducts = [],
  initialTotal = 0,
}: SubcategoryProductsCatalogViewProps) {
  const [subproducts, setSubproducts] =
    useState<SubProductEntity[]>(initialSubproducts);
  const [totalItems, setTotalItems] = useState<number>(initialTotal);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSubproducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await webApi.getSubProducts(page, limit, {
        subcategoryId: subcategory.id,
        name: searchTerm,
        minPrice: minPrice !== "" ? minPrice : undefined,
        maxPrice: maxPrice !== "" ? maxPrice : undefined,
        isActive: true,
      });
      setSubproducts(res.items || []);
      setTotalItems(res.total || 0);
    } catch (error) {
      console.error("Error al obtener subproductos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [subcategory.id, page, limit, searchTerm, minPrice, maxPrice]);

  useEffect(() => {
    fetchSubproducts();
  }, [fetchSubproducts]);

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(searchTerm || minPrice || maxPrice);

  return (
    <div className="flex flex-col gap-6">
      {/* Filters Toolbar */}
      <div className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-bg-surface p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="subcat-search" className="sr-only">
            Buscar en {subcategory.subcategory_name}
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted">
            <SearchIcon className="h-4 w-4" />
          </div>
          <input
            id="subcat-search"
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={`Buscar en ${subcategory.subcategory_name}...`}
            className="w-full rounded-lg border border-border-subtle bg-bg-primary pl-9 pr-8 py-2 font-body text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-neon-primary focus:ring-1 focus:ring-neon-primary"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-text-muted hover:text-neon-primary"
              aria-label="Limpiar búsqueda"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Price filters and Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="min-price-input"
              className="font-mono text-xs text-text-muted"
            >
              Min $:
            </label>
            <input
              id="min-price-input"
              type="number"
              min="0"
              placeholder="0"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setPage(1);
              }}
              className="w-20 rounded border border-border-subtle bg-bg-primary px-2.5 py-1.5 font-mono text-xs text-text-primary outline-none focus:border-neon-primary focus:ring-1 focus:ring-neon-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="max-price-input"
              className="font-mono text-xs text-text-muted"
            >
              Max $:
            </label>
            <input
              id="max-price-input"
              type="number"
              min="0"
              placeholder="999"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setPage(1);
              }}
              className="w-20 rounded border border-border-subtle bg-bg-primary px-2.5 py-1.5 font-mono text-xs text-text-primary outline-none focus:border-neon-primary focus:ring-1 focus:ring-neon-primary"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="rounded border border-neon-primary/30 px-3 py-1.5 font-mono text-xs text-neon-primary transition-colors hover:bg-neon-primary/10"
            >
              Limpiar filtros
            </button>
          )}

          <div className="font-mono text-xs text-text-secondary pl-2">
            Total: <strong className="text-neon-primary">{totalItems}</strong>{" "}
            items
          </div>
        </div>
      </div>

      {/* Grid of Subproducts */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "sub-skel-1",
            "sub-skel-2",
            "sub-skel-3",
            "sub-skel-4",
            "sub-skel-5",
            "sub-skel-6",
          ].map((skelKey) => (
            <div
              key={skelKey}
              className="h-64 rounded-xl border border-border-subtle bg-bg-surface/40 animate-pulse"
            />
          ))}
        </div>
      ) : subproducts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-subtle bg-bg-surface/40 p-12 text-center">
          <ProductsIcon className="mx-auto h-10 w-10 text-text-muted opacity-40 mb-3" />
          <h3 className="font-display text-lg font-bold text-text-primary">
            No se encontraron subproductos
          </h3>
          <p className="mt-1 font-body text-sm text-text-secondary">
            {hasActiveFilters
              ? "No hay subproductos que coincidan con los filtros aplicados."
              : "Actualmente no hay subproductos registrados en esta subcategoría."}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn-neon mt-4 rounded px-4 py-2 text-xs font-semibold uppercase tracking-wider"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subproducts.map((subproduct) => (
            <CatalogSubProductCard
              key={subproduct.id}
              subproduct={subproduct}
            />
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      <PaginationBar
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        limit={limit}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        availableLimits={[6, 12, 18, 20]}
      />
    </div>
  );
}
