"use client";

import { PlusIcon, ServerIcon } from "@shared/icons";
import { cyberError, cyberSuccess } from "@shared/toasts";
import type {
  CategoryEntity,
  ProductEntity,
  ProductFilters,
  ProductFormValues,
  ServerFormValues,
} from "@shared/types";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

import { DeleteProductModal } from "@/components/admin/products/DeleteProductModal";
import { ProductFormModal } from "@/components/admin/products/ProductFormModal";
import { ProductsCatalogGrid } from "@/components/admin/products/ProductsCatalogGrid";
import { ProductsFilterBar } from "@/components/admin/products/ProductsFilterBar";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { ServerFormModal } from "@/components/admin/servers/ServerFormModal";
import { Pagination } from "@/components/commonList/Pagination";
import { adminApi } from "@/libs/adminApi";
import type { ProductViewMode } from "@/types/products";

const PAGE_SIZE = 10;

interface ModalState {
  open: boolean;
  mode: "create" | "edit";
  product?: ProductEntity;
}

const DEFAULT_FILTERS: ProductFilters = {
  search: "",
  category_id: "ALL",
  status: "ALL",
};

const CLOSED_MODAL: ModalState = {
  open: false,
  mode: "create",
};

export function ProductsView() {
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<ProductViewMode>("list");
  const [modal, setModal] = useState<ModalState>(CLOSED_MODAL);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    product?: ProductEntity;
  }>({ open: false });
  const [serverModalOpen, setServerModalOpen] = useState(false);

  // Cargar lista completa de categorias para el filtro y el formulario
  const loadCategories = useCallback(async () => {
    try {
      const response = await adminApi.getCategories(1, 100);
      setCategories(response.items || []);
    } catch {
      // Silencioso para no saturar toasts
    }
  }, []);

  // Cargar productos paginados desde la API
  const loadProducts = useCallback(async (targetPage: number) => {
    setLoading(true);
    try {
      const response = await adminApi.getProducts(targetPage, PAGE_SIZE);
      const items = response.items || [];

      setProducts(items);
      setTotal(response.total ?? items.length);
      setTotalPages(
        response.total_pages ??
          Math.max(1, Math.ceil((response.total ?? items.length) / PAGE_SIZE)),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al cargar la lista de productos";
      cyberError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadProducts(page);
  }, [loadProducts, page]);

  // Filtrado reactivo de productos
  const query = filters.search.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    if (query && !product.name.toLowerCase().includes(query)) {
      return false;
    }
    if (
      filters.category_id !== "ALL" &&
      product.category_id !== filters.category_id
    ) {
      return false;
    }
    if (filters.status === "ACTIVE" && !product.is_active) {
      return false;
    }
    if (filters.status === "INACTIVE" && product.is_active) {
      return false;
    }
    return true;
  });

  const handleFiltersChange = (next: ProductFilters) => {
    setFilters(next);
  };

  const handlePageChange = (next: number) => {
    const safePage = Math.min(Math.max(1, next), Math.max(1, totalPages));
    setPage(safePage);
  };

  const handleSubmit = async (values: ProductFormValues) => {
    if (!modal.open) return;

    try {
      if (modal.mode === "create") {
        await adminApi.createProduct({
          name: values.name.trim(),
          description: values.description.trim(),
          category_id: Number(values.category_id),
          image:
            values.image instanceof File
              ? values.image
              : typeof values.image === "string"
                ? values.image.trim()
                : undefined,
          is_active: values.is_active,
        });

        cyberSuccess(
          `Producto creado. "${values.name}" se agrego al catalogo.`,
        );
      } else if (modal.product) {
        await adminApi.updateProduct(modal.product.id, {
          name: values.name.trim(),
          description: values.description.trim(),
          category_id: Number(values.category_id),
          image:
            values.image instanceof File
              ? values.image
              : typeof values.image === "string"
                ? values.image.trim()
                : undefined,
          is_active: values.is_active,
        });

        cyberSuccess(
          `Producto actualizado. Se guardaron los cambios de "${values.name}".`,
        );
      }

      setModal(CLOSED_MODAL);
      await loadProducts(page);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al guardar el producto";
      cyberError(message);
    }
  };

  const handleDeleteConfirm = async (product: ProductEntity) => {
    try {
      await adminApi.deleteProduct(product.id);
      cyberSuccess(
        `Producto eliminado. "${product.name}" fue eliminado del sistema.`,
      );
      setDeleteModal({ open: false });

      const willBeEmpty = products.length === 1 && page > 1;
      const targetPage = willBeEmpty ? page - 1 : page;
      if (willBeEmpty) {
        setPage(targetPage);
      } else {
        await loadProducts(targetPage);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al eliminar el producto";
      cyberError(message);
    }
  };

  const handleCreateServer = async (values: ServerFormValues) => {
    try {
      await adminApi.createServer({
        server_name: values.server_name.trim(),
        product_id: Number(values.product_id),
      });

      cyberSuccess(
        `Servidor creado. "${values.server_name}" se agrego al catalogo.`,
      );
      setServerModalOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al crear el servidor";
      cyberError(message);
    }
  };

  // Renderizado dinámico de la vista según el modo seleccionado (Lista / Catálogo)
  const viewMap: Record<ProductViewMode, ReactNode> = {
    list: (
      <ProductsTable
        products={filteredProducts}
        categories={categories}
        loading={loading}
        onEdit={(product) => setModal({ open: true, mode: "edit", product })}
        onDelete={(product) => setDeleteModal({ open: true, product })}
      />
    ),
    catalog: (
      <ProductsCatalogGrid
        products={filteredProducts}
        categories={categories}
        loading={loading}
        onEdit={(product) => setModal({ open: true, mode: "edit", product })}
        onDelete={(product) => setDeleteModal({ open: true, product })}
      />
    ),
  };

  return (
    <>
      {/* ─── Header ─── */}
      <header className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text-primary">
            Productos
          </h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-neon-primary">
            Gestion de catalogo :: productos, juegos y servicios digitales
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setServerModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-sm border border-neon-purple/40 bg-neon-purple/10 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-neon-purple transition-all hover:bg-neon-purple/20 hover:shadow-[0_0_15px_rgba(123,45,255,0.3)] active:scale-95 cursor-pointer"
          >
            <ServerIcon className="h-4 w-4" />
            Crear servidor
          </button>

          <button
            type="button"
            onClick={() => setModal({ open: true, mode: "create" })}
            className="btn-neon-primary flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-bg-primary transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95 cursor-pointer"
          >
            <PlusIcon className="h-4 w-4" />
            Crear producto
          </button>
        </div>
      </header>

      {/* ─── Panel: filtros + vista (tabla o catálogo) + paginación ─── */}
      <section
        aria-label="Catalogo de productos"
        className="overflow-hidden rounded-lg border border-white/5 bg-bg-surface"
      >
        <ProductsFilterBar
          filters={filters}
          onChange={handleFiltersChange}
          categories={categories}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          resultCount={filteredProducts.length}
        />

        {viewMap[viewMode]}

        {!loading && total > 0 && (
          <Pagination
            page={page}
            pageCount={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
            ariaLabel="Paginacion de productos"
          />
        )}
      </section>

      {/* ─── Modal reutilizable crear / editar producto ─── */}
      <ProductFormModal
        open={modal.open}
        mode={modal.mode}
        product={modal.product}
        categories={categories}
        onSubmit={handleSubmit}
        onClose={() => setModal(CLOSED_MODAL)}
      />

      {/* ─── Modal de confirmacion de eliminacion ─── */}
      <DeleteProductModal
        open={deleteModal.open}
        product={deleteModal.product}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModal({ open: false })}
      />

      {/* ─── Modal para crear servidor desde productos ─── */}
      <ServerFormModal
        open={serverModalOpen}
        mode="create"
        products={products}
        initialProductId={modal.product?.id}
        onSubmit={handleCreateServer}
        onClose={() => setServerModalOpen(false)}
      />
    </>
  );
}
