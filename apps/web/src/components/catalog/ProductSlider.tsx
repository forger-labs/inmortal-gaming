"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@shared/icons";
import { getR2ImageUrl } from "@shared/utils";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";

import { webApi } from "@/libs/webApi";
import type { ProductDisplay, ProductSliderProps } from "@/types";
import { ProductCard } from "./ProductCard";
import { ProductSliderSkeleton } from "./ProductSliderSkeleton";

const CATEGORY_COLOR_ROTATION: ProductDisplay["categoryColor"][] = [
  "neon-purple",
  "neon-pink",
  "neon-green",
  "neon-amber",
];

export function ProductSlider({ item }: ProductSliderProps) {
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, slidesToScroll: 1, dragFree: false, align: "start" },
    [
      Autoplay({
        playOnInit: true,
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const limit = item.qt_products_show > 0 ? item.qt_products_show : 12;
        const categoryId = item.category_id ?? 0;
        const subcategoryId = item.sub_category_id ?? 0;

        let itemsToDisplay: ProductDisplay[] = [];

        if (subcategoryId !== 0 && Number(subcategoryId) !== 0) {
          const res = await webApi.getSubProductItems(1, limit, subcategoryId, undefined, true);
          itemsToDisplay = res.items.map((subProduct, index) => {
            const rawPrice =
              typeof subProduct.price === "number"
                ? subProduct.price
                : Number(subProduct.price) || 0;
            return {
              id: String(subProduct.id),
              name: subProduct.name,
              description:
                typeof subProduct.product_data === "object"
                  ? JSON.stringify(subProduct.product_data)
                  : "",
              category: "game-items",
              displayCategory: "Subproducto",
              categoryColor:
                CATEGORY_COLOR_ROTATION[index % CATEGORY_COLOR_ROTATION.length],
              price: rawPrice,
              stockStatus: subProduct.is_active ? "available" : "out-of-stock",
              image: getR2ImageUrl(subProduct.image),
              itemType: "subproduct",
            };
          });
        } else if (categoryId !== 0 && Number(categoryId) !== 0) {
          const res = await webApi.getProductItems(1, limit, categoryId, true);
          itemsToDisplay = res.items.map((prod, index) => ({
            id: String(prod.id),
            name: prod.name,
            description: prod.description || "",
            category: "game-items",
            displayCategory: "Producto",
            categoryColor:
              CATEGORY_COLOR_ROTATION[index % CATEGORY_COLOR_ROTATION.length],
            price: 0,
            stockStatus: prod.is_active ? "available" : "out-of-stock",
            image: getR2ImageUrl(prod.image),
            itemType: "product",
          }));
        }

        if (!isCancelled) {
          setProducts(itemsToDisplay);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const msg =
            err instanceof Error ? err.message : "Error al cargar productos";
          setError(msg);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [item]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    onScroll();

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("scroll", onScroll);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("scroll", onScroll);
    };
  }, [emblaApi, onSelect, onScroll]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  if (loading) {
    return (
      <ProductSliderSkeleton
        title={item.title}
        description={item.description}
      />
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  const sectionId = `landing-section-${item.id}`;
  const catalogQueryParam = item.category_id
    ? `categoria=${encodeURIComponent(item.category_id)}`
    : item.sub_category_id
      ? `subcategoria=${encodeURIComponent(item.sub_category_id)}`
      : "";

  return (
    <section
      id={sectionId}
      className="group/section relative border-b border-neon-purple/25 pb-4 pt-4 md:pb-14 overflow-hidden"
    >
      {/* Ambient Colorful Neon Glow Effects */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-neon-primary/10 blur-[90px] transition-all duration-700 group-hover/section:bg-neon-primary/20" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-neon-purple/15 blur-[100px] transition-all duration-700 group-hover/section:bg-neon-pink/15" />

      {/* Cyber Corner Decors */}
      <div className="pointer-events-none absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-neon-primary/40" />
      <div className="pointer-events-none absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-neon-purple/40" />

      {/* Header Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="pl-2 relative">
          {/* Signal Indicator & Equalizer Waveform */}
          <div className="mb-2 flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-primary shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            </span>

            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neon-primary">
              Destacados en vivo
            </span>

            {/* Micro Waveform Equalizer */}
            <div className="flex h-3 items-end gap-0.5 ml-1">
              <span className="waveform-bar h-full !w-[3px]" />
              <span className="waveform-bar h-full !w-[3px]" />
              <span className="waveform-bar h-full !w-[3px]" />
              <span className="waveform-bar h-full !w-[3px]" />
            </div>
          </div>

          <h3 className="pl-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary group-hover/section:text-glow transition-all">
            {item.title}
          </h3>

          {item.description && (
            <p className="pl-2  mt-1 font-body text-sm text-text-secondary max-w-xl">
              {item.description}
            </p>
          )}
        </div>

        {/* Controls, Tracker & Catalog Link */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
          {/* Active slide counter */}
          <div className="hidden xs:flex items-center gap-1 font-mono text-xs text-text-muted bg-bg-surface/80 border border-border-subtle px-2.5 py-1 rounded-lg shadow-inner">
            <span className="font-bold text-neon-primary">
              {String(selectedIndex + 1).padStart(2, "0")}
            </span>
            <span>/</span>
            <span>{String(products.length).padStart(2, "0")}</span>
          </div>

          {catalogQueryParam && (
            <Link
              href={`/catalog?${catalogQueryParam}`}
              className="inline-flex items-center gap-1 font-body text-xs sm:text-sm font-semibold text-neon-primary hover:text-white transition-colors py-1"
            >
              <span>Ver catálogo</span>
              <span className="transition-transform group-hover/section:translate-x-0.5">
                →
              </span>
            </Link>
          )}

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label={`Ver productos anteriores de ${item.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neon-primary/40 bg-bg-surface text-neon-primary shadow-[0_0_12px_rgba(0,240,255,0.1)] transition-all hover:border-neon-primary hover:bg-neon-primary hover:text-bg-primary hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-bg-surface/40 disabled:text-text-muted disabled:shadow-none"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label={`Ver siguientes productos de ${item.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neon-primary/40 bg-bg-surface text-neon-primary shadow-[0_0_12px_rgba(0,240,255,0.1)] transition-all hover:border-neon-primary hover:bg-neon-primary hover:text-bg-primary hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-bg-surface/40 disabled:text-text-muted disabled:shadow-none"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Scroll Progress Sweep Line */}
      <div className="mb-4 h-[2px] w-full overflow-hidden rounded-full bg-border-subtle/50">
        <div
          className="h-full bg-gradient-to-r from-neon-primary via-neon-purple to-neon-pink transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.7)]"
          style={{ width: `${Math.max(5, scrollProgress)}%` }}
        />
      </div>

      {/* Viewport & Embla Container */}
      <div className="relative overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex touch-pan-y -mr-4 py-2">
          {products.map((product, index) => (
            <div
              key={`${product.id}-${product.name}`}
              style={{ "--i": index } as CSSProperties}
              className="card-in min-w-0 shrink-0 grow-0 basis-full pr-4 sm:basis-1/2 lg:basis-1/3 transition-transform duration-300 hover:z-10"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Cyberpunk Pagination Dots / Capsules */}
      {scrollSnaps.length > 1 && scrollSnaps.length <= 15 && (
        <div className="mt-5 flex items-center justify-center gap-1.5">
          {scrollSnaps.map((snapPosition, snapIdx) => {
            const isActive = selectedIndex === snapIdx;
            return (
              <button
                key={`bullet-snap-${snapPosition}`}
                type="button"
                onClick={() => scrollTo(snapIdx)}
                aria-label={`Ir a la diapositiva ${snapIdx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "w-6 bg-neon-primary shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                    : "w-1.5 bg-border-subtle hover:bg-neon-primary/40"
                }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
