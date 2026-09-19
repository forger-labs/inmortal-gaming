"use client";

import { cyberError } from "@shared/toasts";
import type { OrderEntity, OrderFilters } from "@shared/types";
import { useCallback, useEffect, useState } from "react";

import { ListHeader } from "@/components/commonList/ListHeader";
import { Pagination } from "@/components/commonList/Pagination";
import { adminApi } from "@/libs/adminApi";
import { OrderCardItem } from "./OrderCardItem";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { OrdersEmptyState } from "./OrdersEmptyState";
import { OrdersFilterBar } from "./OrdersFilterBar";
import { OrdersListSkeleton } from "./OrdersListSkeleton";

const PAGE_SIZE = 10;

const DEFAULT_FILTERS: OrderFilters = {
  status: "all",
  sort_created_at: "desc",
  created_at: undefined,
  min_total_amount: undefined,
  max_total_amount: undefined,
  user_id: undefined,
};

export function OrdersView() {
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT_FILTERS);

  const [selectedOrder, setSelectedOrder] = useState<OrderEntity | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const loadOrders = useCallback(
    async (targetPage: number, currentFilters: OrderFilters, query: string) => {
      setLoading(true);
      try {
        const payloadFilter: OrderFilters = { ...currentFilters };

        // Si la busqueda es un numero valido, se envia como user_id
        const trimmed = query.trim();
        if (trimmed && /^\d+$/.test(trimmed)) {
          payloadFilter.user_id = Number(trimmed);
        }

        const response = await adminApi.getOrders(
          targetPage,
          PAGE_SIZE,
          payloadFilter,
        );

        let items = response.items || [];

        // Si la busqueda contiene texto no numerico, filtramos adicionalmente en memoria (ej. telefono o metodo)
        if (trimmed && !/^\d+$/.test(trimmed)) {
          const lower = trimmed.toLowerCase();
          items = items.filter(
            (o) =>
              o.phone_number?.toLowerCase().includes(lower) ||
              o.payment_method?.toLowerCase().includes(lower) ||
              o.status?.toLowerCase().includes(lower),
          );
        }

        setOrders(items);
        setTotal(response.total ?? items.length);
        setTotalPages(
          response.total_pages ??
            Math.max(
              1,
              Math.ceil((response.total ?? items.length) / PAGE_SIZE),
            ),
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Error al cargar la lista de ordenes";
        cyberError(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadOrders(page, filters, searchQuery);
  }, [loadOrders, page, filters, searchQuery]);

  const handleFiltersChange = (next: OrderFilters) => {
    setFilters(next);
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handlePageChange = (next: number) => {
    const safePage = Math.min(Math.max(1, next), Math.max(1, totalPages));
    setPage(safePage);
  };

  const handleOpenDetails = (order: OrderEntity) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdated = (updatedOrder: OrderEntity) => {
    setSelectedOrder(updatedOrder);
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
    );
  };

  return (
    <div className="flex flex-col">
      {/* ─── Cabecera Principal ─── */}
      <ListHeader
        title="Gestion de Ordenes"
        subtitle="Monitoreo de transacciones y pedidos :: rol requerido: admin / super_admin"
      />

      {/* ─── Panel Principal de Ordenes ─── */}
      <section
        aria-label="Lista de ordenes y transacciones"
        className="overflow-hidden rounded-xl border border-white/5 bg-bg-surface shadow-[0_0_30px_rgba(0,0,0,0.5)]"
      >
        {/* Barra de Filtros Multifactorial */}
        <OrdersFilterBar
          filters={filters}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onFiltersChange={handleFiltersChange}
          resultCount={orders.length}
        />

        {/* ─── Listado estilizado mediante divs ─── */}
        <div className="p-5 lg:p-6">
          {loading ? (
            <OrdersListSkeleton />
          ) : orders.length === 0 ? (
            <OrdersEmptyState />
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order, index) => (
                <OrderCardItem
                  key={order.id}
                  order={order}
                  index={index}
                  onViewDetails={handleOpenDetails}
                />
              ))}
            </div>
          )}
        </div>

        {/* ─── Paginacion ─── */}
        {!loading && total > 0 && (
          <Pagination
            page={page}
            pageCount={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
            ariaLabel="Paginacion de ordenes"
          />
        )}
      </section>

      {/* ─── Modal de Detalles y Transición de Estado ─── */}
      <OrderDetailsModal
        open={detailsModalOpen}
        order={selectedOrder}
        onClose={handleCloseDetails}
        onStatusUpdated={handleStatusUpdated}
      />
    </div>
  );
}
