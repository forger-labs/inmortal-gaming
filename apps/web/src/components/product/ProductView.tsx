"use client";

import type { ProductCatalogEntity } from "@shared/types";
import { MotionConfig, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { EASE_OUT_EXPO } from "@/constants";
import { webApi } from "@/libs/webApi";
import { ProductBreadcrumbs } from "./ProductBreadcrumbs";
import { ProductHero } from "./ProductHero";
import { ProductNotFound } from "./ProductNotFound";
import type { ServerOption } from "./ProductServers";
import { ProductServers } from "./ProductServers";
import { ProductSkeleton } from "./ProductSkeleton";
import { ProductSubcategorySection } from "./ProductSubcategorySection";

interface ProductViewProps {
  productId: string | number;
}

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT_EXPO },
  },
};

export function ProductView({ productId }: ProductViewProps) {
  const [product, setProduct] = useState<ProductCatalogEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServerId, setSelectedServerId] = useState<number | "all">(
    "all",
  );

  useEffect(() => {
    let isCancelled = false;

    async function loadProduct() {
      if (!productId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await webApi.getProductCatalog(productId);
        if (!isCancelled) {
          setProduct(data);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const msg =
            err instanceof Error
              ? err.message
              : "Error al cargar la informacion del producto";
          setError(msg);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isCancelled = true;
    };
  }, [productId]);

  const handleRetry = () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    webApi
      .getProductCatalog(productId)
      .then((data) => setProduct(data))
      .catch((err: unknown) => {
        const msg =
          err instanceof Error
            ? err.message
            : "Error al cargar la informacion del producto";
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  // Aggregate unique servers and total subproducts (deduplicated)
  const { serverOptions, totalServersCount, totalSubproductsCount } =
    useMemo(() => {
      if (!product || !product.subcategories) {
        return {
          serverOptions: [],
          totalServersCount: 0,
          totalSubproductsCount: 0,
        };
      }

      let totalSubs = 0;
      const serverSubCountMap = new Map<number, number>();
      const serverNameMap = new Map<number, string>();

      // Register product-level servers if present
      product.servers?.forEach((srv) => {
        serverNameMap.set(srv.id, srv.server_name);
        serverSubCountMap.set(srv.id, 0);
      });

      product.subcategories.forEach((subcat) => {
        if (Array.isArray(subcat.subproducts)) {
          totalSubs += subcat.subproducts.length;
          subcat.subproducts.forEach((sub) => {
            sub.servers?.forEach((srv) => {
              const currentCount = serverSubCountMap.get(srv.id) || 0;
              serverSubCountMap.set(srv.id, currentCount + 1);
              console.log(serverSubCountMap);
            });
          });
        } else if (Array.isArray(subcat.servers)) {
          subcat.servers.forEach((server) => {
            const subCount = server.sub_products?.length || 0;
            totalSubs += subCount;
            serverNameMap.set(server.id, server.server_name);
            const currentCount = serverSubCountMap.get(server.id) || 0;
            serverSubCountMap.set(server.id, currentCount + subCount);
          });
        }
      });

      const options: ServerOption[] = [
        {
          id: "all",
          name: "Todos los servidores",
          subproductsCount: totalSubs,
        },
      ];

      serverNameMap.forEach((name, id) => {
        options.push({
          id,
          name,
          subproductsCount: serverSubCountMap.get(id) || 0,
        });
      });

      return {
        serverOptions: options,
        totalServersCount: serverNameMap.size,
        totalSubproductsCount: totalSubs,
      };
    }, [product]);

  if (loading) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
    return (
      <ProductNotFound
        message={error || "El producto no existe o fue deshabilitado."}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="pt-20 pb-20">
        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto w-full max-w-7xl px-6 md:px-12"
        >
          {/* Breadcrumbs Navigation */}
          <ProductBreadcrumbs
            categoryName={product.category?.category_name}
            productName={product.name}
            isActive={product.is_active}
          />

          {/* Hero / General Info Section */}
          <ProductHero
            product={product}
            totalServersCount={totalServersCount}
            totalSubproductsCount={totalSubproductsCount}
          />

          {/* Servers Filter & Showcase */}
          <ProductServers
            servers={serverOptions}
            selectedServerId={selectedServerId}
            onSelectServer={setSelectedServerId}
          />

          {/* Subproducts by Subcategory */}
          <div className="space-y-4">
            {product.subcategories && product.subcategories.length > 0 ? (
              product.subcategories.map((subcategory) => (
                <ProductSubcategorySection
                  key={subcategory.id}
                  subcategory={subcategory}
                  selectedServerId={selectedServerId}
                />
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border-subtle bg-bg-surface/50 p-12 text-center font-mono text-sm text-text-muted">
                NO HAY SUBPRODUCTOS DISPONIBLES PARA ESTE PRODUCTO.
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </MotionConfig>
  );
}
