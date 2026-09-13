import type {
  CategoryEntity,
  GetSubProductByIdRequest,
  JsonShapeFieldConfig,
  JsonShapeMap,
  ProductEntity,
  ServerEntity,
  SubcategoryEntity,
  SubProductDataMap,
  SubProductDetailEntity,
  SubProductEntity,
  SubProductFieldData,
} from "@shared/types";

export type {
  CategoryEntity,
  GetSubProductByIdRequest,
  JsonShapeFieldConfig,
  JsonShapeMap,
  ProductEntity,
  ServerEntity,
  SubcategoryEntity,
  SubProductDataMap,
  SubProductDetailEntity,
  SubProductEntity,
  SubProductFieldData,
};

export interface SubproductPageProps {
  params: Promise<{ id: string }>;
}

export interface SubproductViewProps {
  subproductId: string | number;
}
