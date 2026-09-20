"use client";

import {
  CartIcon,
  ChevronDownIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  UsersIcon,
} from "@shared/icons";
import { cyberInfo } from "@shared/toasts";
import type {
  CategoryEntity,
  SubcategoryEntity,
  SubProductEntity,
} from "@shared/types";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { LoginModal } from "@/components/auth/LoginModal";
import { NavbarCategoryDropdown } from "@/components/navbar/NavbarCategoryDropdown";
import { NavbarMobileDrawer } from "@/components/navbar/NavbarMobileDrawer";
import { NavbarSearchTrigger } from "@/components/navbar/NavbarSearchTrigger";
import { SearchModal } from "@/components/navbar/SearchModal";
import { ROUTES } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { webApi } from "@/libs/webApi";
import type { NavLink } from "@/types";

const STATIC_NAV_LINKS: NavLink[] = [
  { label: "Catálogo", href: ROUTES.catalog },
  // { label: "Ofertas", href: "#ofertas" },
];

/**
 * Navbar component with dynamic categories, search command palette trigger,
 * mega-dropdown, and slide-in mobile drawer.
 *
 * NOTE FOR FUTURE REFACTORING:
 * Currently, the navbar dynamically loads the first 3 categories returned by `GET /categories`
 * and their first 3 subcategories with top 5 subproducts.
 * In a future phase, this will be refactored to support configurable navbar items (e.g. selected
 * and ordered from the admin management panel or dedicated navigation settings endpoint).
 */
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

  // Dynamic categories and subcategory state
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [subcategoriesMap, setSubcategoriesMap] = useState<
    Record<number, SubcategoryEntity[]>
  >({});
  const [subproductsMap, setSubproductsMap] = useState<
    Record<number, SubProductEntity[]>
  >({});
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { isAuthenticated, email, logout } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    let isMounted = true;

    async function loadNavigationData() {
      try {
        // 1. Fetch first 3 categories
        const catRes = await webApi.getCategories(1, 5);
        if (!isMounted || !catRes.items) return;
        const topCategories = catRes.items;
        setCategories(topCategories);

        // 2. Fetch all subcategories
        const subcatRes = await webApi.getSubcategories(1, 50);
        if (!isMounted || !subcatRes.items) return;

        const subMap: Record<number, SubcategoryEntity[]> = {};
        for (const cat of topCategories) {
          subMap[cat.id] = subcatRes.items
            .filter((s) => s.category_id === cat.id)
            .slice(0, 3);
        }
        setSubcategoriesMap(subMap);

        // 3. Preload top 5 subproducts for each visible subcategory
        const visibleSubcategories = Object.values(subMap).flat();
        const subprodPromises = visibleSubcategories.map(async (subcat) => {
          try {
            const subprodRes = await webApi.getSubProducts(1, 5, {
              subcategoryId: subcat.id,
              isActive: true,
            });
            return { subcatId: subcat.id, items: subprodRes.items || [] };
          } catch {
            return { subcatId: subcat.id, items: [] };
          }
        });

        const subprodResults = await Promise.all(subprodPromises);
        if (!isMounted) return;

        const prodMap: Record<number, SubProductEntity[]> = {};
        for (const res of subprodResults) {
          prodMap[res.subcatId] = res.items;
        }
        setSubproductsMap(prodMap);
      } catch (error) {
        // Graceful fallback if categories cannot be loaded
        console.error("Error loading navbar categories:", error);
      }
    }

    loadNavigationData();

    return () => {
      isMounted = false;
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (categoryId: number) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdownId(categoryId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdownId(null);
    }, 180);
  };

  const handleLogout = async () => {
    await logout();
    cyberInfo("Sesión cerrada correctamente.", "[SESIÓN]");
  };

  return (
    <>
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 px-4 md:px-8 lg:px-12">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={ROUTES.home}
            className="glitch text-xl sm:text-2xl font-display font-bold tracking-tight shrink-0"
            data-text="INMORTAL GAMING"
          >
            INMORTAL GAMING
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-5 lg:gap-7 md:flex">


            {/* Dynamic first 3 categories with Mega-Dropdown */}
            {categories.map((category) => {
              const categorySlugOrId = category.slug || category.id.toString();
              const subcategories = subcategoriesMap[category.id] || [];
              const isDropdownOpen = activeDropdownId === category.id;

              return (
                <div
                  key={category.id}
                  className="relative flex items-center"
                  onPointerEnter={() => handleMouseEnter(category.id)}
                  onPointerLeave={handleMouseLeave}
                >
                  <Link
                    href={ROUTES.catalogCategory(categorySlugOrId)}
                    className={`inline-flex items-center gap-1.5 font-body text-sm font-semibold transition-colors ${
                      isDropdownOpen
                        ? "text-neon-primary"
                        : "text-text-secondary hover:text-neon-primary"
                    }`}
                  >
                    <span>{category.category_name}</span>
                    {subcategories.length > 0 && (
                      <ChevronDownIcon
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          isDropdownOpen
                            ? "rotate-180 text-neon-primary"
                            : "text-text-muted"
                        }`}
                      />
                    )}
                  </Link>

                  {/* Mega-Dropdown */}
                  {subcategories.length > 0 && (
                    <NavbarCategoryDropdown
                      category={category}
                      subcategories={subcategories}
                      subproductsMap={subproductsMap}
                      isOpen={isDropdownOpen}
                      onClose={() => setActiveDropdownId(null)}
                    />
                  )}
                </div>
              );
            })}

            {STATIC_NAV_LINKS.filter((l) => l.href !== ROUTES.catalog).map(
              (link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm font-semibold text-text-secondary transition-colors hover:text-neon-primary"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          {/* Search Trigger (Desktop & Tablet) */}
          <div className="hidden md:flex flex-1 max-w-xs justify-end">
            <NavbarSearchTrigger
              onClick={() => setSearchOpen(true)}
              className="w-48 lg:w-56"
            />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 text-text-secondary transition-colors hover:text-neon-primary md:hidden cursor-pointer"
              aria-label="Buscar en el catálogo"
            >
              <SearchIcon className="h-5 w-5" />
            </button>

            <Link
              href={ROUTES.catalog}
              className="font-body text-sm font-semibold text-text-secondary transition-colors hover:text-neon-primary"
            >
              Catálogo
            </Link>

            {/* Cart */}
            <Link
              href={ROUTES.cart}
              className="relative p-2 text-text-secondary transition-colors hover:text-neon-primary"
              aria-label={`Carrito (${totalItems} items)`}
            >
              <CartIcon className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-neon-primary px-1 text-[10px] font-bold text-black shadow-[0_0_8px_rgba(0,240,255,0.6)]">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href={ROUTES.profile}
                  className="flex max-w-[160px] items-center gap-2 rounded border border-border-subtle bg-bg-surface px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-neon-primary/50 hover:text-neon-primary"
                  title="Ver perfil"
                >
                  <UsersIcon className="h-4 w-4 shrink-0 text-neon-primary" />
                  <span className="truncate">{email}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer rounded border border-neon-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-neon-primary transition-colors hover:bg-neon-primary/10"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="btn-neon hidden rounded px-4 py-2 text-xs font-semibold uppercase tracking-wider sm:inline-flex cursor-pointer"
              >
                Ingresar
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              className="p-2 text-text-secondary transition-colors hover:text-neon-primary md:hidden cursor-pointer"
              aria-label="Abrir menú móvil"
              type="button"
              onClick={() => setMobileOpen(true)}
            >
              {mobileOpen ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-in Mobile Drawer */}
      <NavbarMobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categories}
        subcategoriesMap={subcategoriesMap}
        subproductsMap={subproductsMap}
        isAuthenticated={isAuthenticated}
        email={email}
        totalItems={totalItems}
        onLogout={handleLogout}
        onOpenLogin={() => setLoginOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
