import type { ItemPriceEntity, ServerPriceItem } from "./itemPrice";
import type { ProductEntity } from "./product";
import type { ServerEntity } from "./server";
import type { SubcategoryEntity } from "./subcategory";

export interface SubProductStringFieldData {
  title: string;
  data: string;
}

export interface SubProductArrayFieldData {
  title: string;
  description: string;
  data: string[];
}

export type SubProductFieldData =
  | SubProductStringFieldData
  | SubProductArrayFieldData;

export type SubProductDataMap = Record<
  string,
  SubProductFieldData | Record<string, unknown>
>;

export interface SubProductServerPrice {
  server_id: number;
  server_name?: string;
  price: number;
  is_active?: boolean;
}

export interface SubProductEntity {
  id: number;
  name: string;
  sub_category_id: number;
  server_ids?: number[];
  product_id: number;
  price?: number;
  prices?: ItemPriceEntity[] | ServerPriceItem[];
  product_data: SubProductDataMap;
  is_active: boolean;
  image: string;
}

export interface CreateSubProductDTO {
  name: string;
  sub_category_id: number;
  product_id: number;
  product_data: SubProductDataMap | string;
  is_active?: boolean;
  image: File | Blob | string;
  prices: ServerPriceItem[] | string;
  server_ids?: number[];
  price?: number;
}

export interface UpdateSubProductDTO {
  name?: string;
  sub_category_id?: number;
  product_id?: number;
  product_data?: SubProductDataMap | string;
  is_active?: boolean;
  image?: File | Blob | string;
  prices?: ServerPriceItem[] | string;
  server_ids?: number[];
  price?: number;
}

export interface SubProductServerPriceFormValue {
  server_id: number;
  price: number | "";
  is_active: boolean;
}

export interface SubProductFormValues {
  name: string;
  sub_category_id: number | "";
  product_id: number | "";
  is_active: boolean;
  image: File | string | null;
  server_prices: SubProductServerPriceFormValue[];
  product_data: Record<
    string,
    {
      title: string;
      description?: string;
      data: string | string[];
    }
  >;
  // Optional backwards compatibility fields
  server_ids?: number[];
  price?: number | "";
}

export interface SubProductFilters {
  search: string;
  product_id: number | "ALL";
  sub_category_id: number | "ALL";
  server_id: number | "ALL";
  min_price: string;
  max_price: string;
  status: "ALL" | "ACTIVE" | "INACTIVE";
}

export interface GetSubProductByIdRequest {
  id: number | string;
}

export interface SubProductDetailEntity extends SubProductEntity {
  product?: ProductEntity | null;
  subcategory?: SubcategoryEntity | null;
  servers?: ServerEntity[];
  availableServers?: ServerEntity[];
}
