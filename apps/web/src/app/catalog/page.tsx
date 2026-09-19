import { CategoriesIcon } from "@shared/icons";
import type {
  CategoryEntity,
  ProductEntity,
  SubcategoryEntity,
} from "@shared/types";
import type { Metadata } from "next";

import { CatalogHubView } from "@/components/catalog/CatalogHubView";
import { webApi } from "@/libs/webApi";

export const metadata: Metadata = {
  title: "Catálogo de Categorías | Inmortal Gaming",
  description:
    "Explora todas las categorías, juegos, monedas virtuales, cuentas y servicios disponibles en Inmortal Gaming.",
};

export const revalidate = 60;

export default async function CatalogPage() {
  let categories: CategoryEntity[] = [];
  let subcategories: SubcategoryEntity[] = [];
  const previewProductsMap: Record<number, ProductEntity[]> = {};

  try {
    const [catRes, subcatRes] = await Promise.all([
      webApi.getCategories(1, 50),
      webApi.getSubcategories(1, 100),
    ]);
    categories = catRes.items || [];
    subcategories = subcatRes.items || [];

    // Preload top products for each category to render rich visual banners
    const productPromises = categories.map(async (cat) => {
      try {
        const prodRes = await webApi.getProducts(1, 4, {
          categoryId: cat.id,
          isActive: true,
        });
        return { catId: cat.id, items: prodRes.items || [] };
      } catch {
        return { catId: cat.id, items: [] };
      }
    });

    const productsResults = await Promise.all(productPromises);
    for (const res of productsResults) {
      previewProductsMap[res.catId] = res.items;
    }
  } catch (error) {
    console.error("Error cargando datos del catálogo:", error);
  }

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        {/* Header Hero Section */}
        <header className="mb-12 max-w-3xl">
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-lg border border-neon-primary/40 bg-neon-primary/10 px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-neon-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <CategoriesIcon className="h-4 w-4" />
            <span>Marketplace Digital · Catálogo Central</span>
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Catálogo de Categorías
          </h1>

          <p className="mt-4 font-body text-base leading-relaxed text-text-secondary sm:text-lg">
            Explora juegos, monedas virtuales, cuentas verificadas y servicios
            digitales con entrega inmediata y máxima seguridad.
          </p>
        </header>

        {/* Catalog Hub Interactive View */}
        <CatalogHubView
          categories={categories}
          subcategories={subcategories}
          previewProductsMap={previewProductsMap}
        />
      </div>
    </main>
  );
}
