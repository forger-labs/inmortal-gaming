"use client";

import type { LandingItemEntity } from "@shared/types";
import { useEffect, useState } from "react";

import { ProductSlider } from "@/components/catalog/ProductSlider";
import { ProductSliderSkeleton } from "@/components/catalog/ProductSliderSkeleton";
import { LandingHero } from "@/components/hero/LandingHero";
import { NodeBackground } from "@/components/hero/NodeBackground";
import { webApi } from "@/libs/webApi";

export default function Home() {
  const [landingItems, setLandingItems] = useState<LandingItemEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function fetchLandingSections() {
      setLoading(true);
      try {
        const response = await webApi.getLandingItems(1, 50, "true");
        if (!isCancelled) {
          setLandingItems(response.items || []);
        }
      } catch (err: unknown) {
        console.error("Error al obtener secciones de landing:", err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchLandingSections();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <main className="relative">
      <NodeBackground />

      {/* Hero — the single focal point */}
      <LandingHero />

      {/* Catalog band */}
      <div className="relative mx-auto w-full max-w-7xl space-y-20 px-6 pb-16 pt-12 md:px-12 md:pt-12 md:pb-16">
        {loading ? (
          <>
            <ProductSliderSkeleton />
            <ProductSliderSkeleton />
          </>
        ) : (
          landingItems.map((item) => (
            <ProductSlider key={item.id} item={item} />
          ))
        )}
      </div>

      {/* Offers */}
      {/*<OffersSection />*/}
    </main>
  );
}
