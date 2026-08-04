"use client";

import { PRODUCTS } from "@/data/products";
import { CatalogPagination } from "./CatalogPagination";
import { CatalogToolbar } from "./CatalogToolbar";
import { Filters } from "./Filters";
import { ProductCard } from "./ProductCard";

export function Catalog() {
  return (
    <section id="catalogo">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 mb-13">
        {/* Sidebar filters */}
        <div className="md:col-span-3 lg:col-span-2">
          <Filters />
        </div>

        {/* Product area */}
        <div className="md:col-span-9 lg:col-span-10">
          <CatalogToolbar />

          {/* Product grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <CatalogPagination />
        </div>
      </div>
    </section>
  );
}
