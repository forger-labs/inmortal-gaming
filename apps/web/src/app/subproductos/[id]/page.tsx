import { SubproductView } from "@/components/subproduct/SubproductView";
import type { SubproductPageProps } from "@/types";

export default async function SubproductPage({ params }: SubproductPageProps) {
  const { id } = await params;
  return <SubproductView subproductId={id} />;
}
