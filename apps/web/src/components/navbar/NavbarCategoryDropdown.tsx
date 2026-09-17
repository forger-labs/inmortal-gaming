"use client";

import { ChevronRightIcon, GridIcon, ProductsIcon } from "@shared/icons";
import type {
  CategoryEntity,
  SubcategoryEntity,
  SubProductEntity,
} from "@shared/types";
import Link from "next/link";
import { useState } from "react";

import { ROUTES } from "@/constants";

interface NavbarCategoryDropdownProps {
  category: CategoryEntity;
  subcategories: SubcategoryEntity[];
  subproductsMap: Record<number, SubProductEntity[]>;
  isOpen: boolean;
  onClose: () => void;
}

export function NavbarCategoryDropdown({
  category,
  subcategories,
  subproductsMap,
  isOpen,
  onClose,
}: NavbarCategoryDropdownProps) {
  const [activeSubcatIndex, setActiveSubcatIndex] = useState<number>(0);

  if (!isOpen) return null;

  const categorySlugOrId = category.slug || category.id.toString();
  const activeSubcategory =
    subcategories[activeSubcatIndex] || subcategories[0];
  const activeSubproducts = activeSubcategory
    ? subproductsMap[activeSubcategory.id] || []
    : [];

  return (
    <section
      aria-label={`Subcategorías y productos de ${category.category_name}`}
      className="absolute left-0 top-full mt-3 w-[660px] lg:w-[720px] rounded-2xl border border-neon-primary/30 bg-bg-surface/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,240,255,0.12)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 z-50"
    >
      {/* Top Neon Accent Line */}
      <div className="absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-neon-primary to-transparent shadow-[0_0_10px_var(--neon-primary)]" />

      {/* Header with Category Name and Badge */}
      <div className="mb-5 flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-neon-primary/40 bg-neon-primary/10 text-neon-primary shadow-[0_0_12px_rgba(0,240,255,0.2)]">
            <GridIcon className="h-5 w-5" />
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
              Explorar Categoría
            </span>
            <h3 className="font-display text-lg font-bold text-text-primary">
              {category.category_name}
            </h3>
          </div>
        </div>

        <Link
          href={ROUTES.catalogCategory(categorySlugOrId)}
          onClick={onClose}
          className="group inline-flex items-center gap-1.5 rounded-lg border border-neon-primary/30 bg-neon-primary/10 px-3 py-1.5 font-mono text-xs font-semibold text-neon-primary transition-all hover:bg-neon-primary hover:text-bg-primary hover:shadow-[0_0_16px_rgba(0,240,255,0.4)]"
        >
          <span>Ver catálogo completo</span>
          <ChevronRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Subcategories */}
        <div className="col-span-5 border-r border-border-subtle pr-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Subcategorías
            </span>
            <span className="rounded bg-bg-surface-hover px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
              {subcategories.length} activas
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {subcategories.map((subcat, idx) => {
              const isActive = idx === activeSubcatIndex;
              const subcatSlugOrId = subcat.slug || subcat.id.toString();

              return (
                <Link
                  key={subcat.id}
                  href={ROUTES.catalogSubcategory(
                    categorySlugOrId,
                    subcatSlugOrId,
                  )}
                  onClick={onClose}
                  onMouseEnter={() => setActiveSubcatIndex(idx)}
                  className={`group flex items-center justify-between rounded-xl p-3 transition-all duration-150 ${
                    isActive
                      ? "border border-neon-primary/50 bg-bg-surface-hover text-neon-primary shadow-[0_0_16px_rgba(0,240,255,0.12)]"
                      : "border border-transparent text-text-primary hover:border-border-subtle hover:bg-bg-surface-hover/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`h-2 w-2 rounded-full transition-all ${
                        isActive
                          ? "bg-neon-primary shadow-[0_0_8px_var(--neon-primary)] scale-110"
                          : "bg-text-muted/40 group-hover:bg-neon-primary/60"
                      }`}
                    />
                    <span className="truncate font-body text-sm font-semibold">
                      {subcat.subcategory_name}
                    </span>
                  </div>
                  <ChevronRightIcon
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      isActive
                        ? "text-neon-primary translate-x-1"
                        : "text-text-muted opacity-40 group-hover:opacity-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column: Subproducts Preview */}
        <div className="col-span-7 flex flex-col justify-between pl-2">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {activeSubcategory
                  ? `Destacados en ${activeSubcategory.subcategory_name}`
                  : "Items destacados"}
              </span>
              <span className="font-mono text-[10px] text-neon-primary">
                Entrega Instantánea
              </span>
            </div>

            {activeSubproducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle bg-bg-primary/50 py-8 text-center">
                <ProductsIcon className="h-8 w-8 text-text-muted/40 mb-2" />
                <p className="font-body text-xs text-text-muted">
                  No hay subproductos registrados aún
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {activeSubproducts.slice(0, 5).map((subproduct) => (
                  <li key={subproduct.id}>
                    <Link
                      href={ROUTES.subproduct(subproduct.id)}
                      onClick={onClose}
                      className="group flex items-center justify-between rounded-lg border border-border-subtle/60 bg-bg-primary/40 px-3.5 py-2.5 transition-all duration-200 hover:border-neon-primary/60 hover:bg-bg-surface-hover hover:shadow-[0_0_14px_rgba(0,240,255,0.1)]"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-neon-primary/10 font-mono text-[11px] font-bold text-neon-primary">
                          #
                        </span>
                        <span className="truncate font-body text-sm font-medium text-text-primary group-hover:text-neon-primary transition-colors">
                          {subproduct.name}
                        </span>
                      </div>
                      <ChevronRightIcon className="h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-1 group-hover:text-neon-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Subcategory Footer Link */}
          {activeSubcategory && (
            <div className="mt-4 border-t border-border-subtle pt-3">
              <Link
                href={ROUTES.catalogSubcategory(
                  categorySlugOrId,
                  activeSubcategory.slug || activeSubcategory.id.toString(),
                )}
                onClick={onClose}
                className="flex items-center justify-between rounded-lg bg-bg-surface-hover/80 px-3 py-2 font-mono text-xs font-semibold text-neon-primary transition-all hover:bg-neon-primary/15 hover:shadow-[0_0_12px_rgba(0,240,255,0.2)]"
              >
                <span>
                  Ver todos los items de {activeSubcategory.subcategory_name}
                </span>
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
