"use client";

import {
  CartIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  GridIcon,
  OrdersIcon,
  UserIcon,
} from "@shared/icons";
import type {
  CategoryEntity,
  SubcategoryEntity,
  SubProductEntity,
} from "@shared/types";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { ROUTES } from "@/constants";

interface NavbarMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryEntity[];
  subcategoriesMap: Record<number, SubcategoryEntity[]>;
  subproductsMap: Record<number, SubProductEntity[]>;
  isAuthenticated: boolean;
  email?: string | null;
  totalItems: number;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export function NavbarMobileDrawer({
  isOpen,
  onClose,
  categories,
  subcategoriesMap,
  subproductsMap,
  isAuthenticated,
  email,
  totalItems,
  onLogout,
  onOpenLogin,
}: NavbarMobileDrawerProps) {
  const [expandedCatId, setExpandedCatId] = useState<number | null>(
    categories[0]?.id || null,
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-label="Cerrar menú móvil"
          />

          {/* Slidable Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 32,
              stiffness: 350,
              mass: 0.8,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ right: 0.8, left: 0.05 }}
            onDragEnd={(_e, info) => {
              if (info.offset.x > 80 || info.velocity.x > 300) {
                onClose();
              }
            }}
            className="relative flex h-full w-full max-w-sm flex-col justify-between overflow-y-auto border-l border-neon-primary/30 bg-bg-surface/98 p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl touch-pan-y"
          >
            {/* Touch Slide indicator pill */}
            <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="h-10 w-1 rounded-full bg-neon-primary/30 shadow-[0_0_8px_rgba(0,240,255,0.4)]" />
            </div>

            {/* Top Header */}
            <div>
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <Link
                  href={ROUTES.home}
                  onClick={onClose}
                  className="glitch font-display text-xl font-bold tracking-tight text-text-primary"
                  data-text="INMORTAL"
                >
                  INMORTAL GAMING
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-bg-surface-hover text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary"
                  aria-label="Cerrar navegación"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Quick Primary Links */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href={ROUTES.catalog}
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-xl border border-neon-primary/40 bg-neon-primary/10 py-3 font-display text-sm font-bold text-neon-primary shadow-[0_0_14px_rgba(0,240,255,0.15)] transition-all hover:bg-neon-primary hover:text-bg-primary"
                >
                  <GridIcon className="h-4 w-4" />
                  <span>Ver Catálogo</span>
                </Link>

                <Link
                  href={ROUTES.cart}
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-bg-surface-hover py-3 font-display text-sm font-bold text-text-primary transition-colors hover:border-neon-primary hover:text-neon-primary"
                >
                  <CartIcon className="h-4 w-4" />
                  <span>Carrito ({totalItems})</span>
                </Link>
              </div>

              {/* Categories Section Heading */}
              <div className="mt-6 mb-3 flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Categorías Principales
                </span>
                <span className="font-mono text-[11px] text-neon-primary">
                  Marketplace
                </span>
              </div>

              {/* Visual Category Tiles */}
              <div className="flex flex-col gap-3">
                {categories.map((category) => {
                  const isExpanded = expandedCatId === category.id;
                  const categorySlugOrId =
                    category.slug || category.id.toString();
                  const subcategories = subcategoriesMap[category.id] || [];

                  return (
                    <div
                      key={category.id}
                      className={`overflow-hidden rounded-xl border transition-all ${
                        isExpanded
                          ? "border-neon-primary/50 bg-bg-primary shadow-[0_0_20px_rgba(0,240,255,0.12)]"
                          : "border-border-subtle bg-bg-surface-hover/40"
                      }`}
                    >
                      {/* Category Trigger Header */}
                      <div className="flex items-center justify-between p-3.5">
                        <Link
                          href={ROUTES.catalogCategory(categorySlugOrId)}
                          onClick={onClose}
                          className="flex items-center gap-2.5 font-display text-base font-bold text-text-primary hover:text-neon-primary"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon-primary/15 font-mono text-xs font-bold text-neon-primary">
                            #
                          </span>
                          <span>{category.category_name}</span>
                        </Link>

                        {subcategories.length > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedCatId(isExpanded ? null : category.id)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-bg-surface-hover hover:text-neon-primary"
                            aria-label={`Ver opciones de ${category.category_name}`}
                          >
                            <ChevronDownIcon
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-neon-primary" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Expanded Subcategory Tiles & Subproducts */}
                      {isExpanded && subcategories.length > 0 && (
                        <div className="border-t border-border-subtle/80 bg-bg-surface/90 p-3 flex flex-col gap-3">
                          {subcategories.map((subcat) => {
                            const subcatSlugOrId =
                              subcat.slug || subcat.id.toString();
                            const subprods = subproductsMap[subcat.id] || [];

                            return (
                              <div
                                key={subcat.id}
                                className="rounded-lg border border-border-subtle bg-bg-primary/70 p-2.5"
                              >
                                <Link
                                  href={ROUTES.catalogSubcategory(
                                    categorySlugOrId,
                                    subcatSlugOrId,
                                  )}
                                  onClick={onClose}
                                  className="flex items-center justify-between font-body text-sm font-semibold text-neon-primary hover:underline"
                                >
                                  <span>{subcat.subcategory_name}</span>
                                  <ChevronRightIcon className="h-3.5 w-3.5" />
                                </Link>

                                {subprods.length > 0 && (
                                  <div className="mt-2 flex flex-col gap-1 border-t border-border-subtle/40 pt-1.5">
                                    {subprods.slice(0, 3).map((sp) => (
                                      <Link
                                        key={sp.id}
                                        href={ROUTES.subproduct(sp.id)}
                                        onClick={onClose}
                                        className="truncate font-body text-xs text-text-secondary hover:text-neon-primary"
                                      >
                                        · {sp.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          <Link
                            href={ROUTES.catalogCategory(categorySlugOrId)}
                            onClick={onClose}
                            className="mt-1 block text-center font-mono text-xs font-semibold text-text-secondary hover:text-neon-primary"
                          >
                            Explorar todo en {category.category_name} →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom User Area */}
            <div className="mt-8 border-t border-border-subtle pt-4">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 rounded-lg bg-bg-primary p-3">
                    <UserIcon className="h-5 w-5 text-neon-primary shrink-0" />
                    <span className="truncate font-body text-xs text-text-primary">
                      {email}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={ROUTES.profile}
                      onClick={onClose}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-border-subtle bg-bg-surface-hover py-2 font-body text-xs text-text-primary hover:border-neon-primary"
                    >
                      <UserIcon className="h-3.5 w-3.5" />
                      <span>Mi Perfil</span>
                    </Link>
                    <Link
                      href={ROUTES.myOrders}
                      onClick={onClose}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-border-subtle bg-bg-surface-hover py-2 font-body text-xs text-text-primary hover:border-neon-primary"
                    >
                      <OrdersIcon className="h-3.5 w-3.5" />
                      <span>Mis Órdenes</span>
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="mt-2 w-full rounded-lg border border-neon-pink/40 bg-neon-pink/10 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-neon-pink transition-colors hover:bg-neon-pink hover:text-white"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                  className="btn-neon w-full rounded-xl py-3 text-center font-display text-sm font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                >
                  Ingresar / Registrarse
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
