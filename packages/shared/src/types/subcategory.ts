export type JsonShapeFieldType =
  | "string"
  | "number"
  | "boolean"
  | "array"
  | "array[string]"
  | "array[number]"
  | "array[object]"
  | "object";

export type JsonShapeMap = Record<string, JsonShapeFieldType | string>;

export interface SubcategoryEntity {
  id: number;
  subcategory_name: string;
  category_id: number;
  json_shape: JsonShapeMap;
}

export interface CreateSubcategoryDTO {
  subcategory_name: string;
  category_id: number;
  json_shape: JsonShapeMap;
}

export interface UpdateSubcategoryDTO {
  subcategory_name?: string;
  category_id?: number;
  json_shape?: JsonShapeMap;
}

export interface JsonShapeFieldItem {
  id: string;
  key: string;
  type: JsonShapeFieldType;
}

export interface SubcategoryFormValues {
  subcategory_name: string;
  category_id: number | "";
  fields: JsonShapeFieldItem[];
}

export interface SubcategoryFilters {
  search: string;
  category_id: number | "ALL";
}
