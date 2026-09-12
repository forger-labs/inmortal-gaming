"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@shared/icons";
import { getR2ImageUrl } from "@shared/utils";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

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
    { loop: products.length > 3, slidesToScroll: 1, dragFree: true },
    [Autoplay({ playOnInit: true, stopOnInteraction: false })],
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const limit = item.qt_products_show > 0 ? item.qt_products_show : 10;
        const categoryId = item.category_id ?? 0;
        const subcategoryId = item.sub_category_id ?? 0;

        let itemsToDisplay: ProductDisplay[] = [];

        if (subcategoryId !== 0 && Number(subcategoryId) !== 0) {
          const res = await webApi.getSubProductItems(1, limit, subcategoryId);
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
            };
          });
        } else if (categoryId !== 0 && Number(categoryId) !== 0) {
          const res = await webApi.getProductItems(1, limit, categoryId);
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

  useEffect(() => {
    if (!emblaApi) return;

    const syncArrows = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    syncArrows();
    emblaApi.on("reInit", syncArrows);
    emblaApi.on("select", syncArrows);
  }, [emblaApi]);

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
      className="relative border-border-subtle border-b pb-8 md:pb-12"
    >
      {/* Header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl font-bold text-text-primary">
            {item.title}
          </h3>
          {item.description && (
            <p className="mt-1 font-body text-base text-text-secondary">
              {item.description}
            </p>
          )}
        </div>

        {/* Arrows + catalog link */}
        <div className="flex items-center gap-4">
          {catalogQueryParam && (
            <Link
              href={`/catalogo?${catalogQueryParam}`}
              className="font-body text-sm font-semibold text-neon-primary transition-colors hover:text-text-primary"
            >
              Ver mas
            </Link>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label={`Previous ${item.title} products`}
              className="rounded-sm border border-neon-primary p-2 text-neon-primary transition-colors hover:bg-neon-primary/10 disabled:cursor-not-allowed disabled:border-border-subtle disabled:text-text-muted"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label={`Next ${item.title} products`}
              className="rounded-sm border border-neon-primary p-2 text-neon-primary transition-colors hover:bg-neon-primary/10 disabled:cursor-not-allowed disabled:border-border-subtle disabled:text-text-muted"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {products.map((product, index) => (
            <div
              key={product.id}
              style={{ "--i": index } as CSSProperties}
              className="card-in min-w-0 shrink-0 grow-0 basis-full pr-4 sm:basis-1/2 lg:basis-1/3"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
