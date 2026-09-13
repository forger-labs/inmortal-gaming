import type { CatalogSubcategory, CatalogSubProduct } from "@shared/types";
import { motion } from "framer-motion";

import { EASE_OUT_EXPO } from "@/constants";
import { ProductSubproductCard } from "./ProductSubproductCard";

interface FlattenedSubProduct {
  subproduct: CatalogSubProduct;
  serverName: string;
  serverId: number;
}

interface ProductSubcategorySectionProps {
  subcategory: CatalogSubcategory;
  selectedServerId: number | "all";
}

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT_EXPO },
  },
};

export function ProductSubcategorySection({
  subcategory,
  selectedServerId,
}: ProductSubcategorySectionProps) {
  // Collect all subproducts for this subcategory across servers
  const items: FlattenedSubProduct[] = [];

  subcategory.servers?.forEach((server) => {
    if (selectedServerId !== "all" && server.id !== selectedServerId) {
      return;
    }
    server.sub_products?.forEach((subproduct) => {
      items.push({
        subproduct,
        serverName: server.server_name,
        serverId: server.id,
      });
    });
  });

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      {/* Subcategory Header */}
      <div className="mb-6 flex items-end justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1 rounded-sm bg-neon-purple" />
          <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-text-primary">
            {subcategory.subcategory_name}
          </h3>
        </div>
        <span className="font-mono text-xs text-text-secondary">
          {items.length} {items.length === 1 ? "SUBPRODUCTO" : "SUBPRODUCTOS"}
        </span>
      </div>

      {/* Subproducts Grid */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {items.map(({ subproduct, serverName }) => (
          <motion.div key={subproduct.id} variants={cardVariants}>
            <ProductSubproductCard
              subproduct={subproduct}
              serverName={serverName}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
