import { ChevronRightIcon } from "@shared/icons";
import type {
  CategoryEntity,
  SubcategoryEntity,
  SubProductEntity,
} from "@shared/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SubcategoryProductsCatalogView } from "@/components/catalog/SubcategoryProductsCatalogView";
import { ROUTES } from "@/constants";
import { webApi } from "@/libs/webApi";

interface SubcategoryPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export async function generateMetadata({
  params,
}: SubcategoryPageProps): Promise<Metadata> {
  const { subcategory: subcategoryParam } = await params;
  const decodedSubcat = decodeURIComponent(subcategoryParam);

  try {
    const isSubcatNumeric = /^\d+$/.test(decodedSubcat);
    const subcategory = isSubcatNumeric
      ? await webApi.getSubcategoryById(decodedSubcat)
      : await webApi.getSubcategoryByName(decodedSubcat);

    if (subcategory) {
      return {
        title: `${subcategory.subcategory_name} — Catálogo`,
        description: `Explora todos los ítems, monedas, cuentas y subproductos disponibles en ${subcategory.subcategory_name}.`,
      };
    }
  } catch {
    // Fallback metadata
  }

  return {
    title: "Catálogo de Subcategoría",
  };
}

export default async function SubcategoryPage({
  params,
}: SubcategoryPageProps) {
  const { category: categoryParam, subcategory: subcategoryParam } =
    await params;
  const decodedCat = decodeURIComponent(categoryParam);
  const decodedSubcat = decodeURIComponent(subcategoryParam);

  let category: CategoryEntity | null = null;
  let subcategory: SubcategoryEntity | null = null;
  let initialSubproducts: SubProductEntity[] = [];
  let initialTotal = 0;

  try {
    const isCatNumeric = /^\d+$/.test(decodedCat);
    if (isCatNumeric) {
      category = await webApi.getCategoryById(decodedCat);
    } else {
      category = await webApi.getCategoryByName(decodedCat);
    }
  } catch (err) {
    console.error("Error al buscar categoría:", err);
  }

  try {
    const isSubcatNumeric = /^\d+$/.test(decodedSubcat);
    if (isSubcatNumeric) {
      subcategory = await webApi.getSubcategoryById(decodedSubcat);
    } else {
      subcategory = await webApi.getSubcategoryByName(decodedSubcat);
    }
  } catch (err) {
    console.error("Error al buscar subcategoría:", err);
  }

  if (!subcategory || !subcategory.id) {
    notFound();
  }

  try {
    const subprodRes = await webApi.getSubProducts(1, 12, {
      subcategoryId: subcategory.id,
      isActive: true,
    });
    initialSubproducts = subprodRes.items || [];
    initialTotal = subprodRes.total || 0;
  } catch (err) {
    console.error("Error al cargar subproductos iniciales:", err);
  }

  const categorySlugOrId = category
    ? category.slug || category.id.toString()
    : decodedCat;
  const categoryDisplayName = category ? category.category_name : decodedCat;

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs text-text-muted"
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
          <Link
            href={ROUTES.catalogCategory(categorySlugOrId)}
            className="transition-colors hover:text-neon-primary"
          >
            {categoryDisplayName}
          </Link>
          <ChevronRightIcon className="h-3 w-3" />
          <span className="text-neon-primary font-semibold">
            {subcategory.subcategory_name}
          </span>
        </nav>

        {/* Subcategory Header */}
        <header className="mb-10 max-w-3xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            {subcategory.subcategory_name}
          </h1>
          <p className="mt-3 font-body text-base leading-relaxed text-text-secondary sm:text-lg">
            Explora todos los ítems y subproductos disponibles en{" "}
            <strong className="text-text-primary">
              {subcategory.subcategory_name}
            </strong>{" "}
            para la categoría{" "}
            <strong className="text-text-primary">{categoryDisplayName}</strong>
            .
          </p>
        </header>

        {/* Subcategory Products Catalog Interactive View */}
        <SubcategoryProductsCatalogView
          category={
            category || {
              id: subcategory.category_id,
              category_name: categoryDisplayName,
            }
          }
          subcategory={subcategory}
          initialSubproducts={initialSubproducts}
          initialTotal={initialTotal}
        />
      </div>
    </main>
  );
}
