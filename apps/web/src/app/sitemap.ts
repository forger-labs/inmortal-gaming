import type { MetadataRoute } from "next";
import { webApi } from "@/libs/webApi";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://inmortalgaming.com";

  // Rutas estáticas principales
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  let categoryRoutes: MetadataRoute.Sitemap = [];
  let productRoutes: MetadataRoute.Sitemap = [];
  let subproductRoutes: MetadataRoute.Sitemap = [];

  try {
    const [categoriesRes, productsRes, subproductsRes] =
      await Promise.allSettled([
        webApi.getCategories(1, 100),
        webApi.getProducts(1, 100, { isActive: true }),
        webApi.getSubProducts(1, 100, { isActive: true }),
      ]);

    if (categoriesRes.status === "fulfilled" && categoriesRes.value?.items) {
      categoryRoutes = categoriesRes.value.items.map((cat) => ({
        url: `${baseUrl}/catalog/${encodeURIComponent(cat.category_name)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }

    if (productsRes.status === "fulfilled" && productsRes.value?.items) {
      productRoutes = productsRes.value.items.map((prod) => ({
        url: `${baseUrl}/productos/${prod.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }

    if (subproductsRes.status === "fulfilled" && subproductsRes.value?.items) {
      subproductRoutes = subproductsRes.value.items.map((sub) => ({
        url: `${baseUrl}/subproductos/${sub.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.error("Error al generar sitemap dinámico:", err);
  }

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...subproductRoutes,
  ];
}
