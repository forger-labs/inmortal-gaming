import type { AxiosRequestConfig, AxiosResponse } from "axios";

export interface HttpClientInterface {
  get(options: GetParams): Promise<AxiosResponse<unknown, unknown, object>>;
  post(options: PostParams): Promise<AxiosResponse<unknown, unknown, object>>;
  delete(
    options: DeleteParams,
  ): Promise<AxiosResponse<unknown, unknown, object>>;
  put(options: PutParams): Promise<AxiosResponse<unknown, unknown, object>>;
  patch(options: PutParams): Promise<AxiosResponse<unknown, unknown, object>>;
}

export interface GetParams {
  url: string;
  headers?: object;
  options?: AxiosRequestConfig;
}

export interface PostParams<T = object> {
  url: string;
  body?: T;
  headers?: object;
  options?: AxiosRequestConfig;
}

export interface PutParams {
  url: string;
  body?: object;
  headers?: object;
  options?: AxiosRequestConfig;
}
export interface DeleteParams {
  url: string;
  headers?: object;
  options?: AxiosRequestConfig;
}

export interface LocalStorageKeys {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: string | Record<string, unknown> | null;
}

export interface LoginResponse {
  accessToken: string;
}

export interface PaginationMeta {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PaginatedApiResponse<T> {
  status: boolean;
  data: T | null;
  message: string | string[];
  meta: PaginationMeta | null;
}
