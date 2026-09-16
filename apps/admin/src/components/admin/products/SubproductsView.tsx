"use client";

import { PlusIcon } from "@shared/icons";
import { cyberError, cyberSuccess } from "@shared/toasts";
import type {
  CategoryEntity,
  ProductEntity,
  ServerEntity,
  SubcategoryEntity,
  SubProductEntity,
  SubProductFilters,
  SubProductFormValues,
} from "@shared/types";
import { useCallback, useEffect, useState } from "react";

import { ListHeader } from "@/components/commonList/ListHeader";
import { Pagination } from "@/components/commonList/Pagination";
import { adminApi } from "@/libs/adminApi";
import type { ProductViewMode } from "@/types/products";
import { DeleteSubproductModal } from "./DeleteSubproductModal";
import { SubproductFormModal } from "./SubproductFormModal";
import { SubproductPreviewModal } from "./SubproductPreviewModal";
import { SubproductsCatalogGrid } from "./SubproductsCatalogGrid";
import { SubproductsFilterBar } from "./SubproductsFilterBar";
import { SubproductsTable } from "./SubproductsTable";

const PAGE_SIZE = 12;

interface ModalState {
  open: boolean;
  mode: "create" | "edit";
  subproduct?: SubProductEntity;
}

const DEFAULT_FILTERS: SubProductFilters = {
  search: "",
  product_id: "ALL",
  sub_category_id: "ALL",
  server_id: "ALL",
  min_price: "",
  max_price: "",
  status: "ALL",
};

const CLOSED_MODAL: ModalState = {
  open: false,
  mode: "create",
};

