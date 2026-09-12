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

export interface SubProductEntity {
  id: number;
  name: string;
  sub_category_id: number;
  server_id: number;
  product_id: number;
  price: number;
  product_data: SubProductDataMap;
  is_active: boolean;
  image: string;
}

export interface CreateSubProductDTO {
  name: string;
  sub_category_id: number;
  server_id: number;
  product_id: number;
  price: number;
  product_data: SubProductDataMap | string;
  is_active?: boolean;
  image: File | Blob | string;
}

export interface UpdateSubProductDTO {
  name?: string;
  sub_category_id?: number;
  server_id?: number;
  product_id?: number;
  price?: number;
  product_data?: SubProductDataMap | string;
  is_active?: boolean;
  image?: File | Blob | string;
}

export interface SubProductFormValues {
  name: string;
  sub_category_id: number | "";
  server_id: number | "";
  product_id: number | "";
  price: number | "";
  is_active: boolean;
  image: File | string | null;
  product_data: Record<
    string,
    {
      title: string;
      description?: string;
      data: string | string[];
    }
  >;
}

export interface SubProductFilters {
  search: string;
  product_id: number | "ALL";
  sub_category_id: number | "ALL";
  min_price: string;
  max_price: string;
  status: "ALL" | "ACTIVE" | "INACTIVE";
}
