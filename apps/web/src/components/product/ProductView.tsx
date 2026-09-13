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

  // Aggregate unique servers and total subproducts
  const { serverOptions, totalServersCount, totalSubproductsCount } =
    useMemo(() => {
      if (!product || !product.subcategories) {
        return {
          serverOptions: [],
          totalServersCount: 0,
          totalSubproductsCount: 0,
        };
      }

      const serverMap = new Map<number, { name: string; count: number }>();
      let totalSubs = 0;

      product.subcategories.forEach((subcat) => {
        subcat.servers?.forEach((server) => {
          const subCount = server.sub_products?.length || 0;
          totalSubs += subCount;

          const existing = serverMap.get(server.id);
          if (existing) {
            existing.count += subCount;
          } else {
            serverMap.set(server.id, {
              name: server.server_name,
              count: subCount,
            });
          }
        });
      });

      const options: ServerOption[] = [
        {
          id: "all",
          name: "Todos los servidores",
          subproductsCount: totalSubs,
        },
      ];

      serverMap.forEach((data, id) => {
        options.push({
          id,
          name: data.name,
          subproductsCount: data.count,
        });
      });

      return {
        serverOptions: options,
        totalServersCount: serverMap.size,
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