export function SubproductsView() {
  const [subproducts, setSubproducts] = useState<SubProductEntity[]>([]);
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryEntity[]>([]);
  const [servers, setServers] = useState<ServerEntity[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<SubProductFilters>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<ProductViewMode>("list");

  const [modal, setModal] = useState<ModalState>(CLOSED_MODAL);
  const [previewSubproduct, setPreviewSubproduct] =
    useState<SubProductEntity | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    subproduct?: SubProductEntity;
  }>({ open: false });

  // Cargar dependencias (Productos, Subcategorias, Servidores, Categorias)
  const loadDependencies = useCallback(async () => {
    try {
      const [prodRes, subcatRes, srvRes, catRes] = await Promise.all([
        adminApi.getProducts(1, 100),
        adminApi.getSubcategories(1, 100),
        adminApi.getServers(1, 100),
        adminApi.getCategories(1, 100),
      ]);
      setProducts(prodRes.items || []);
      setSubcategories(subcatRes.items || []);
      setServers(srvRes.items || []);
      setCategories(catRes.items || []);
    } catch {
      // Silencioso
    }
  }, []);

  // Cargar subproductos paginados y sus precios por servidor
  const loadSubproducts = useCallback(async (targetPage: number) => {
    setLoading(true);
    try {
      const [response, pricesRes] = await Promise.all([
        adminApi.getSubproducts(targetPage, PAGE_SIZE),
        adminApi.getItemPrices(1, 1000).catch(() => null),
      ]);
      const items = response.items || [];

      // Mapear precios por sub_product_id
      const pricesMap = new Map<number, (typeof items)[0]["prices"]>();
      if (pricesRes?.items) {
        for (const ip of pricesRes.items) {
          const list = (pricesMap.get(ip.sub_product_id) ||
            []) as typeof pricesRes.items;
          list.push(ip);
          pricesMap.set(ip.sub_product_id, list);
        }
      }

      const enriched = items.map((sub) => {
        const subPrices = pricesMap.get(sub.id) || sub.prices || [];
        const serverIds = subPrices.map((p) => p.server_id);
        const firstPrice =
          subPrices.length > 0 ? subPrices[0].price : sub.price;
        return {
          ...sub,
          prices: subPrices,
          server_ids: serverIds.length > 0 ? serverIds : sub.server_ids || [],
          price: firstPrice,
        };
      });

      setSubproducts(enriched);
      setTotal(response.total ?? items.length);
      setTotalPages(
        response.total_pages ??
          Math.max(1, Math.ceil((response.total ?? items.length) / PAGE_SIZE)),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al cargar la lista de subproductos";
      cyberError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDependencies();
  }, [loadDependencies]);

  useEffect(() => {
    loadSubproducts(page);
  }, [loadSubproducts, page]);

  // Filtrado reactivo en memoria
  const query = filters.search.trim().toLowerCase();
  const minPriceNum =
    filters.min_price !== "" ? Number(filters.min_price) : null;
  const maxPriceNum =
    filters.max_price !== "" ? Number(filters.max_price) : null;

  const filteredSubproducts = subproducts.filter((sub) => {
    if (query && !sub.name.toLowerCase().includes(query)) {
      return false;
    }
    if (filters.product_id !== "ALL" && sub.product_id !== filters.product_id) {
      return false;
    }
    if (
      filters.sub_category_id !== "ALL" &&
      sub.sub_category_id !== filters.sub_category_id
    ) {
      return false;
    }
    if (filters.server_id !== "ALL") {
      const targetSrvId = Number(filters.server_id);
      const hasServer =
        sub.server_ids?.includes(targetSrvId) ||
        sub.prices?.some((p) => p.server_id === targetSrvId);
      if (!hasServer) return false;
    }
    if (filters.status === "ACTIVE" && !sub.is_active) {
      return false;
    }
    if (filters.status === "INACTIVE" && sub.is_active) {
      return false;
    }

    // Filtrado por rango de precio evaluando los precios de los servidores
    const pricesList =
      sub.prices && sub.prices.length > 0
        ? sub.prices.map((p) => p.price)
        : typeof sub.price === "number"
          ? [sub.price]
          : [];

    if (pricesList.length > 0) {
      if (minPriceNum !== null && !pricesList.some((p) => p >= minPriceNum)) {
        return false;
      }
      if (maxPriceNum !== null && !pricesList.some((p) => p <= maxPriceNum)) {
        return false;
      }
    } else if (minPriceNum !== null || maxPriceNum !== null) {
      return false;
    }

    return true;
  });

  const handleFiltersChange = (next: SubProductFilters) => {
    setFilters(next);
    setPage(1);
  };

  const handlePageChange = (next: number) => {
    const safePage = Math.min(Math.max(1, next), Math.max(1, totalPages));
    setPage(safePage);
  };

  // Crear o Editar Subproducto con tarifas por servidor
  const handleSubmit = async (values: SubProductFormValues) => {
    if (!modal.open) return;

    try {
      const serverPricesPayload = (values.server_prices || []).map((sp) => ({
        server_id: Number(sp.server_id),
        price: Number(sp.price),
        is_active: sp.is_active,
      }));

      if (modal.mode === "create") {
        if (!values.image) {
          throw new Error("Debes seleccionar una imagen para el subproducto");
        }

        await adminApi.createSubproduct({
          name: values.name.trim(),
          sub_category_id: Number(values.sub_category_id),
          product_id: Number(values.product_id),
          prices: serverPricesPayload,
          product_data: values.product_data,
          is_active: values.is_active,
          image: values.image,
        });

        cyberSuccess(
          `Subproducto creado. "${values.name}" se agrego al catalogo.`,
        );
      } else if (modal.subproduct) {
        await adminApi.updateSubproduct(modal.subproduct.id, {
          name: values.name.trim(),
          sub_category_id: Number(values.sub_category_id),
          product_id: Number(values.product_id),
          prices: serverPricesPayload,
          product_data: values.product_data,
          is_active: values.is_active,
          image: values.image || undefined,
        });

        cyberSuccess(
          `Subproducto actualizado. Se guardaron los cambios de "${values.name}".`,
        );
      }

      setModal(CLOSED_MODAL);
      await loadSubproducts(page);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al guardar el subproducto";
      cyberError(message);
    }
  };

  // Toggle rapido de estado Activo/Inactivo
  const handleToggleStatus = async (subproduct: SubProductEntity) => {
    try {
      const nextStatus = !subproduct.is_active;
      await adminApi.updateSubproduct(subproduct.id, {
        is_active: nextStatus,
      });

      cyberSuccess(
        `Estado actualizado. "${subproduct.name}" ahora esta ${
          nextStatus ? "activo" : "inactivo"
        }.`,
      );

      // Actualizar estado local inmediatamente
      setSubproducts((prev) =>
        prev.map((item) =>
          item.id === subproduct.id ? { ...item, is_active: nextStatus } : item,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al cambiar el estado del subproducto";
      cyberError(message);
    }
  };

  // Eliminacion de Subproducto
  const handleDeleteConfirm = async (subproduct: SubProductEntity) => {
    try {
      await adminApi.deleteSubproduct(subproduct.id);
      cyberSuccess(
        `Subproducto eliminado. "${subproduct.name}" fue eliminado del sistema.`,
      );
      setDeleteModal({ open: false });

      const willBeEmpty = subproducts.length === 1 && page > 1;
      const targetPage = willBeEmpty ? page - 1 : page;
      if (willBeEmpty) {
        setPage(targetPage);
      } else {
        await loadSubproducts(targetPage);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al eliminar el subproducto";
      cyberError(message);
    }
  };

  return (
    <>
      {/* ─── Header ─── */}
      <ListHeader
        title="Subproductos"
        subtitle="Gestion de catalogo :: variantes, especificaciones y precios de subproductos"
        actionLabel="Crear subproducto"
        actionIcon={<PlusIcon className="h-4 w-4" />}
        onAction={() => setModal({ open: true, mode: "create" })}
      />

      {/* ─── Panel Principal ─── */}
      <section
        aria-label="Lista y catalogo de subproductos"
        className="overflow-hidden rounded-lg border border-white/5 bg-bg-surface"
      >
        <SubproductsFilterBar
          filters={filters}
          onChange={handleFiltersChange}
          products={products}
          subcategories={subcategories}
          servers={servers}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          resultCount={filteredSubproducts.length}
        />

        {viewMode === "list" ? (
          <SubproductsTable
            subproducts={filteredSubproducts}
            products={products}
            subcategories={subcategories}
            servers={servers}
            loading={loading}
            onEdit={(sub) =>
              setModal({ open: true, mode: "edit", subproduct: sub })
            }
            onDelete={(sub) => setDeleteModal({ open: true, subproduct: sub })}
            onToggleStatus={handleToggleStatus}
            onPreview={(sub) => setPreviewSubproduct(sub)}
          />
        ) : (
          <SubproductsCatalogGrid
            subproducts={filteredSubproducts}
            products={products}
            subcategories={subcategories}
            servers={servers}
            loading={loading}
            onEdit={(sub) =>
              setModal({ open: true, mode: "edit", subproduct: sub })
            }
            onDelete={(sub) => setDeleteModal({ open: true, subproduct: sub })}
            onToggleStatus={handleToggleStatus}
            onPreview={(sub) => setPreviewSubproduct(sub)}
          />
        )}

        {!loading && total > 0 && (
          <Pagination
            page={page}
            pageCount={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
            ariaLabel="Paginacion de subproductos"
          />
        )}
      </section>

      {/* ─── Modal Crear / Editar Subproducto ─── */}
      <SubproductFormModal
        open={modal.open}
        mode={modal.mode}
        subproduct={modal.subproduct}
        products={products}
        subcategories={subcategories}
        servers={servers}
        onSubmit={handleSubmit}
        onClose={() => setModal(CLOSED_MODAL)}
      />

      {/* ─── Modal Vista Previa Completa ─── */}
      <SubproductPreviewModal
        open={Boolean(previewSubproduct)}
        subproduct={previewSubproduct ?? undefined}
        products={products}
        subcategories={subcategories}
        servers={servers}
        categories={categories}
        onClose={() => setPreviewSubproduct(null)}
      />

      {/* ─── Modal Confirmacion de Eliminacion ─── */}
      <DeleteSubproductModal
        open={deleteModal.open}
        subproduct={deleteModal.subproduct}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModal({ open: false })}
      />
    </>
  );
}
