"use client";

import { PlusIcon } from "@shared/icons";
import { cyberError, cyberSuccess } from "@shared/toasts";
import type {
  ProductEntity,
  ServerEntity,
  ServerFilters,
  ServerFormValues,
} from "@shared/types";
import { useCallback, useEffect, useState } from "react";

import { DeleteServerModal } from "@/components/admin/servers/DeleteServerModal";
import { ServerFormModal } from "@/components/admin/servers/ServerFormModal";
import { ServersFilterBar } from "@/components/admin/servers/ServersFilterBar";
import { ServersTable } from "@/components/admin/servers/ServersTable";
import { ListHeader } from "@/components/commonList/ListHeader";
import { Pagination } from "@/components/commonList/Pagination";
import { adminApi } from "@/libs/adminApi";

const PAGE_SIZE = 10;

interface ModalState {
  open: boolean;
  mode: "create" | "edit";
  server?: ServerEntity;
}

const DEFAULT_FILTERS: ServerFilters = {
  search: "",
  product_id: "ALL",
};

const CLOSED_MODAL: ModalState = {
  open: false,
  mode: "create",
};

export function ServersView() {
  const [servers, setServers] = useState<ServerEntity[]>([]);
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ServerFilters>(DEFAULT_FILTERS);
  const [modal, setModal] = useState<ModalState>(CLOSED_MODAL);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    server?: ServerEntity;
  }>({ open: false });

  // Cargar lista completa de productos para filtros y dropdowns
  const loadProducts = useCallback(async () => {
    try {
      const response = await adminApi.getProducts(1, 100);
      setProducts(response.items || []);
    } catch {
      // Silencioso para no saturar toasts
    }
  }, []);

  // Cargar servidores paginados
  const loadServers = useCallback(async (targetPage: number) => {
    setLoading(true);
    try {
      const response = await adminApi.getServers(targetPage, PAGE_SIZE);
      const items = response.items || [];

      setServers(items);
      setTotal(response.total ?? items.length);
      setTotalPages(
        response.total_pages ??
          Math.max(1, Math.ceil((response.total ?? items.length) / PAGE_SIZE)),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al cargar la lista de servidores";
      cyberError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadServers(page);
  }, [loadServers, page]);

  // Filtrado de servidores
  const query = filters.search.trim().toLowerCase();
  const filteredServers = servers.filter((server) => {
    if (query && !server.server_name.toLowerCase().includes(query)) {
      return false;
    }
    if (
      filters.product_id !== "ALL" &&
      server.product_id !== filters.product_id
    ) {
      return false;
    }
    return true;
  });

  const handleFiltersChange = (next: ServerFilters) => {
    setFilters(next);
  };

  const handlePageChange = (next: number) => {
    const safePage = Math.min(Math.max(1, next), Math.max(1, totalPages));
    setPage(safePage);
  };

  const handleSubmit = async (values: ServerFormValues) => {
    if (!modal.open) return;

    try {
      if (modal.mode === "create") {
        await adminApi.createServer({
          server_name: values.server_name.trim(),
          product_id: Number(values.product_id),
        });

        cyberSuccess(
          `Servidor creado. "${values.server_name}" se agrego al catalogo.`,
        );
      } else if (modal.server) {
        await adminApi.updateServer(modal.server.id, {
          server_name: values.server_name.trim(),
          product_id: Number(values.product_id),
        });

        cyberSuccess(
          `Servidor actualizado. Se guardaron los cambios de "${values.server_name}".`,
        );
      }

      setModal(CLOSED_MODAL);
      await loadServers(page);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al guardar el servidor";
      cyberError(message);
    }
  };

  const handleDeleteConfirm = async (server: ServerEntity) => {
    try {
      await adminApi.deleteServer(server.id);
      cyberSuccess(
        `Servidor eliminado. "${server.server_name}" fue eliminado del sistema.`,
      );
      setDeleteModal({ open: false });

      const willBeEmpty = servers.length === 1 && page > 1;
      const targetPage = willBeEmpty ? page - 1 : page;
      if (willBeEmpty) {
        setPage(targetPage);
      } else {
        await loadServers(targetPage);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al eliminar el servidor";
      cyberError(message);
    }
  };

  return (
    <>
      {/* ─── Header ─── */}
      <ListHeader
        title="Servidores"
        subtitle="Gestion de catalogo :: servidores de juego y regiones"
        actionLabel="Crear servidor"
        actionIcon={<PlusIcon className="h-4 w-4" />}
        onAction={() => setModal({ open: true, mode: "create" })}
      />

      {/* ─── Panel: filtros + tabla + paginacion ─── */}
      <section
        aria-label="Lista de servidores"
        className="overflow-hidden rounded-lg border border-white/5 bg-bg-surface"
      >
        <ServersFilterBar
          filters={filters}
          onChange={handleFiltersChange}
          products={products}
          resultCount={filteredServers.length}
        />
        <ServersTable
          servers={filteredServers}
          products={products}
          loading={loading}
          onEdit={(server) =>
            setModal({
              open: true,
              mode: "edit",
              server,
            })
          }
          onDelete={(server) => setDeleteModal({ open: true, server })}
        />
        {!loading && total > 0 && (
          <Pagination
            page={page}
            pageCount={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
            ariaLabel="Paginacion de servidores"
          />
        )}
      </section>

      {/* ─── Modal reutilizable crear / editar ─── */}
      <ServerFormModal
        open={modal.open}
        mode={modal.mode}
        server={modal.server}
        products={products}
        onSubmit={handleSubmit}
        onClose={() => setModal(CLOSED_MODAL)}
      />

      {/* ─── Modal de confirmacion de eliminacion ─── */}
      <DeleteServerModal
        open={deleteModal.open}
        server={deleteModal.server}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModal({ open: false })}
      />
    </>
  );
}
