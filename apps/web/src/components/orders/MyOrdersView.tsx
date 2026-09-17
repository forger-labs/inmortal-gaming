"use client";

import { BoltIcon, OrdersIcon } from "@shared/icons";
import { cyberError } from "@shared/toasts";
import type { OrderEntity, OrderFilters } from "@shared/types";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import ProfileNavTabs from "@/components/profile/ProfileNavTabs";
import ProfileUnauthenticated from "@/components/profile/ProfileUnauthenticated";
import { EASE_OUT_EXPO } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { webApi } from "@/libs/webApi";
import MyOrdersFilterBar from "./MyOrdersFilterBar";
import OrdersEmptyState from "./OrdersEmptyState";
import OrdersList from "./OrdersList";
import OrdersPagination from "./OrdersPagination";
import OrdersSkeleton from "./OrdersSkeleton";

const DEFAULT_FILTERS: OrderFilters = {
  status: "all",
  sort_created_at: "desc",
  created_at: undefined,
  min_total_amount: undefined,
  max_total_amount: undefined,
};

export default function MyOrdersView() {
  const { user, isAuthenticated, accessToken, getMe } = useAuth();
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT_FILTERS);

  const fetchOrders = useCallback(
    async (
      pageToFetch = 1,
      isBackground = false,
      currentFilters = filters,
      query = searchQuery,
    ) => {
      if (!isBackground) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);

      try {
        const payloadFilter: OrderFilters = { ...currentFilters };
        const response = await webApi.getMyOrders(
          pageToFetch,
          10,
          payloadFilter,
        );

        let items = response.items || [];
        const trimmed = query.trim().toLowerCase();
        if (trimmed) {
          items = items.filter(
            (o) =>
              String(o.id).includes(trimmed) ||
              o.payment_method?.toLowerCase().includes(trimmed) ||
              o.status?.toLowerCase().includes(trimmed),
          );
        }

        setOrders(items);
        setTotal(response.total || 0);
        setTotalPages(response.total_pages || 1);
        setPage(response.page || pageToFetch);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudieron cargar tus ordenes de compra";
        setError(message);
        cyberError(message, "[ERROR DE ORDENES]");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters, searchQuery],
  );

  useEffect(() => {
    let mounted = true;
    const initData = async () => {
      if (accessToken && !user) {
        await getMe();
      }
      if (mounted && isAuthenticated) {
        await fetchOrders(page, false, filters, searchQuery);
      } else if (mounted) {
        setLoading(false);
      }
    };

    void initData();

    return () => {
      mounted = false;
    };
  }, [
    accessToken,
    isAuthenticated,
    user,
    getMe,
    fetchOrders,
    page,
    filters,
    searchQuery,
  ]);

  const handleFiltersChange = (next: OrderFilters) => {
    setFilters(next);
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    void fetchOrders(newPage, false, filters, searchQuery);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = () => {
    void fetchOrders(page, true, filters, searchQuery);
  };

  if (!isAuthenticated && !loading) {
    return (
      <div className="mx-auto min-h-screen max-w-7xl px-6 pt-28 pb-16 md:px-12">
        <ProfileUnauthenticated
          title="Historial de Ordenes"
          description="Inicia sesion con tu cuenta para revisar el estado y detalles de todas tus compras."
        />
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
      className="mx-auto min-h-screen max-w-7xl px-6 pt-28 pb-16 md:px-12"
    >
      <div className="flex flex-col gap-6">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span
              data-text="HISTORIAL DE COMPRAS"
              className="glitch font-mono text-xs font-bold uppercase tracking-[0.25em] text-neon-primary"
            >
              Historial de compras
            </span>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              Mis Ordenes
            </h1>
            <p className="mt-1 font-body text-xs text-text-secondary sm:text-sm">
              Consulta el estado de entrega y comprobantes de tus pedidos
              adquiridos en la plataforma.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-bg-surface px-4 py-2 font-mono text-xs text-text-secondary transition-all hover:border-neon-primary/40 hover:text-text-primary disabled:opacity-50"
          >
            <BoltIcon
              className={`h-4 w-4 text-neon-primary ${refreshing ? "animate-spin" : ""}`}
            />
            <span>{refreshing ? "Actualizando..." : "Actualizar"}</span>
          </button>
        </div>

        {/* Pestanas de navegacion */}
        <ProfileNavTabs />

        {/* Barra de Filtros */}
        <MyOrdersFilterBar
          filters={filters}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onFiltersChange={handleFiltersChange}
          resultCount={orders.length}
        />

        {/* Informacion de estado */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-neon-pink/30 bg-neon-pink/10 p-4 text-sm text-neon-pink">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => fetchOrders(page, false, filters, searchQuery)}
              className="cursor-pointer underline font-semibold hover:text-white"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Contenido principal */}
        {loading ? (
          <OrdersSkeleton />
        ) : orders.length === 0 ? (
          <OrdersEmptyState />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs font-mono text-text-secondary">
              <span className="flex items-center gap-2">
                <OrdersIcon className="h-4 w-4 text-neon-primary" />
                <span>TOTAL DE PEDIDOS REGISTRADOS</span>
              </span>
              <span className="font-bold text-text-primary">
                {total} orden(es)
              </span>
            </div>

            <OrdersList orders={orders} />

            <OrdersPagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              disabled={loading || refreshing}
            />
          </div>
        )}
      </div>
    </motion.main>
  );
}
