export interface ServerEntity {
  id: number;
  server_name: string;
  product_id: number;
}

export interface CreateServerDTO {
  server_name: string;
  product_id: number;
}

export interface UpdateServerDTO {
  server_name?: string;
  product_id?: number;
}

export interface ServerFormValues {
  server_name: string;
  product_id: number | "";
}

export interface ServerFilters {
  search: string;
  product_id: number | "ALL";
}
