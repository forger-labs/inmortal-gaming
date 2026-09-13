import type { CategoryEntity } from "./category";

export interface ProductEntity {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  category_id: number;
  image: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  is_active?: boolean;
  category_id: number;
  image?: File | Blob | string | null;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  is_active?: boolean;
  category_id?: number;
  image?: File | Blob | string | null;
}

export interface ProductFormValues {
  name: string;
  description: string;
  category_id: number | "";
  is_active: boolean;
  image?: File | Blob | string | null;
}

export interface ProductFilters {
  search: string;
  category_id: number | "ALL";
  status: "ALL" | "ACTIVE" | "INACTIVE";
}

export interface CatalogSubProduct {
  id: number;
  name: string;
  price: number;
  product_data: Record<string, unknown>;
  is_active: boolean;
  image?: string;
}

export interface CatalogServer {
  id: number;
  server_name: string;
  sub_products: CatalogSubProduct[];
}

export interface CatalogSubcategory {
  id: number;
  subcategory_name: string;
  servers: CatalogServer[];
}

export interface ProductCatalogEntity {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  image: string;
  category: CategoryEntity;
  subcategories: CatalogSubcategory[];
}
