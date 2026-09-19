"use client";

import { CloseIcon, GridIcon, SearchIcon } from "@shared/icons";
import type {
  CategoryEntity,
  ProductEntity,
  SubcategoryEntity,
} from "@shared/types";
import { useMemo, useState } from "react";

import { CategoryCard } from "@/components/catalog/CategoryCard";

interface CatalogHubViewProps {
  categories: CategoryEntity[];
  subcategories: SubcategoryEntity[];
  previewProductsMap?: Record<number, ProductEntity[]>;
}

export function CatalogHubView({
  categories,
  subcategories,
  previewProductsMap = {},
}: CatalogHubViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    number | "ALL"
  >("ALL");

  // Map subcategories to categories
  const subcategoriesByCategory = useMemo(() => {
    const map: Record<number, SubcategoryEntity[]> = {};
    for (const cat of categories) {
      map[cat.id] = subcategories.filter((s) => s.category_id === cat.id);
    }
    return map;
  }, [categories, subcategories]);

  // Filter categories and subcategories based on search input and active category filter
  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return categories
      .filter((cat) => {
        if (selectedCategoryFilter === "ALL") return true;
        return cat.id === selectedCategoryFilter;
      })
      .map((cat) => {
        if (!term) {
          return {
            category: cat,
            subcategories: subcategoriesByCategory[cat.id] || [],
          };
        }

        const catNameMatches = cat.category_name.toLowerCase().includes(term);
        const matchedSubcategories = (
          subcategoriesByCategory[cat.id] || []
        ).filter((sub) => sub.subcategory_name.toLowerCase().includes(term));

        if (catNameMatches) {
          return {
            category: cat,
            subcategories: subcategoriesByCategory[cat.id] || [],
          };
        }

        if (matchedSubcategories.length > 0) {
          return {
            category: cat,
            subcategories: matchedSubcategories,
          };
        }

        return null;
      })
      .filter(
        (
          item,
        ): item is {
          category: CategoryEntity;
          subcategories: SubcategoryEntity[];
        } => item !== null,
      );
  }, [categories, subcategoriesByCategory, searchTerm, selectedCategoryFilter]);

  return (
    <div className="flex flex-col gap-8">
      {/* Search and Category Quick Filter Chips */}
      <div className="flex flex-col gap-5 rounded-2xl border border-neon-primary/20 bg-bg-surface/90 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search input */}
          <div className="relative flex-1 max-w-lg">
            <label htmlFor="catalog-search" className="sr-only">
              Buscar en el catálogo
            </label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neon-primary">
              <SearchIcon className="h-5 w-5" />
            </div>
            <input
              id="catalog-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar juegos, monedas, cuentas o categorías..."
              className="w-full rounded-xl border border-border-subtle bg-bg-primary pl-11 pr-10 py-3 font-body text-base text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-neon-primary focus:ring-2 focus:ring-neon-primary/20 shadow-inner"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-muted hover:text-neon-primary"
                aria-label="Limpiar búsqueda"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Live Metrics */}
          <div className="flex items-center gap-3 font-mono text-xs text-text-secondary">
            <span className="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-primary px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-neon-primary animate-pulse" />
              <strong className="text-text-primary">{categories.length}</strong>{" "}
              Categorías
            </span>
            <span className="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-primary px-3 py-2">
              <strong className="text-neon-primary">
                {subcategories.length}
              </strong>{" "}
              Subcategorías
            </span>
          </div>
        </div>

        {/* Quick Category Tabs / Chips */}
        <div className="flex flex-wrap items-center gap-2 border-t border-border-subtle pt-4">
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted mr-1">
            Filtro rápido:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter("ALL")}
            className={`rounded-lg px-3.5 py-1.5 font-display text-xs font-bold transition-all ${
              selectedCategoryFilter === "ALL"
                ? "bg-neon-primary text-bg-primary shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                : "border border-border-subtle bg-bg-primary text-text-secondary hover:border-neon-primary/50 hover:text-text-primary"
            }`}
          >
            Todas ({categories.length})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategoryFilter === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`rounded-lg px-3.5 py-1.5 font-display text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-neon-primary text-bg-primary shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                    : "border border-border-subtle bg-bg-primary text-text-secondary hover:border-neon-primary/50 hover:text-text-primary"
                }`}
              >
                {cat.category_name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Grid */}
      {filteredData.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-subtle bg-bg-surface/40 p-16 text-center">
          <GridIcon className="mx-auto h-12 w-12 text-text-muted opacity-40 mb-4" />
          <h3 className="font-display text-2xl font-bold text-text-primary">
            No se encontraron categorías
          </h3>
          <p className="mt-2 font-body text-base text-text-secondary">
            No hay categorías o subcategorías que coincidan con los filtros
            actuales.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategoryFilter("ALL");
            }}
            className="btn-neon mt-6 rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {filteredData.map(({ category, subcategories: subList }, idx) => (
            <CategoryCard
              key={category.id}
              category={category}
              subcategories={subList}
              previewProducts={previewProductsMap[category.id] || []}
              index={idx}
            />
          ))}
        </div>
      )}
    </div>
  );
}
