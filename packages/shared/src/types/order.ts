export type OrderStatus = "Pendiente" | "Pagado" | "Cancelado" | string;
export type PaymentMethod = "Pagomovil" | "Binance" | string;

export interface OrderEntity {
  id: number;
  user_id?: number | null;
  phone_number?: string;
  total_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  created_at: string;
}

export interface CreateOrderDTO {
  payment_method: PaymentMethod;
  phone_number?: string;
}

export interface GuestOrderItemDTO {
  sub_product_id: number;
  item_price_id: number;
  quantity: number;
  unit_price: number;
}

export interface CreateGuestOrderDTO {
  payment_method: PaymentMethod;
  phone_number: string;
  items: GuestOrderItemDTO[];
}

export interface OrderItemEntity {
  id: number;
  order_id: number;
  sub_product_id: number;
  item_price_id: number;
  quantity: number;
  unit_price: number;
  sub_total: number;
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
}

export interface OrderFilters {
  user_id?: number | string;
  status?: OrderStatus | "all";
  min_total_amount?: number | string;
  max_total_amount?: number | string;
  created_at?: string;
  sort_created_at?: "asc" | "desc";
}
