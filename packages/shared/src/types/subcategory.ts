export type JsonShapeTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "span"
  | "p"
  | "paragraph";

export type JsonShapeFieldType = "string" | "array";

export type JsonShapeFontWeight = "400" | "500" | "600" | "700" | string;

export interface JsonShapeStringConfig {
  field_type: "string";
  title_tag: JsonShapeTag;
  title_font_weight?: JsonShapeFontWeight;
  tag: JsonShapeTag;
  data_weight?: JsonShapeFontWeight;
}

export interface JsonShapeArrayConfig {
  field_type: "array";
  title_tag: JsonShapeTag;
  title_font_weight?: JsonShapeFontWeight;
  ordered?: boolean;
  data_weight?: JsonShapeFontWeight;
}

export type JsonShapeFieldConfig = JsonShapeStringConfig | JsonShapeArrayConfig;

export type JsonShapeMap = Record<
  string,
  JsonShapeFieldConfig | JsonShapeFieldType | string
>;

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
  field_type: JsonShapeFieldType;
  title_tag: JsonShapeTag;
  title_font_weight?: string;
  tag?: JsonShapeTag;
  ordered?: boolean;
  data_weight?: string;
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
