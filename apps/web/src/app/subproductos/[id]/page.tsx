import type { Metadata } from "next";
import { SubproductView } from "@/components/subproduct/SubproductView";
import { webApi } from "@/libs/webApi";
import type { SubproductPageProps } from "@/types";

export async function generateMetadata({
  params,
}: SubproductPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const subproduct = await webApi.getSubproductById(id);
    if (!subproduct) {
      return {
        title: "Subproducto",
      };
    }

    const title = subproduct.name;
    const description = `Adquiere ${subproduct.name} en Inmortal Gaming. Disponibilidad inmediata y soporte directo vía WhatsApp.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: subproduct.image ? [{ url: subproduct.image }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: subproduct.image ? [subproduct.image] : undefined,
      },
    };
  } catch {
    return {
      title: "Subproducto",
    };
  }
}

export default async function SubproductPage({ params }: SubproductPageProps) {
  const { id } = await params;
  return <SubproductView subproductId={id} />;
}
