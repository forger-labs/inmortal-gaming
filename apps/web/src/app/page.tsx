import { ProductSlider } from "@/components/catalog/ProductSlider";
import { LandingHero } from "@/components/hero/LandingHero";
import { NodeBackground } from "@/components/hero/NodeBackground";
import { OffersSection } from "@/components/offers/OffersSection";
import { PRODUCTS } from "@/data/products";

export default function Home() {
  return (
    <main className="relative">
      <NodeBackground />

      {/* Hero — the single focal point */}
      <LandingHero />

      {/* Catalog band */}
      <div className="relative mx-auto w-full max-w-7xl space-y-20 px-6 py-20 md:px-12 md:py-24">
        <ProductSlider
          id="destacados"
          title="Más vendidos"
          description="Productos más vendidos actualmente"
          products={PRODUCTS.slice(0, 10)}
        />
        <ProductSlider
          id="in-game"
          title="Productos in-game"
          category="in-game"
          description="Productos más usados in-game"
          products={PRODUCTS.slice(0, 10)}
        />
        <ProductSlider
          id="gift-cards"
          title="Gift Cards"
          category="gift-cards"
          description="¡Compra tus gift cards favoritas!"
          products={PRODUCTS.slice(0, 10)}
        />
      </div>

      {/* Offers */}
      <OffersSection />
    </main>
  );
}
