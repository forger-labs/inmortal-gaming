"use client";

import { PlusIcon } from "@shared/icons";
import type {
  CategoryEntity,
  LandingFilters,
  LandingItemEntity,
  LandingItemFormValues,
  SubcategoryEntity,
} from "@shared/types";
import { useCallback, useEffect, useState } from "react";

import { ListHeader } from "@/components/commonList/ListHeader";
import { Pagination } from "@/components/commonList/Pagination";
import { cyberError, cyberSuccess } from "@/components/toasts/cyberToasts";
import { adminApi } from "@/libs/adminApi";
import { DeleteLandingModal } from "./DeleteLandingModal";
import { LandingFilterBar } from "./LandingFilterBar";
import { LandingFormModal } from "./LandingFormModal";
import { LandingTable } from "./LandingTable";

const PAGE_SIZE = 10;

interface ModalState {
  open: boolean;
  mode: "create" | "edit";
  item?: LandingItemEntity;
}

const DEFAULT_FILTERS: LandingFilters = {
  search: "",
  status: "ALL",
  type: "ALL",
  category_id: "ALL",
};

const CLOSED_MODAL: ModalState = {
  open: false,
  mode: "create",
};

export function LandingSectionsView() {
  const [items, setItems] = useState<LandingItemEntity[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryEntity[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LandingFilters>(DEFAULT_FILTERS);
  const [modal, setModal] = useState<ModalState>(CLOSED_MODAL);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    item?: LandingItemEntity;
  }>({ open: false });

  // Cargar categorias y subcategorias para relaciones y selects
  const loadDependencies = useCallback(async () => {
    try {
      const [catsRes, subcatsRes] = await Promise.all([
        adminApi.getCategories(1, 100),
        adminApi.getSubcategories(1, 100),
      ]);
      setCategories(catsRes.items || []);
      setSubcategories(subcatsRes.items || []);
    } catch {
      // Manejo silencioso de dependencias
    }
  }, []);

  // Cargar items de landing paginados
  const loadItems = useCallback(async (targetPage: number) => {
    setLoading(true);
    try {
      const response = await adminApi.getLandingItems(targetPage, PAGE_SIZE);
      const fetchedItems = response.items || [];

      // Ordenar por order asc, id asc
      const sorted = [...fetchedItems].sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.id - b.id;
      });

      setItems(sorted);
      setTotal(response.total ?? fetchedItems.length);
      setTotalPages(
        response.total_pages ??
          Math.max(
            1,
            Math.ceil((response.total ?? fetchedItems.length) / PAGE_SIZE),
          ),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al cargar los elementos de la landing";
      cyberError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDependencies();
  }, [loadDependencies]);

  useEffect(() => {
    loadItems(page);
  }, [loadItems, page]);

  // Filtrado local
  const query = filters.search.trim().toLowerCase();

  const filteredItems = items.filter((item) => {
    // Filtro por busqueda (titulo o descripcion)
    if (
      query &&
      !item.title.toLowerCase().includes(query) &&
      !item.description.toLowerCase().includes(query)
    ) {
      return false;
    }

    // Filtro por estado
    if (filters.status === "ACTIVE" && !item.show) return false;
    if (filters.status === "INACTIVE" && item.show) return false;

    // Filtro por tipo (Categoria vs Subcategoria)
    if (
      filters.type === "CATEGORY" &&
      item.sub_category_id !== null &&
      item.sub_category_id !== undefined
    ) {
      return false;
    }
    if (
      filters.type === "SUBCATEGORY" &&
      (!item.sub_category_id || item.sub_category_id === null)
    ) {
      return false;
    }

    // Filtro por categoria especifica
    if (filters.category_id !== "ALL") {
      if (item.category_id === filters.category_id) return true;
      if (item.sub_category_id) {
        const sub = subcategories.find((s) => s.id === item.sub_category_id);
        if (sub && sub.category_id === filters.category_id) return true;
      }
      return false;
    }

    return true;
  });

  const handleFiltersChange = (next: LandingFilters) => {
    setFilters(next);
  };

  const handlePageChange = (next: number) => {
    const safePage = Math.min(Math.max(1, next), Math.max(1, totalPages));
    setPage(safePage);
  };

  // Crear o Editar
  const handleSubmit = async (values: LandingItemFormValues) => {
    if (!modal.open) return;

    try {
      const isSub = values.target_type === "subcategory";
      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        category_id: isSub ? null : Number(values.category_id),
        sub_category_id: isSub ? Number(values.sub_category_id) : null,
        show: values.show,
        qt_products_show: Number(values.qt_products_show),
        order: Number(values.order),
        sort_by: values.sort_by,
      };

      if (modal.mode === "create") {
        await adminApi.createLandingItem(payload);
        cyberSuccess(
          `Seccion de landing "${values.title}" creada exitosamente`,
        );
      } else if (modal.mode === "edit" && modal.item) {
        await adminApi.updateLandingItem(modal.item.id, payload);
        cyberSuccess(
          `Seccion de landing "${values.title}" actualizada exitosamente`,
        );
      }

      setModal(CLOSED_MODAL);
      await loadItems(page);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al guardar el elemento de la landing";
      cyberError(message);
    }
  };

  // Eliminar
  const handleDeleteConfirm = async (item: LandingItemEntity) => {
    try {
      await adminApi.deleteLandingItem(item.id);
      cyberSuccess(`Seccion "${item.title}" eliminada de la landing`);
      setDeleteModal({ open: false });

      if (items.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await loadItems(page);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al eliminar el elemento de la landing";
      cyberError(message);
    }
  };

  // Activar / Desactivar rapido
  const handleToggleStatus = async (item: LandingItemEntity) => {
    const newStatus = !item.show;
    try {
      await adminApi.updateLandingItem(item.id, {
        show: newStatus,
        title: item.title,
        description: item.description,
        category_id: item.category_id,
        sub_category_id: item.sub_category_id,
        qt_products_show: item.qt_products_show,
        order: item.order,
        sort_by: item.sort_by,
      });
      cyberSuccess(
        `Seccion "${item.title}" ${newStatus ? "activada" : "desactivada"}`,
      );
      await loadItems(page);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al actualizar estado del elemento";
      cyberError(message);
    }
  };

  // Mover posicion arriba (swap de orden)
  const handleMoveUp = async (item: LandingItemEntity) => {
    const currentIndex = items.findIndex((i) => i.id === item.id);
    if (currentIndex <= 0) return;

    const previousItem = items[currentIndex - 1];
    if (!previousItem) return;

    try {
      const currentOrder = item.order;
      const prevOrder = previousItem.order;

      // Si los ordenes son iguales, ajustamos
      const newCurrentOrder =
        currentOrder === prevOrder ? Math.max(0, prevOrder - 1) : prevOrder;
      const newPrevOrder =
        currentOrder === prevOrder ? prevOrder + 1 : currentOrder;

      await Promise.all([
        adminApi.updateLandingItem(item.id, {
          order: newCurrentOrder,
          title: item.title,
          description: item.description,
          category_id: item.category_id,
          sub_category_id: item.sub_category_id,
          show: item.show,
          qt_products_show: item.qt_products_show,
          sort_by: item.sort_by,
        }),
        adminApi.updateLandingItem(previousItem.id, {
          order: newPrevOrder,
          title: previousItem.title,
          description: previousItem.description,
          category_id: previousItem.category_id,
          sub_category_id: previousItem.sub_category_id,
          show: previousItem.show,
          qt_products_show: previousItem.qt_products_show,
          sort_by: previousItem.sort_by,
        }),
      ]);

      cyberSuccess(`Posicion de "${item.title}" actualizada`);
      await loadItems(page);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al reordenar elementos";
      cyberError(message);
    }
  };

  // Mover posicion abajo (swap de orden)
  const handleMoveDown = async (item: LandingItemEntity) => {
    const currentIndex = items.findIndex((i) => i.id === item.id);
    if (currentIndex < 0 || currentIndex >= items.length - 1) return;

    const nextItem = items[currentIndex + 1];
    if (!nextItem) return;

    try {
      const currentOrder = item.order;
      const nextOrder = nextItem.order;

      // Si los ordenes son iguales, ajustamos
      const newCurrentOrder =
        currentOrder === nextOrder ? nextOrder + 1 : nextOrder;
      const newNextOrder =
        currentOrder === nextOrder
          ? Math.max(0, currentOrder - 1)
          : currentOrder;

      await Promise.all([
        adminApi.updateLandingItem(item.id, {
          order: newCurrentOrder,
          title: item.title,
          description: item.description,
          category_id: item.category_id,
          sub_category_id: item.sub_category_id,
          show: item.show,
          qt_products_show: item.qt_products_show,
          sort_by: item.sort_by,
        }),
        adminApi.updateLandingItem(nextItem.id, {
          order: newNextOrder,
          title: nextItem.title,
          description: nextItem.description,
          category_id: nextItem.category_id,
          sub_category_id: nextItem.sub_category_id,
          show: nextItem.show,
          qt_products_show: nextItem.qt_products_show,
          sort_by: nextItem.sort_by,
        }),
      ]);

      cyberSuccess(`Posicion de "${item.title}" actualizada`);
      await loadItems(page);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al reordenar elementos";
      cyberError(message);
    }
  };

  const nextOrderCalculated =
    items.length > 0 ? Math.max(...items.map((i) => i.order ?? 0)) + 1 : 0;

  return (
    <>
      <ListHeader
        title="Categorias y Subcategorias en Landing"
        subtitle="Configuracion de las secciones del catalogo visibles en la pagina principal"
        actionLabel="Nueva seccion"
        actionIcon={<PlusIcon className="h-4 w-4" />}
        onAction={() => setModal({ open: true, mode: "create" })}
      />
      <section className="flex flex-col rounded-xl border border-white/10 bg-bg-surface shadow-2xl">
        {/* ─── Barra de filtros ─── */}
        <LandingFilterBar
          filters={filters}
          onChange={handleFiltersChange}
          categories={categories}
          resultCount={filteredItems.length}
        />

        {/* ─── Tabla interactiva ─── */}
        <LandingTable
          items={filteredItems}
          categories={categories}
          subcategories={subcategories}
          loading={loading}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onToggleStatus={handleToggleStatus}
          onEdit={(item) => setModal({ open: true, mode: "edit", item })}
          onDelete={(item) => setDeleteModal({ open: true, item })}
        />

        {/* ─── Paginacion ─── */}
        {!loading && total > 0 && (
          <Pagination
            page={page}
            pageCount={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
            ariaLabel="Paginacion de secciones de landing"
          />
        )}
      </section>

      {/* ─── Modal Crear / Editar ─── */}
      <LandingFormModal
        open={modal.open}
        mode={modal.mode}
        item={modal.item}
        categories={categories}
        subcategories={subcategories}
        nextOrder={nextOrderCalculated}
        onSubmit={handleSubmit}
        onClose={() => setModal(CLOSED_MODAL)}
      />

      {/* ─── Modal Eliminar ─── */}
      <DeleteLandingModal
        open={deleteModal.open}
        item={deleteModal.item}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModal({ open: false })}
      />
    </>
  );
}
