export interface ItemPriceEntity {
  id: number;
  sub_product_id: number;
  server_id: number;
  price: number;
  is_active: boolean;
}

export interface ServerPriceItem {
  server_id: number;
  price: number;
  is_active?: boolean;
}

export interface CreateItemPriceDTO {
  sub_product_id: number;
  server_id: number;
  price: number;
  is_active?: boolean;
}

export interface UpdateItemPriceDTO {
  price?: number;
  is_active?: boolean;
}

export interface ItemPriceFilters {
  sub_product_id?: number | string;
  server_id?: number | string;
  is_active?: boolean;
  min_price?: number | string;
  max_price?: number | string;
}
