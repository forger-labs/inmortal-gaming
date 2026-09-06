export interface CategoryEntity {
  id: number;
  category_name: string;
}

export interface CreateCategoryDTO {
  category_name: string;
}

export interface UpdateCategoryDTO {
  category_name: string;
}

export interface CategoryFormValues {
  category_name: string;
}

export interface CategoryFilters {
  search: string;
}
