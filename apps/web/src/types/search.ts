export interface SearchItemResult {
  id: string | number;
  name: string;
  type: "product" | "subproduct";
  href: string;
}

export interface SearchResultsGrouped {
  products: SearchItemResult[];
  subproducts: SearchItemResult[];
}
