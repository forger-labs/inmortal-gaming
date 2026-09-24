import type { Metadata } from "next";
import { ProductView } from "@/components/product/ProductView";
import { webApi } from "@/libs/webApi";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await webApi.getProductById(id);
    if (!product) {
      return {
        title: "Producto",
      };
    }

    const title = product.name;
    const description =
      product.description?.trim() ||
      `Compra ${product.name} en Inmortal Gaming. Monedas virtuales, gift cards, ítems y servicios con entrega inmediata vía WhatsApp.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: product.image ? [{ url: product.image }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: product.image ? [product.image] : undefined,
      },
    };
  } catch {
    return {
      title: "Producto",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  return <ProductView productId={id} />;
}
