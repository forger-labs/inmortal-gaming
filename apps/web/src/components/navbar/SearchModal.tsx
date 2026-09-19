"use client";

import {
  ChevronRightIcon,
  CloseIcon,
  ProductsIcon,
  SearchIcon,
} from "@shared/icons";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { EASE_OUT_EXPO, ROUTES } from "@/constants";
import { webApi } from "@/libs/webApi";
import type { SearchItemResult, SearchResultsGrouped } from "@/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const searchInputId = useId();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<SearchResultsGrouped>({
    products: [],
    subproducts: [],
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Flattened list for keyboard navigation
  const flatItems = useMemo<SearchItemResult[]>(
    () => [...results.products, ...results.subproducts],
    [results.products, results.subproducts],
  );

  // Debounced search query
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults({ products: [], subproducts: [] });
      setHasSearched(false);
      setSelectedIndex(0);
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length === 0) {
      setResults({ products: [], subproducts: [] });
      setHasSearched(false);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const [prodRes, subprodRes] = await Promise.allSettled([
          webApi.getProducts(1, 12, { name: trimmed, isActive: true }),
          webApi.getSubProducts(1, 12, { name: trimmed, isActive: true }),
        ]);

        if (!isMounted) return;

        const products: SearchItemResult[] =
          prodRes.status === "fulfilled" && prodRes.value.items
            ? prodRes.value.items.map((p) => ({
                id: p.id,
                name: p.name,
                type: "product" as const,
                href: ROUTES.product(p.id),
              }))
            : [];

        const subproducts: SearchItemResult[] =
          subprodRes.status === "fulfilled" && subprodRes.value.items
            ? subprodRes.value.items.map((sp) => ({
                id: sp.id,
                name: sp.name,
                type: "subproduct" as const,
                href: ROUTES.subproduct(sp.id),
              }))
            : [];

        setResults({ products, subproducts });
        setHasSearched(true);
        setSelectedIndex(0);
      } catch (err) {
        console.error("Error buscando productos o subproductos:", err);
        if (isMounted) {
          setResults({ products: [], subproducts: [] });
          setHasSearched(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query, isOpen]);

  // Lock body scroll and focus input when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = previousOverflow;
      clearTimeout(focusTimer);
    };
  }, [isOpen]);

  // Global escape handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Keyboard navigation across flat items
  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (flatItems.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % flatItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + flatItems.length) % flatItems.length,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const activeItem = flatItems[selectedIndex];
        if (activeItem) {
          onClose();
          router.push(activeItem.href);
        }
      }
    },
    [flatItems, selectedIndex, onClose, router],
  );

  const totalResultsCount =
    results.products.length + results.subproducts.length;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="search-palette-backdrop"
            className="fixed inset-0 z-60 flex items-start justify-center p-3 pt-14 sm:p-6 sm:pt-24 md:pt-28"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Modal Dialog Container */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Buscar productos y subproductos"
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
              className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-neon-primary/40 bg-bg-elevated shadow-[0_0_50px_rgba(0,240,255,0.22)] max-h-[82vh]"
            >
              {/* Top Search Input Bar */}
              <div className="relative flex items-center border-b border-border-subtle bg-bg-surface/90 px-4 py-3.5">
                <SearchIcon className="h-5 w-5 shrink-0 text-neon-primary" />
                <label htmlFor={searchInputId} className="sr-only">
                  Buscar productos o subproductos
                </label>
                <input
                  ref={inputRef}
                  id={searchInputId}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar productos o subproductos..."
                  autoComplete="off"
                  spellCheck={false}
                  className="flex-1 bg-transparent px-3 font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />

                {query.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    className="mr-2 rounded p-1 text-text-muted transition-colors hover:text-text-primary"
                    aria-label="Limpiar busqueda"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded border border-border-subtle bg-bg-surface px-2 py-0.5 font-mono text-[11px] font-bold text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary"
                  aria-label="Cerrar modal de busqueda"
                >
                  ESC
                </button>

                {/* Loading indicator bar */}
                {loading && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden bg-bg-primary">
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-neon-primary to-transparent animate-pulse" />
                  </div>
                )}
              </div>

              {/* Modal Body / Results Area */}
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto p-3 sm:p-4 text-sm"
              >
                {/* Empty query state: helpful guidance */}
                {query.trim().length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neon-primary/20 bg-neon-primary/5 text-neon-primary shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                      <SearchIcon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display text-base font-bold text-text-primary">
                      Busca en todo el catalogo
                    </h3>
                    <p className="mt-1 max-w-sm font-body text-xs text-text-secondary">
                      Escribe el nombre de un juego, producto o subproducto para
                      ver coincidencias instantaneas.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                      <span className="font-mono text-[11px] text-text-muted">
                        Accesos directos:
                      </span>
                      <Link
                        href={ROUTES.catalog}
                        onClick={onClose}
                        className="rounded-lg border border-border-subtle bg-bg-surface px-2.5 py-1 font-body text-xs text-text-secondary transition-colors hover:border-neon-primary hover:text-neon-primary"
                      >
                        Catalogo Completo
                      </Link>
                    </div>
                  </div>
                )}

                {/* No results state */}
                {query.trim().length > 0 &&
                  !loading &&
                  hasSearched &&
                  totalResultsCount === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border-subtle bg-bg-surface text-text-muted">
                        <ProductsIcon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-display text-base font-bold text-text-primary">
                        No se encontraron resultados
                      </h3>
                      <p className="mt-1.5 font-body text-xs text-text-secondary">
                        No hay coincidencias para &quot;
                        <span className="text-neon-primary">{query}</span>
                        &quot;.
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-text-muted">
                        Intenta con otra palabra clave o busca en el catalogo
                        general.
                      </p>
                    </div>
                  )}

                {/* Populated Results Grouped by Type */}
                {totalResultsCount > 0 && (
                  <div className="flex flex-col gap-5">
                    {/* Products Section */}
                    {results.products.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center justify-between px-2">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-neon-primary shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                            <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                              Productos
                            </span>
                          </div>
                          <span className="rounded bg-neon-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-neon-primary border border-neon-primary/30">
                            {results.products.length}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          {results.products.map((product, idx) => {
                            const isSelected = selectedIndex === idx;
                            return (
                              <Link
                                key={`prod-${product.id}`}
                                href={product.href}
                                onClick={onClose}
                                onPointerEnter={() => setSelectedIndex(idx)}
                                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-150 ${
                                  isSelected
                                    ? "bg-neon-primary/15 border border-neon-primary/50 text-text-primary shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                                    : "border border-transparent hover:bg-bg-surface-hover text-text-secondary hover:text-text-primary"
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="shrink-0 rounded border border-neon-primary/40 bg-neon-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-neon-primary">
                                    Producto
                                  </span>
                                  <span className="truncate font-body text-sm font-semibold group-hover:text-neon-primary transition-colors">
                                    {product.name}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1 font-mono text-xs text-text-muted group-hover:text-neon-primary shrink-0 transition-colors">
                                  <span className="hidden sm:inline text-[11px]">
                                    Ir al item
                                  </span>
                                  <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Subproducts Section */}
                    {results.subproducts.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center justify-between px-2">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-neon-purple shadow-[0_0_8px_rgba(123,45,255,0.8)]" />
                            <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                              Subproductos
                            </span>
                          </div>
                          <span className="rounded bg-neon-purple/10 px-2 py-0.5 font-mono text-[10px] font-bold text-neon-purple border border-neon-purple/30">
                            {results.subproducts.length}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          {results.subproducts.map((subproduct, idx) => {
                            const actualIndex = results.products.length + idx;
                            const isSelected = selectedIndex === actualIndex;
                            return (
                              <Link
                                key={`subprod-${subproduct.id}`}
                                href={subproduct.href}
                                onClick={onClose}
                                onPointerEnter={() =>
                                  setSelectedIndex(actualIndex)
                                }
                                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-150 ${
                                  isSelected
                                    ? "bg-neon-purple/15 border border-neon-purple/50 text-text-primary shadow-[0_0_15px_rgba(123,45,255,0.15)]"
                                    : "border border-transparent hover:bg-bg-surface-hover text-text-secondary hover:text-text-primary"
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="shrink-0 rounded border border-neon-purple/40 bg-neon-purple/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-neon-purple">
                                    Subproducto
                                  </span>
                                  <span className="truncate font-body text-sm font-semibold group-hover:text-neon-purple transition-colors">
                                    {subproduct.name}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1 font-mono text-xs text-text-muted group-hover:text-neon-purple shrink-0 transition-colors">
                                  <span className="hidden sm:inline text-[11px]">
                                    Ir al item
                                  </span>
                                  <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Keyboard Shortcuts Footer */}
              <div className="flex items-center justify-between border-t border-border-subtle bg-bg-surface/90 px-4 py-2.5 font-mono text-[11px] text-text-muted">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border border-white/10 bg-bg-primary px-1.5 py-0.5 text-[10px]">
                      ↑
                    </kbd>
                    <kbd className="rounded border border-white/10 bg-bg-primary px-1.5 py-0.5 text-[10px]">
                      ↓
                    </kbd>
                    <span>Navegar</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border border-white/10 bg-bg-primary px-1.5 py-0.5 text-[10px]">
                      ↵
                    </kbd>
                    <span>Seleccionar</span>
                  </span>
                </div>

                <div className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-white/10 bg-bg-primary px-1.5 py-0.5 text-[10px]">
                    ESC
                  </kbd>
                  <span>Cerrar</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
