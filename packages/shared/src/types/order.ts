export type OrderStatus = "Pendiente" | "Pagado" | "Cancelado" | string;
export type PaymentMethod = "Pagomovil" | "Binance" | string;

export interface OrderEntity {
  id: number;
  user_id: number;
  total_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  created_at: string;
}

export interface CreateOrderDTO {
  payment_method: PaymentMethod;
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
}
