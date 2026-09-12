"use client";

import { PlusIcon } from "@shared/icons";
import { cyberError, cyberSuccess } from "@shared/toasts";
import type {
  CategoryEntity,
  CategoryFilters,
  CategoryFormValues,
} from "@shared/types";
import { useCallback, useEffect, useState } from "react";

import { CategoriesFilterBar } from "@/components/admin/categories/CategoriesFilterBar";
import { CategoriesTable } from "@/components/admin/categories/CategoriesTable";
import { CategoryFormModal } from "@/components/admin/categories/CategoryFormModal";
import { DeleteCategoryModal } from "@/components/admin/categories/DeleteCategoryModal";
import { ListHeader } from "@/components/commonList/ListHeader";
import { Pagination } from "@/components/commonList/Pagination";
import { adminApi } from "@/libs/adminApi";

const PAGE_SIZE = 10;

interface ModalState {
  open: boolean;
  mode: "create" | "edit";
  category?: CategoryEntity;
}

const DEFAULT_FILTERS: CategoryFilters = {
  search: "",
};

const CLOSED_MODAL: ModalState = { open: false, mode: "create" };

export function CategoriesView() {
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CategoryFilters>(DEFAULT_FILTERS);
  const [modal, setModal] = useState<ModalState>(CLOSED_MODAL);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    category?: CategoryEntity;
  }>({ open: false });

  const loadCategories = useCallback(async (targetPage: number) => {
    setLoading(true);
    try {
      const response = await adminApi.getCategories(targetPage, PAGE_SIZE);
      const items = response.items || [];

      setCategories(items);
      setTotal(response.total ?? items.length);
      setTotalPages(
        response.total_pages ??
          Math.max(1, Math.ceil((response.total ?? items.length) / PAGE_SIZE)),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al cargar la lista de categorias";
      cyberError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories(page);
  }, [loadCategories, page]);

  const query = filters.search.trim().toLowerCase();

  const filteredCategories = categories.filter((category) => {
    if (query && !category.category_name.toLowerCase().includes(query)) {
      return false;
    }
    return true;
  });

  const handleFiltersChange = (next: CategoryFilters) => {
    setFilters(next);
  };

  const handlePageChange = (next: number) => {
    const safePage = Math.min(Math.max(1, next), Math.max(1, totalPages));
    setPage(safePage);
  };

  const handleSubmit = async (values: CategoryFormValues) => {
    if (!modal.open) return;

    try {
      if (modal.mode === "create") {
        await adminApi.createCategory({
          category_name: values.category_name.trim(),
        });

        cyberSuccess(
          `Categoria creada. "${values.category_name}" se agrego al catalogo.`,
        );
      } else if (modal.category) {
        await adminApi.updateCategory(modal.category.id, {
          category_name: values.category_name.trim(),
        });

        cyberSuccess(
          `Categoria actualizada. Se guardaron los cambios de "${values.category_name}".`,
        );
      }

      setModal(CLOSED_MODAL);
      await loadCategories(page);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al guardar la categoria";
      cyberError(message);
    }
  };

  const handleDeleteConfirm = async (category: CategoryEntity) => {
    try {
      await adminApi.deleteCategory(category.id);
      cyberSuccess(
        `Categoria eliminada. "${category.category_name}" fue eliminada del sistema.`,
      );
      setDeleteModal({ open: false });

      const willBeEmpty = categories.length === 1 && page > 1;
      const targetPage = willBeEmpty ? page - 1 : page;
      if (willBeEmpty) {
        setPage(targetPage);
      } else {
        await loadCategories(targetPage);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al eliminar la categoria";
      cyberError(message);
    }
  };

  return (
    <>
      {/* ─── Header ─── */}
      <ListHeader
        title="Categorias"
        subtitle="Gestion de catalogo :: clasificacion principal de productos"
        actionLabel="Crear categoria"
        actionIcon={<PlusIcon className="h-4 w-4" />}
        onAction={() => setModal({ open: true, mode: "create" })}
      />

      {/* ─── Panel: filtros + tabla + paginacion ─── */}
      <section
        aria-label="Lista de categorias"
        className="overflow-hidden rounded-lg border border-white/5 bg-bg-surface"
      >
        <CategoriesFilterBar
          filters={filters}
          onChange={handleFiltersChange}
          resultCount={filteredCategories.length}
        />
        <CategoriesTable
          categories={filteredCategories}
          loading={loading}
          onEdit={(category) =>
            setModal({ open: true, mode: "edit", category })
          }
          onDelete={(category) => setDeleteModal({ open: true, category })}
        />
        {!loading && total > 0 && (
          <Pagination
            page={page}
            pageCount={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
            ariaLabel="Paginacion de categorias"
          />
        )}
      </section>

      {/* ─── Modal reutilizable crear / editar ─── */}
      <CategoryFormModal
        open={modal.open}
        mode={modal.mode}
        category={modal.category}
        onSubmit={handleSubmit}
        onClose={() => setModal(CLOSED_MODAL)}
      />

      {/* ─── Modal de confirmacion de eliminacion ─── */}
      <DeleteCategoryModal
        open={deleteModal.open}
        category={deleteModal.category}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModal({ open: false })}
      />
    </>
  );
}
