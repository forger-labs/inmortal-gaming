"use client";

import type {
  AddCartItemDTO,
  CartItemDetailDTO,
  CartResponseDTO,
  CreateGuestOrderDTO,
  CreateOrderDTO,
  GuestOrderItemDTO,
  OrderEntity,
  PaymentMethod,
} from "@shared/types";
import { normalizeVenezuelanPhone } from "@shared/utils";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/context/AuthContext";
import { webApi } from "@/libs/webApi";

const GUEST_CART_STORAGE_KEY = "inmortal.guest.cart";

export interface AddToCartPayload {
  sub_product_id: number;
  item_price_id: number;
  quantity: number;
  product_name?: string;
  price?: number;
  image?: string;
  server_name?: string;
}

export interface CreateOrderPayload {
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
}

export interface CartContextValue {
  items: CartItemDetailDTO[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  addToCart: (payload: AddToCartPayload) => Promise<void>;
  updateQuantity: (
    identifier: number,
    quantity: number,
    itemPriceId?: number,
  ) => Promise<void>;
  removeItem: (identifier: number, itemPriceId?: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  createOrder: (payload: CreateOrderPayload) => Promise<OrderEntity>;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadGuestCart(): CartItemDetailDTO[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items: CartItemDetailDTO[]): void {
  if (typeof window === "undefined") return;
  try {
    if (items.length === 0) {
      localStorage.removeItem(GUEST_CART_STORAGE_KEY);
    } else {
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    // Almacenamiento local no disponible
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItemDetailDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Carga y sincronizacion del carrito segun estado de autenticacion
  const refreshCart = useCallback(async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        // Verificar si habian items de invitado para migrarlos al backend
        const guestItems = loadGuestCart();
        if (guestItems.length > 0) {
          for (const gItem of guestItems) {
            try {
              await webApi.addToCart({
                sub_product_id: gItem.sub_product_id,
                item_price_id: gItem.item_price_id,
                quantity: gItem.quantity,
              });
            } catch {
              // Continuar con los siguientes
            }
          }
          saveGuestCart([]);
        }

        const res: CartResponseDTO = await webApi.getCart();
        setItems(res.items || []);
      } else {
        const local = loadGuestCart();
        setItems(local);
      }
    } catch {
      if (!isAuthenticated) {
        setItems(loadGuestCart());
      } else {
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(
    async (payload: AddToCartPayload) => {
      const {
        sub_product_id,
        item_price_id,
        quantity,
        product_name,
        price,
        image,
        server_name,
      } = payload;

      if (isAuthenticated) {
        const dto: AddCartItemDTO = {
          sub_product_id,
          item_price_id,
          quantity,
        };
        await webApi.addToCart(dto);
        await refreshCart();
      } else {
        setItems((prev) => {
          const existingIndex = prev.findIndex(
            (it) =>
              it.sub_product_id === sub_product_id &&
              it.item_price_id === item_price_id,
          );

          let updated: CartItemDetailDTO[];
          if (existingIndex >= 0) {
            const current = prev[existingIndex];
            const newQty = current.quantity + quantity;
            const unitPrice = price !== undefined ? price : current.price;
            updated = [
              ...prev.slice(0, existingIndex),
              {
                ...current,
                quantity: newQty,
                price: unitPrice,
                subtotal: unitPrice * newQty,
                image: image || current.image,
                server_name: server_name || current.server_name,
              },
              ...prev.slice(existingIndex + 1),
            ];
          } else {
            const unitPrice = price || 0;
            const newItem: CartItemDetailDTO = {
              id: Date.now() + Math.floor(Math.random() * 1000),
              sub_product_id,
              item_price_id,
              product_name: product_name || `Subproducto #${sub_product_id}`,
              price: unitPrice,
              quantity,
              subtotal: unitPrice * quantity,
              image,
              server_name,
            };
            updated = [...prev, newItem];
          }
          saveGuestCart(updated);
          return updated;
        });
      }
    },
    [isAuthenticated, refreshCart],
  );

  const removeItem = useCallback(
    async (identifier: number, itemPriceId?: number) => {
      if (isAuthenticated) {
        await webApi.deleteCartItem(identifier);
        await refreshCart();
      } else {
        setItems((prev) => {
          const updated = prev.filter((item) => {
            if (item.id === identifier) return false;
            if (
              item.sub_product_id === identifier &&
              (!itemPriceId || item.item_price_id === itemPriceId)
            ) {
              return false;
            }
            return true;
          });
          saveGuestCart(updated);
          return updated;
        });
      }
    },
    [isAuthenticated, refreshCart],
  );

  const updateQuantity = useCallback(
    async (identifier: number, quantity: number, itemPriceId?: number) => {
      if (quantity <= 0) {
        await removeItem(identifier, itemPriceId);
        return;
      }

      if (isAuthenticated) {
        // En base de datos el identifier corresponde al ID del item de carrito
        await webApi.updateCartItemQuantity(identifier, { quantity });
        await refreshCart();
      } else {
        setItems((prev) => {
          const updated = prev.map((item) => {
            const isMatch =
              item.id === identifier ||
              (item.sub_product_id === identifier &&
                (!itemPriceId || item.item_price_id === itemPriceId));

            if (isMatch) {
              return {
                ...item,
                quantity,
                subtotal: item.price * quantity,
              };
            }
            return item;
          });
          saveGuestCart(updated);
          return updated;
        });
      }
    },
    [isAuthenticated, refreshCart, removeItem],
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await webApi.clearCart();
      } catch {
        // Continuar limpiando estado local
      }
    }
    saveGuestCart([]);
    setItems([]);
  }, [isAuthenticated]);

  const createOrder = useCallback(
    async (payload: CreateOrderPayload): Promise<OrderEntity> => {
      const { paymentMethod, phoneNumber } = payload;
      const cleanPhone = phoneNumber
        ? normalizeVenezuelanPhone(phoneNumber)
        : undefined;

      if (isAuthenticated) {
        const dto: CreateOrderDTO = {
          payment_method: paymentMethod,
          phone_number: cleanPhone,
        };
        const order = await webApi.createOrder(dto);
        // El backend ya vacia el carrito del usuario al crear la orden
        setItems([]);
        saveGuestCart([]);
        return order;
      }

      // Flujo invitado
      const guestItems: GuestOrderItemDTO[] = items.map((it) => ({
        sub_product_id: it.sub_product_id,
        item_price_id: it.item_price_id,
        quantity: it.quantity,
        unit_price: it.price,
      }));

      const guestDto: CreateGuestOrderDTO = {
        payment_method: paymentMethod,
        phone_number: cleanPhone || "",
        items: guestItems,
      };

      const order = await webApi.createGuestOrder(guestDto);
      // Limpiar carrito local tras concretar orden
      setItems([]);
      saveGuestCart([]);
      return order;
    },
    [isAuthenticated, items],
  );

  const totalItems = useMemo(
    () => items.reduce((acc, it) => acc + (it.quantity || 0), 0),
    [items],
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (acc, it) => acc + (it.subtotal || it.price * it.quantity || 0),
        0,
      ),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      totalPrice,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart,
      createOrder,
    }),
    [
      items,
      totalItems,
      totalPrice,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart,
      createOrder,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return ctx;
}
