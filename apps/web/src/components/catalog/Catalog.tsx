"use client";

import { MotionConfig, motion } from "framer-motion";
import { useState } from "react";

import { EASE_OUT_EXPO } from "@/constants";
import { PRODUCTS } from "@/data/products";
import type { CatalogSort, ProductCategory, StockStatus } from "@/types";
import { CatalogPagination } from "./CatalogPagination";
import { CatalogToolbar } from "./CatalogToolbar";
import { Filters } from "./Filters";
import { ProductCard } from "./ProductCard";

const PAGE_SIZE = 6;

const ALL_CATEGORIES: ProductCategory[] = [
  "game-items",
  "virtual-currency",
  "gift-cards",
  "digital-services",
];

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT_EXPO },
  },
};

export function Catalog() {
  const [selectedCategories, setSelectedCategories] = useState<
    ProductCategory[]
  >([]);
  const [selectedStatus, setSelectedStatus] = useState<StockStatus[]>([]);
  const [sortBy, setSortBy] = useState<CatalogSort>("relevance");

  const toggleCategory = (category: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const toggleStatus = (status: StockStatus) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedStatus([]);
  };

  const activeFilters = selectedCategories.length + selectedStatus.length;

  const filtered = PRODUCTS.filter(
    (product) =>
      (selectedCategories.length === 0 ||
        selectedCategories.includes(product.category)) &&
      (selectedStatus.length === 0 ||
        selectedStatus.includes(product.stockStatus)),
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  const categoryCounts = Object.fromEntries(
    ALL_CATEGORIES.map((category) => [
      category,
      PRODUCTS.filter((product) => product.category === category).length,
    ]),
  ) as Record<ProductCategory, number>;

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  return (
    <MotionConfig reducedMotion="user">
      <section id="catalogo">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Sidebar filters */}
          <div className="md:col-span-4 lg:col-span-3">
            <Filters
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              selectedStatus={selectedStatus}
              onToggleStatus={toggleStatus}
              categoryCounts={categoryCounts}
            />
          </div>

          {/* Product area */}
          <div className="md:col-span-8 lg:col-span-9">
            <CatalogToolbar
              count={sorted.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              activeFilters={activeFilters}
              onClearFilters={clearFilters}
            />

            {/* Product grid */}
            {sorted.length > 0 ? (
              <motion.div
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                {sorted.map((product) => (
                  <motion.div key={product.id} variants={cardVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border-subtle bg-bg-surface/50 px-6 py-20 text-center">
                <p className="font-display text-xl font-semibold text-text-primary">
                  No hay productos que coincidan con tus filtros
                </p>
                <p className="max-w-sm font-body text-sm text-text-secondary">
                  Prueba quitando alguna categoría o estado para ver más
                  resultados.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn-neon rounded px-6 py-2.5 text-xs font-semibold uppercase tracking-wider"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {totalPages > 1 && <CatalogPagination />}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
