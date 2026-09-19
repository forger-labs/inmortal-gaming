"use client";

import { CloseIcon, ProductsIcon, SearchIcon } from "@shared/icons";
import type { CategoryEntity, ProductEntity } from "@shared/types";
import { useCallback, useEffect, useState } from "react";

import { CatalogProductCard } from "@/components/catalog/CatalogProductCard";
import { PaginationBar } from "@/components/catalog/PaginationBar";
import { webApi } from "@/libs/webApi";

interface CategoryProductsCatalogViewProps {
  category: CategoryEntity;
  initialProducts?: ProductEntity[];
  initialTotal?: number;
}

export function CategoryProductsCatalogView({
  category,
  initialProducts = [],
  initialTotal = 0,
}: CategoryProductsCatalogViewProps) {
  const [products, setProducts] = useState<ProductEntity[]>(initialProducts);
  const [totalItems, setTotalItems] = useState<number>(initialTotal);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await webApi.getProducts(page, limit, {
        categoryId: category.id,
        name: searchTerm,
        isActive: true,
      });
      setProducts(res.items || []);
      setTotalItems(res.total || 0);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [category.id, page, limit, searchTerm]);

  useEffect(() => {
    // If not first page with initial products or if search is applied
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filter and Search Toolbar */}
      <div className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="category-product-search" className="sr-only">
            Buscar productos en {category.category_name}
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-muted">
            <SearchIcon className="h-4 w-4" />
          </div>
          <input
            id="category-product-search"
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={`Buscar en ${category.category_name}...`}
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

        {/* Counter */}
        <div className="font-mono text-xs text-text-secondary">
          <span>
            Total: <strong className="text-neon-primary">{totalItems}</strong>{" "}
            productos
          </span>
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {["skel-1", "skel-2", "skel-3", "skel-4", "skel-5", "skel-6"].map(
            (skelKey) => (
              <div
                key={skelKey}
                className="h-64 rounded-xl border border-border-subtle bg-bg-surface/40 animate-pulse"
              />
            ),
          )}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-subtle bg-bg-surface/40 p-12 text-center">
          <ProductsIcon className="mx-auto h-10 w-10 text-text-muted opacity-40 mb-3" />
          <h3 className="font-display text-lg font-bold text-text-primary">
            No se encontraron productos
          </h3>
          <p className="mt-1 font-body text-sm text-text-secondary">
            {searchTerm
              ? `No hay coincidencias para "${searchTerm}" en esta categoría.`
              : "Actualmente no hay productos registrados en esta categoría."}
          </p>
          {searchTerm && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="btn-neon mt-4 rounded px-4 py-2 text-xs font-semibold uppercase tracking-wider"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <CatalogProductCard key={product.id} product={product} />
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
