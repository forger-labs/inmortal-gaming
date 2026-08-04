"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import type { ProductSliderProps } from "@/types";
import { ProductCard } from "./ProductCard";

export function ProductSlider({
  id,
  title,
  description,
  category,
  products,
}: ProductSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, slidesToScroll: 1 },
    [Autoplay({ playOnInit: true, stopOnInteraction: false })],
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

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

  return (
    <section
      id={id}
      className="relative border-border-subtle border-b pb-8 md:pb-12"
    >
      {/* Header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl font-bold text-text-primary">
            {title}
          </h3>
          {description && (
            <p className="mt-1 font-body text-base text-text-secondary">
              {description}
            </p>
          )}
        </div>

        {/* Arrows + catalog link */}
        <div className="flex items-center gap-4">
          {category && (
            <Link
              href={`/catalogo?categoria=${encodeURIComponent(category)}`}
              className="font-body text-sm font-semibold text-neon-primary transition-colors hover:text-text-primary"
            >
              Ver más
            </Link>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label={`Previous ${title} products`}
              className="rounded-sm border border-neon-primary p-2 text-neon-primary transition-colors hover:bg-neon-primary/10 disabled:cursor-not-allowed disabled:border-border-subtle disabled:text-text-muted"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label={`Next ${title} products`}
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
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 shrink-0 grow-0 basis-full pr-4 sm:basis-1/2 lg:basis-1/3"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
