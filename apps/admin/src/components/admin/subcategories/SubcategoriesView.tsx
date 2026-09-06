"use client";

import { PlusIcon } from "@shared/icons";
import type {
  CategoryEntity,
  JsonShapeMap,
  SubcategoryEntity,
  SubcategoryFilters,
  SubcategoryFormValues,
} from "@shared/types";
import { useCallback, useEffect, useState } from "react";

import { DeleteSubcategoryModal } from "@/components/admin/subcategories/DeleteSubcategoryModal";
import { SubcategoriesFilterBar } from "@/components/admin/subcategories/SubcategoriesFilterBar";
import { SubcategoriesTable } from "@/components/admin/subcategories/SubcategoriesTable";
import { SubcategoryFormModal } from "@/components/admin/subcategories/SubcategoryFormModal";
import { ListHeader } from "@/components/commonList/ListHeader";
import { Pagination } from "@/components/commonList/Pagination";
import { cyberError, cyberSuccess } from "@/components/toasts/cyberToasts";
import { adminApi } from "@/libs/adminApi";

const PAGE_SIZE = 10;

interface ModalState {
  open: boolean;
  mode: "create" | "edit";
  subcategory?: SubcategoryEntity;
}

const DEFAULT_FILTERS: SubcategoryFilters = {
  search: "",
  category_id: "ALL",
};

const CLOSED_MODAL: ModalState = {
  open: false,
  mode: "create",
};

export function SubcategoriesView() {
  const [subcategories, setSubcategories] = useState<SubcategoryEntity[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SubcategoryFilters>(DEFAULT_FILTERS);
  const [modal, setModal] = useState<ModalState>(CLOSED_MODAL);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    subcategory?: SubcategoryEntity;
  }>({ open: false });

  // Cargar lista completa de categorias para filtros y dropdowns
  const loadCategories = useCallback(async () => {
    try {
      const response = await adminApi.getCategories(1, 100);
      setCategories(response.items || []);
    } catch {
      // Manejo silencioso para no generar ruido
    }
  }, []);

  // Cargar subcategorias paginadas
  const loadSubcategories = useCallback(async (targetPage: number) => {
    setLoading(true);
    try {
      const response = await adminApi.getSubcategories(targetPage, PAGE_SIZE);
      const items = response.items || [];

      setSubcategories(items);
      setTotal(response.total ?? items.length);
      setTotalPages(
        response.total_pages ??
          Math.max(1, Math.ceil((response.total ?? items.length) / PAGE_SIZE)),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al cargar la lista de subcategorias";
      cyberError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadSubcategories(page);
  }, [loadSubcategories, page]);

  // Filtrado de subcategorias
  const query = filters.search.trim().toLowerCase();
  const filteredSubcategories = subcategories.filter((sub) => {
    if (query && !sub.subcategory_name.toLowerCase().includes(query)) {
      return false;
    }
    if (
      filters.category_id !== "ALL" &&
      sub.category_id !== filters.category_id
    ) {
      return false;
    }
    return true;
  });

  const handleFiltersChange = (next: SubcategoryFilters) => {
    setFilters(next);
  };

  const handlePageChange = (next: number) => {
    const safePage = Math.min(Math.max(1, next), Math.max(1, totalPages));
    setPage(safePage);
  };

  const handleSubmit = async (values: SubcategoryFormValues) => {
    if (!modal.open) return;

    try {
      const shape: JsonShapeMap = {};
      for (const field of values.fields) {
        if (field.key.trim()) {
          shape[field.key.trim()] = field.type;
        }
      }

      if (modal.mode === "create") {
        await adminApi.createSubcategory({
          subcategory_name: values.subcategory_name.trim(),
          category_id: Number(values.category_id),
          json_shape: shape,
        });

        cyberSuccess(
          `Subcategoria creada. "${values.subcategory_name}" se agrego al catalogo.`,
        );
      } else if (modal.subcategory) {
        await adminApi.updateSubcategory(modal.subcategory.id, {
          subcategory_name: values.subcategory_name.trim(),
          category_id: Number(values.category_id),
          json_shape: shape,
        });

        cyberSuccess(
          `Subcategoria actualizada. Se guardaron los cambios de "${values.subcategory_name}".`,
        );
      }

      setModal(CLOSED_MODAL);
      await loadSubcategories(page);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al guardar la subcategoria";
      cyberError(message);
    }
  };

  const handleDeleteConfirm = async (subcategory: SubcategoryEntity) => {
    try {
      await adminApi.deleteSubcategory(subcategory.id);
      cyberSuccess(
        `Subcategoria eliminada. "${subcategory.subcategory_name}" fue eliminada del sistema.`,
      );
      setDeleteModal({ open: false });

      const willBeEmpty = subcategories.length === 1 && page > 1;
      const targetPage = willBeEmpty ? page - 1 : page;
      if (willBeEmpty) {
        setPage(targetPage);
      } else {
        await loadSubcategories(targetPage);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al eliminar la subcategoria";
      cyberError(message);
    }
  };

  return (
    <>
      {/* ─── Header ─── */}
      <ListHeader
        title="Subcategorias"
        subtitle="Gestion de catalogo :: clasificacion y esquema JSON de subproductos"
        actionLabel="Crear subcategoria"
        actionIcon={<PlusIcon className="h-4 w-4" />}
        onAction={() => setModal({ open: true, mode: "create" })}
      />

      {/* ─── Panel: filtros + tabla + paginacion ─── */}
      <section
        aria-label="Lista de subcategorias"
        className="overflow-hidden rounded-lg border border-white/5 bg-bg-surface"
      >
        <SubcategoriesFilterBar
          filters={filters}
          onChange={handleFiltersChange}
          categories={categories}
          resultCount={filteredSubcategories.length}
        />
        <SubcategoriesTable
          subcategories={filteredSubcategories}
          categories={categories}
          loading={loading}
          onEdit={(subcategory) =>
            setModal({
              open: true,
              mode: "edit",
              subcategory,
            })
          }
          onDelete={(subcategory) =>
            setDeleteModal({ open: true, subcategory })
          }
        />
        {!loading && total > 0 && (
          <Pagination
            page={page}
            pageCount={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
            ariaLabel="Paginacion de subcategorias"
          />
        )}
      </section>

      {/* ─── Modal reutilizable crear / editar ─── */}
      <SubcategoryFormModal
        open={modal.open}
        mode={modal.mode}
        subcategory={modal.subcategory}
        categories={categories}
        onSubmit={handleSubmit}
        onClose={() => setModal(CLOSED_MODAL)}
      />

      {/* ─── Modal de confirmacion de eliminacion ─── */}
      <DeleteSubcategoryModal
        open={deleteModal.open}
        subcategory={deleteModal.subcategory}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModal({ open: false })}
      />
    </>
  );
}
