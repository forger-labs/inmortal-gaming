"use client";

import type {
  CategoryEntity,
  ProductEntity,
  ServerEntity,
  SubcategoryEntity,
  SubProductEntity,
} from "@shared/types";
import { MotionConfig, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { EASE_OUT_EXPO } from "@/constants";
import { webApi } from "@/libs/webApi";
import { SubproductActions } from "./SubproductActions";
import { SubproductBreadcrumbs } from "./SubproductBreadcrumbs";
import { SubproductDynamicData } from "./SubproductDynamicData";
import { SubproductHero } from "./SubproductHero";
import { SubproductImage } from "./SubproductImage";
import { SubproductNotFound } from "./SubproductNotFound";
import { SubproductServers } from "./SubproductServers";
import { SubproductSkeleton } from "./SubproductSkeleton";

interface SubproductViewProps {
  subproductId: string | number;
}

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT_EXPO },
  },
};

function deduplicateServers(servers: ServerEntity[]): ServerEntity[] {
  const map = new Map<number, ServerEntity>();
  for (const s of servers) {
    if (s && typeof s.id === "number" && !map.has(s.id)) {
      map.set(s.id, s);
    }
  }
  return Array.from(map.values());
}

export function SubproductView({ subproductId }: SubproductViewProps) {
  const [subproduct, setSubproduct] = useState<SubProductEntity | null>(null);
  const [subcategory, setSubcategory] = useState<SubcategoryEntity | null>(
    null,
  );
  const [product, setProduct] = useState<ProductEntity | null>(null);
  const [category, setCategory] = useState<CategoryEntity | null>(null);
  const [assignedServers, setAssignedServers] = useState<ServerEntity[]>([]);
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      if (!subproductId) return;
      setLoading(true);
      setError(null);

      try {
        // 1. Obtener datos del subproducto (contiene server_ids: number[])
        const subData = await webApi.getSubproductById(subproductId);
        if (isCancelled) return;
        setSubproduct(subData);

        const serverIds = Array.from(new Set(subData.server_ids || []));
        if (serverIds.length > 0) {
          setSelectedServerId((prev) =>
            prev !== null && serverIds.includes(prev) ? prev : serverIds[0],
          );
        }

        // 2. Cargar en paralelo entidades relacionadas (subcategoria con json_shape, servidores, producto padre)
        const promises: Promise<void>[] = [];

        if (subData.sub_category_id) {
          promises.push(
            webApi
              .getSubcategoryById(subData.sub_category_id)
              .then(async (sc) => {
                if (!isCancelled) {
                  setSubcategory(sc);
                  if (sc.category_id) {
                    try {
                      const cat = await webApi.getCategoryById(sc.category_id);
                      if (!isCancelled) setCategory(cat);
                    } catch {
                      // Silently fallback if category endpoint fails
                    }
                  }
                }
              })
              .catch(() => {
                // Silently fallback if subcategory endpoint fails
              }),
          );
        }

        if (subData.product_id) {
          promises.push(
            webApi
              .getProductById(subData.product_id)
              .then(async (prod) => {
                if (!isCancelled) {
                  setProduct(prod);
                  if (prod.category_id) {
                    try {
                      const cat = await webApi.getCategoryById(
                        prod.category_id,
                      );
                      if (!isCancelled) setCategory(cat);
                    } catch {
                      // Silently fallback
                    }
                  }
                }
              })
              .catch(() => {
                // Silently fallback if product endpoint fails
              }),
          );

          promises.push(
            webApi
              .getServers(1, 100, subData.product_id)
              .then((srvList) => {
                if (!isCancelled && srvList?.items) {
                  const productServers = srvList.items;
                  const matched = productServers.filter((s) =>
                    serverIds.includes(s.id),
                  );
                  if (matched.length > 0) {
                    setAssignedServers(deduplicateServers(matched));
                  } else {
                    // Fallback to fetching individual servers if they are outside the product filter
                    Promise.all(
                      serverIds.map((id) =>
                        webApi.getServerById(id).catch(() => null),
                      ),
                    ).then((individual) => {
                      if (!isCancelled) {
                        const valid = individual.filter(
                          (s): s is ServerEntity => s !== null,
                        );
                        setAssignedServers(deduplicateServers(valid));
                      }
                    });
                  }
                }
              })
              .catch(() => {
                // Fallback fetching servers individually
                Promise.all(
                  serverIds.map((id) =>
                    webApi.getServerById(id).catch(() => null),
                  ),
                ).then((individual) => {
                  if (!isCancelled) {
                    const valid = individual.filter(
                      (s): s is ServerEntity => s !== null,
                    );
                    setAssignedServers(deduplicateServers(valid));
                  }
                });
              }),
          );
        } else if (serverIds.length > 0) {
          promises.push(
            Promise.all(
              serverIds.map((id) => webApi.getServerById(id).catch(() => null)),
            ).then((individual) => {
              if (!isCancelled) {
                const valid = individual.filter(
                  (s): s is ServerEntity => s !== null,
                );
                setAssignedServers(deduplicateServers(valid));
              }
            }),
          );
        }

        await Promise.allSettled(promises);
      } catch (err: unknown) {
        if (!isCancelled) {
          const msg =
            err instanceof Error
              ? err.message
              : "Error al cargar la informacion del subproducto";
          setError(msg);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [subproductId]);

  const handleRetry = () => {
    if (!subproductId) return;
    setLoading(true);
    setError(null);
    webApi
      .getSubproductById(subproductId)
      .then(async (subData) => {
        setSubproduct(subData);
        const serverIds = Array.from(new Set(subData.server_ids || []));
        if (serverIds.length > 0) {
          setSelectedServerId(serverIds[0]);
        }
        if (subData.sub_category_id) {
          webApi
            .getSubcategoryById(subData.sub_category_id)
            .then(async (sc) => {
              setSubcategory(sc);
              if (sc.category_id) {
                try {
                  const cat = await webApi.getCategoryById(sc.category_id);
                  setCategory(cat);
                } catch {}
              }
            })
            .catch(() => {});
        }
        if (subData.product_id) {
          webApi
            .getProductById(subData.product_id)
            .then(async (prod) => {
              setProduct(prod);
              if (prod.category_id) {
                try {
                  const cat = await webApi.getCategoryById(prod.category_id);
                  setCategory(cat);
                } catch {}
              }
            })
            .catch(() => {});
          webApi
            .getServers(1, 100, subData.product_id)
            .then((res) => {
              if (res?.items) {
                const matched = res.items.filter((s) =>
                  serverIds.includes(s.id),
                );
                setAssignedServers(deduplicateServers(matched));
              }
            })
            .catch(() => {});
        }
      })
      .catch((err: unknown) => {
        const msg =
          err instanceof Error
            ? err.message
            : "Error al cargar la informacion del subproducto";
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  const selectedServer = useMemo(
    () =>
      assignedServers.find((s) => s.id === selectedServerId) ??
      assignedServers[0] ??
      null,
    [assignedServers, selectedServerId],
  );

  if (loading) {
    return <SubproductSkeleton />;
  }

  if (error || !subproduct) {
    return (
      <SubproductNotFound
        message={error || "El subproducto no existe o fue deshabilitado."}
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
          <SubproductBreadcrumbs
            categoryName={category?.category_name}
            productName={product?.name}
            productId={product?.id}
            subproductName={subproduct.name}
            isActive={subproduct.is_active}
          />

          {/* Main Subproduct Layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Image & Servers */}
            <div className="flex flex-col gap-6 lg:col-span-5">
              <SubproductImage
                image={subproduct.image}
                name={subproduct.name}
                isActive={subproduct.is_active}
              />

              <SubproductServers
                assignedServers={assignedServers}
                selectedServerId={selectedServerId}
                onSelectServer={setSelectedServerId}
              />
            </div>

            {/* Right Column: Hero details, Dynamic product_data (json_shape), and Actions */}
            <div className="flex flex-col gap-6 lg:col-span-7">
              <SubproductHero
                subproduct={subproduct}
                product={product}
                subcategory={subcategory}
                category={category}
              />

              <SubproductDynamicData
                productData={subproduct.product_data}
                jsonShape={subcategory?.json_shape}
              />

              <SubproductActions
                subproduct={subproduct}
                selectedServer={selectedServer}
              />
            </div>
          </div>
        </motion.div>
      </main>
    </MotionConfig>
  );
}
