"use client";

import {
  CloseIcon,
  EmailIcon,
  OrdersIcon,
  ProductsIcon,
  ShieldCheckIcon,
  UserIcon,
  WalletIcon,
} from "@shared/icons";
import { cyberError, cyberSuccess } from "@shared/toasts";
import type {
  OrderEntity,
  OrderItemEntity,
  OrderStatus,
  SubProductEntity,
  UserEntity,
} from "@shared/types";
import { getR2ImageUrl } from "@shared/utils";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { adminApi } from "@/libs/adminApi";
import ClientHeader from "./ClientHeader";
import ClientSkeleton from "./ClientSkeleton";
import { OrderStatusBadge } from "./OrderStatusBadge";

export interface OrderDetailsModalProps {
  open: boolean;
  order: OrderEntity | null;
  onClose: () => void;
  onStatusUpdated: (updatedOrder: OrderEntity) => void;
}

const SKELETON_ITEMS = ["order-item-sk-1", "order-item-sk-2"];

export function OrderDetailsModal({
  open,
  order,
  onClose,
  onStatusUpdated,
}: OrderDetailsModalProps) {
  const [items, setItems] = useState<OrderItemEntity[]>([]);
  const [subproducts, setSubproducts] = useState<
    Record<number, SubProductEntity>
  >({});
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [nextStatus, setNextStatus] = useState<OrderStatus>("");
  const [user, setUser] = useState<UserEntity | null>(null);

  const loadUserDetails = useCallback(async (userId: number) => {
    setLoadingUser(true);
    try {
      // 1. Cargar items de la orden mediante /order-items/:id
      const user = await adminApi.getUser(userId);
      setUser(user);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al cargar el usuario de la orden";
      cyberError(message);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const loadOrderDetails = useCallback(async (orderId: number) => {
    setLoading(true);
    try {
      // 1. Cargar items de la orden mediante /order-items/:id
      const orderItems = await adminApi.getOrderItems(orderId);
      setItems(orderItems || []);

      // 2. Cargar datos de subproductos para cada item
      const subProductIds = Array.from(
        new Set(orderItems.map((item) => item.sub_product_id)),
      );

      const subproductResults = await Promise.allSettled(
        subProductIds.map((id) => adminApi.getSubproductById(id)),
      );

      const map: Record<number, SubProductEntity> = {};
      subproductResults.forEach((res) => {
        if (res.status === "fulfilled" && res.value) {
          map[res.value.id] = res.value;
        }
      });

      setSubproducts(map);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al cargar los detalles e items de la orden";
      cyberError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && order) {
      setNextStatus("");
      loadOrderDetails(order.id);
      if (order.user_id) {
        loadUserDetails(order.user_id);
      }
    } else {
      setItems([]);
      setSubproducts({});
      setUser(null);
    }
  }, [open, order, loadOrderDetails, loadUserDetails]);

  if (!open || !order) return null;

  const isPending = order.status?.toLowerCase() === "pendiente";
  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No disponible";

  const handleUpdateStatus = async () => {
    if (!nextStatus || nextStatus === order.status) {
      return;
    }

    setUpdating(true);
    try {
      const updated = await adminApi.updateOrderStatus(order.id, nextStatus);
      cyberSuccess(
        `Estado de la orden #${order.id} actualizado a ${nextStatus}.`,
      );
      onStatusUpdated(updated);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al actualizar el estado de la orden";
      cyberError(message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md"
    >
      <div className="relative my-8 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-bg-surface shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* ─── Cabecera del Modal ─── */}
        <div className="flex items-center justify-between border-b border-white/5 bg-bg-elevated/60 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neon-primary/40 bg-neon-primary/10 text-neon-primary">
              <OrdersIcon className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="order-details-title"
                className="font-display text-lg font-bold text-text-primary"
              >
                Detalles de Orden #{order.id}
              </h2>
              <p className="font-mono text-xs text-text-muted">
                Registrada el {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <OrderStatusBadge status={order.status} />
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="rounded-lg border border-white/10 p-2 text-text-secondary transition-colors hover:border-neon-pink/40 hover:text-neon-pink active:scale-95 cursor-pointer"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ─── Contenido Scrollable ─── */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Ficha Resumen del Cliente */}
          {loadingUser ? (
            <ClientSkeleton />
          ) : (
            <ClientHeader user={user} order={order} />
          )}

          {/* Seccion de Items de la Orden */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Items comprados ({items.length})
              </h3>
              {loading && (
                <span className="font-mono text-xs text-neon-primary animate-pulse">
                  Cargando productos...
                </span>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                {SKELETON_ITEMS.map((key) => (
                  <div
                    key={key}
                    className="flex animate-pulse items-center gap-4 rounded-xl border border-white/5 bg-bg-primary/40 p-4"
                  >
                    <div className="h-14 w-14 rounded-lg bg-white/5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-48 rounded bg-white/10" />
                      <div className="h-3 w-24 rounded bg-white/5" />
                    </div>
                    <div className="h-5 w-20 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-xl border border-white/5 bg-bg-primary/30 p-8 text-center">
                <p className="font-body text-sm text-text-muted">
                  No se encontraron items registrados para esta orden.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const subproduct = subproducts[item.sub_product_id];
                  const imgUrl = subproduct
                    ? getR2ImageUrl(subproduct.image)
                    : "";

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 rounded-xl border border-white/5 bg-bg-primary/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-bg-elevated">
                          {imgUrl ? (
                            <Image
                              src={imgUrl}
                              alt={
                                subproduct?.name ||
                                `Subproducto #${item.sub_product_id}`
                              }
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <ProductsIcon className="h-6 w-6 text-text-muted/50" />
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span className="font-body text-sm font-semibold text-text-primary">
                            {subproduct?.name ||
                              `Subproducto #${item.sub_product_id}`}
                          </span>
                          <span className="font-mono text-xs text-text-muted">
                            Cantidad: {item.quantity} × $
                            {Number(item.unit_price).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-white/5 pt-2 sm:border-t-0 sm:pt-0">
                        <div className="flex flex-col items-start sm:items-end">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                            Subtotal
                          </span>
                          <span className="font-mono text-base font-bold text-neon-primary">
                            $
                            {Number(item.sub_total).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Total de la Orden */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-bg-elevated/40 p-4">
            <span className="font-display text-base font-bold text-text-primary">
              Monto Total de la Orden
            </span>
            <span className="font-mono text-2xl font-bold text-neon-primary">
              $
              {Number(order.total_amount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* ─── Control de Transición de Estado ─── */}
          <div className="rounded-xl border border-white/10 bg-bg-primary/80 p-5">
            <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Gestion de Estado
            </h3>

            {isPending ? (
              <div className="space-y-4">
                <p className="font-body text-xs text-text-secondary">
                  Esta orden esta{" "}
                  <span className="font-semibold text-neon-amber">
                    Pendiente
                  </span>
                  . Como administrador puedes confirmarla como{" "}
                  <span className="font-semibold text-neon-green">Pagado</span>{" "}
                  o marcarla como{" "}
                  <span className="font-semibold text-neon-pink">
                    Cancelado
                  </span>
                  . Una vez cambiada, no podra volver a modificarse.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNextStatus("Pagado")}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      nextStatus === "Pagado"
                        ? "border-neon-green bg-neon-green/20 text-neon-green shadow-[0_0_15px_rgba(0,255,136,0.25)]"
                        : "border-white/10 bg-bg-surface text-text-secondary hover:border-neon-green/40 hover:text-text-primary"
                    }`}
                  >
                    <ShieldCheckIcon className="h-4 w-4 text-neon-green" />
                    Marcar como Pagado
                  </button>

                  <button
                    type="button"
                    onClick={() => setNextStatus("Cancelado")}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      nextStatus === "Cancelado"
                        ? "border-neon-pink bg-neon-pink/20 text-neon-pink shadow-[0_0_15px_rgba(255,45,123,0.25)]"
                        : "border-white/10 bg-bg-surface text-text-secondary hover:border-neon-pink/40 hover:text-text-primary"
                    }`}
                  >
                    <CloseIcon className="h-4 w-4 text-neon-pink" />
                    Marcar como Cancelado
                  </button>
                </div>

                {nextStatus && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setNextStatus("")}
                      className="rounded-lg border border-white/10 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary cursor-pointer"
                    >
                      Descartar
                    </button>
                    <button
                      type="button"
                      disabled={updating}
                      onClick={handleUpdateStatus}
                      className="flex items-center gap-2 rounded-lg border border-neon-primary/50 bg-neon-primary px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-bg-primary shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all hover:bg-neon-primary/90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                      {updating
                        ? "Guardando..."
                        : `Confirmar cambio a ${nextStatus}`}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-bg-surface p-3.5">
                <span
                  className="h-2 w-2 rounded-full bg-text-muted"
                  aria-hidden="true"
                />
                <p className="font-body text-xs text-text-secondary">
                  Esta orden ya se encuentra en estado{" "}
                  <span className="font-mono font-semibold text-text-primary">
                    {order.status}
                  </span>
                  . Por politica de integridad del sistema, su estado es
                  definitivo y no admite modificaciones posteriores.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Footer del Modal ─── */}
        <div className="flex items-center justify-end border-t border-white/5 bg-bg-elevated/40 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-bg-surface px-5 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:border-neon-primary/40 hover:text-text-primary cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
