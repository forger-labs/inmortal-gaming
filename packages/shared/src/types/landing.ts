export type LandingSortBy =
  | "mostSell"
  | "newest"
  | "oldest"
  | "cheaper"
  | "mostExpensive";

export interface LandingItemEntity {
  id: number;
  title: string;
  description: string;
  category_id?: number | null;
  sub_category_id?: number | null;
  show: boolean;
  qt_products_show: number;
  order: number;
  sort_by: LandingSortBy;
}

export interface CreateLandingItemDTO {
  title: string;
  description: string;
  category_id?: number | null;
  sub_category_id?: number | null;
  show?: boolean;
  qt_products_show: number;
  order?: number;
  sort_by: LandingSortBy;
}

export interface UpdateLandingItemDTO {
  title?: string;
  description?: string;
  category_id?: number | null;
  sub_category_id?: number | null;
  show?: boolean;
  qt_products_show?: number;
  order?: number;
  sort_by?: LandingSortBy;
}

export interface LandingItemFormValues {
  title: string;
  description: string;
  target_type: "category" | "subcategory";
  category_id: number | "";
  sub_category_id: number | "";
  show: boolean;
  qt_products_show: number;
  order: number;
  sort_by: LandingSortBy;
}

export type LandingStatusFilter = "ALL" | "ACTIVE" | "INACTIVE";
export type LandingTypeFilter = "ALL" | "CATEGORY" | "SUBCATEGORY";

export interface LandingFilters {
  search: string;
  status: LandingStatusFilter;
  type: LandingTypeFilter;
  category_id: number | "ALL";
}
