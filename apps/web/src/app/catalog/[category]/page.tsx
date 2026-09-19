import { ChevronRightIcon } from "@shared/icons";
import type { CategoryEntity, ProductEntity } from "@shared/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryProductsCatalogView } from "@/components/catalog/CategoryProductsCatalogView";
import { ROUTES } from "@/constants";
import { webApi } from "@/libs/webApi";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: categoryParam } = await params;
  const decoded = decodeURIComponent(categoryParam);

  try {
    const isNumeric = /^\d+$/.test(decoded);
    const category = isNumeric
      ? await webApi.getCategoryById(decoded)
      : await webApi.getCategoryByName(decoded);

    if (category) {
      return {
        title: `${category.category_name} | Catálogo Inmortal Gaming`,
        description: `Explora todos los productos, cuentas, monedas y servicios disponibles para ${category.category_name}.`,
      };
    }
  } catch {
    // Fallback metadata
  }

  return {
    title: `Catálogo de Categoría | Inmortal Gaming`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categoryParam } = await params;
  const decoded = decodeURIComponent(categoryParam);

  let category: CategoryEntity | null = null;
  let initialProducts: ProductEntity[] = [];
  let initialTotal = 0;

  try {
    const isNumeric = /^\d+$/.test(decoded);
    if (isNumeric) {
      category = await webApi.getCategoryById(decoded);
    } else {
      category = await webApi.getCategoryByName(decoded);
    }
  } catch (err) {
    console.error("Error al buscar categoría:", err);
  }

  if (!category || !category.id) {
    notFound();
  }

  try {
    const prodRes = await webApi.getProducts(1, 12, {
      categoryId: category.id,
      isActive: true,
    });
    initialProducts = prodRes.items || [];
    initialTotal = prodRes.total || 0;
  } catch (err) {
    console.error("Error al cargar productos iniciales:", err);
  }

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 font-mono text-xs text-text-muted"
        >
          <Link
            href={ROUTES.home}
            className="transition-colors hover:text-neon-primary"
          >
            Inicio
          </Link>
          <ChevronRightIcon className="h-3 w-3" />
          <Link
            href={ROUTES.catalog}
            className="transition-colors hover:text-neon-primary"
          >
            Catálogo
          </Link>
          <ChevronRightIcon className="h-3 w-3" />
          <span className="text-neon-primary font-semibold">
            {category.category_name}
          </span>
        </nav>

        {/* Category Header */}
        <header className="mb-10 max-w-3xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            {category.category_name}
          </h1>
          <p className="mt-3 font-body text-base leading-relaxed text-text-secondary sm:text-lg">
            Explora todos los juegos, productos y servicios asociados a la
            categoría{" "}
            <strong className="text-text-primary">
              {category.category_name}
            </strong>
            .
          </p>
        </header>

        {/* Category Products Catalog Interactive View */}
        <CategoryProductsCatalogView
          category={category}
          initialProducts={initialProducts}
          initialTotal={initialTotal}
        />
      </div>
    </main>
  );
}
