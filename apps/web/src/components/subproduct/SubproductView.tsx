"use client";

import type {
  CategoryEntity,
  ItemPriceEntity,
  ProductEntity,
  ServerEntity,
  SubcategoryEntity,
  SubProductEntity,
} from "@shared/types";
import { MotionConfig, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [itemPrices, setItemPrices] = useState<ItemPriceEntity[]>([]);
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!subproductId) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Obtener datos del subproducto y tarifas por servidor en paralelo
      const [subData, pricesRes] = await Promise.all([
        webApi.getSubproductById(subproductId),
        webApi
          .getItemPrices(1, 100, { sub_product_id: subproductId })
          .catch(() => null),
      ]);

      setSubproduct(subData);

      const loadedPrices = pricesRes?.items || [];
      setItemPrices(loadedPrices);

      // Obtener lista de IDs de servidores asignados desde los precios o subproducto
      const priceServerIds = loadedPrices.map((p) => p.server_id);
      const subServerIds = subData.server_ids || [];
      const serverIds = Array.from(
        new Set([...priceServerIds, ...subServerIds]),
      );

      if (serverIds.length > 0) {
        setSelectedServerId((prev) =>
          prev !== null && serverIds.includes(prev) ? prev : serverIds[0],
        );
      }

      // 2. Cargar entidades relacionadas (subcategoría, producto padre y servidores)
      const promises: Promise<void>[] = [];

      if (subData.sub_category_id) {
        promises.push(
          webApi
            .getSubcategoryById(subData.sub_category_id)
            .then(async (sc) => {
              setSubcategory(sc);
              if (sc.category_id) {
                try {
                  const cat = await webApi.getCategoryById(sc.category_id);
                  setCategory(cat);
                } catch {
                  // Silencioso
                }
              }
            })
            .catch(() => {}),
        );
      }

      if (subData.product_id) {
        promises.push(
          webApi
            .getProductById(subData.product_id)
            .then(async (prod) => {
              setProduct(prod);
              if (prod.category_id) {
                try {
                  const cat = await webApi.getCategoryById(prod.category_id);
                  setCategory(cat);
                } catch {
                  // Silencioso
                }
              }
            })
            .catch(() => {}),
        );

        promises.push(
          webApi
            .getServers(1, 100, subData.product_id)
            .then((srvList) => {
              if (srvList?.items) {
                const productServers = srvList.items;
                const matched = productServers.filter((s) =>
                  serverIds.includes(s.id),
                );
                if (matched.length > 0) {
                  setAssignedServers(deduplicateServers(matched));
                } else if (serverIds.length > 0) {
                  // Fallback: consultar individualmente
                  Promise.all(
                    serverIds.map((id) =>
                      webApi.getServerById(id).catch(() => null),
                    ),
                  ).then((individual) => {
                    const valid = individual.filter(
                      (s): s is ServerEntity => s !== null,
                    );
                    setAssignedServers(deduplicateServers(valid));
                  });
                }
              }
            })
            .catch(() => {
              if (serverIds.length > 0) {
                Promise.all(
                  serverIds.map((id) =>
                    webApi.getServerById(id).catch(() => null),
                  ),
                ).then((individual) => {
                  const valid = individual.filter(
                    (s): s is ServerEntity => s !== null,
                  );
                  setAssignedServers(deduplicateServers(valid));
                });
              }
            }),
        );
      } else if (serverIds.length > 0) {
        promises.push(
          Promise.all(
            serverIds.map((id) => webApi.getServerById(id).catch(() => null)),
          ).then((individual) => {
            const valid = individual.filter(
              (s): s is ServerEntity => s !== null,
            );
            setAssignedServers(deduplicateServers(valid));
          }),
        );
      }

      await Promise.allSettled(promises);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al cargar la informacion del subproducto";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [subproductId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Mapa de tarifas por ID de servidor
  const serverPricesMap = useMemo(() => {
    const map = new Map<number, number>();
    for (const p of itemPrices) {
      map.set(p.server_id, p.price);
    }
    return map;
  }, [itemPrices]);

  // Servidor actualmente seleccionado
  const selectedServer = useMemo(
    () =>
      assignedServers.find((s) => s.id === selectedServerId) ??
      assignedServers[0] ??
      null,
    [assignedServers, selectedServerId],
  );

  // Precio dinámico del servidor seleccionado
  const currentPrice = useMemo(() => {
    if (selectedServerId !== null && serverPricesMap.has(selectedServerId)) {
      return serverPricesMap.get(selectedServerId) ?? 0;
    }
    if (selectedServer && serverPricesMap.has(selectedServer.id)) {
      return serverPricesMap.get(selectedServer.id) ?? 0;
    }
    if (itemPrices.length > 0) {
      return itemPrices[0].price;
    }
    if (typeof subproduct?.price === "number") {
      return subproduct.price;
    }
    return 0;
  }, [
    selectedServerId,
    selectedServer,
    serverPricesMap,
    itemPrices,
    subproduct?.price,
  ]);

  // ItemPrice correspondiente al servidor seleccionado
  const selectedItemPrice = useMemo(() => {
    if (selectedServerId !== null) {
      const match = itemPrices.find((p) => p.server_id === selectedServerId);
      if (match) return match;
    }
    if (selectedServer) {
      const match = itemPrices.find((p) => p.server_id === selectedServer.id);
      if (match) return match;
    }
    return itemPrices.length > 0 ? itemPrices[0] : null;
  }, [selectedServerId, selectedServer, itemPrices]);

  // Rango general de precios activos
  const priceRange = useMemo(() => {
    const activePrices = itemPrices
      .filter((p) => p.is_active)
      .map((p) => p.price);

    if (activePrices.length === 0) {
      const fallback =
        typeof subproduct?.price === "number" ? subproduct.price : 0;
      return { min: fallback, max: fallback, isRange: false };
    }

    const min = Math.min(...activePrices);
    const max = Math.max(...activePrices);
    return { min, max, isRange: min !== max };
  }, [itemPrices, subproduct?.price]);

  if (loading) {
    return <SubproductSkeleton />;
  }

  if (error || !subproduct) {
    return (
      <SubproductNotFound
        message={error || "El subproducto no existe o fue deshabilitado."}
        onRetry={loadData}
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
                serverPrices={serverPricesMap}
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
                currentPrice={currentPrice}
                priceRange={priceRange}
                selectedServerName={selectedServer?.server_name}
              />

              <SubproductDynamicData
                productData={subproduct.product_data}
                jsonShape={subcategory?.json_shape}
              />

              <SubproductActions
                subproduct={subproduct}
                selectedServer={selectedServer}
                selectedItemPrice={selectedItemPrice}
                currentPrice={currentPrice}
              />
            </div>
          </div>
        </motion.div>
      </main>
    </MotionConfig>
  );
}
