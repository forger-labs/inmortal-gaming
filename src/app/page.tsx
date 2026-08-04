import { ProductSlider } from "@/components/catalog/ProductSlider";
import { LandingHero } from "@/components/hero/LandingHero";
import { NodeBackground } from "@/components/hero/NodeBackground";
import { OffersSection } from "@/components/offers/OffersSection";
import { PRODUCTS } from "@/data/products";

export default function Home() {
  return (
    <main className="px-10 py-20 space-y-20">
      <NodeBackground />
      <LandingHero />
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
      <OffersSection />
    </main>
  );
}
