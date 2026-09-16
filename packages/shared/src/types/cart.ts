export interface AddCartItemDTO {
  sub_product_id: number;
  item_price_id: number;
  quantity: number;
}

export interface UpdateCartItemDTO {
  quantity: number;
}

export interface CartItemEntity {
  id: number;
  user_id: number;
  sub_product_id: number;
  item_price_id: number;
  quantity: number;
}

export interface CartItemDetailDTO {
  id: number;
  user_id?: number;
  sub_product_id: number;
  item_price_id: number;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
  server_name?: string;
}

export interface CartResponseDTO {
  items: CartItemDetailDTO[];
  total_items: number;
  total_price: number;
}
