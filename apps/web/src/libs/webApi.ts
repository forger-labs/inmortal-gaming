import HttpClient, {
  handleApiError,
} from "@inmortal/shared/src/libs/httpClient";
import type {
  ApiResponse,
  AuthTokens,
  CategoryEntity,
  LandingItemEntity,
  LoginDTO,
  PaginatedResult,
  ProductCatalogEntity,
  ProductEntity,
  RefreshTokenDTO,
  ServerEntity,
  SubcategoryEntity,
  SubProductEntity,
} from "@shared/types";
import axios from "axios";

import { BASE_API_URL, LOCAL_STORAGE_KEYS } from "@/constants/environment";

const httpClient = new HttpClient(BASE_API_URL, axios, LOCAL_STORAGE_KEYS);

export default class WebApi {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Obtiene la lista paginada de items configurados para la landing page (`GET /landing`).
   */
  async getLandingItems(
    page = 1,
    limit = 10,
    show?: boolean | string,
  ): Promise<PaginatedResult<LandingItemEntity>> {
    const result: ApiResponse<PaginatedResult<LandingItemEntity>> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const showParam = show !== undefined ? `&show=${show}` : "";
      const response = await this.httpClient.get({
        url: `/landing?page=${page}&limit=${limit}${showParam}`,
      });

      const { success, data, error } = response.data as ApiResponse<
        PaginatedResult<LandingItemEntity>
      >;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener los elementos de la landing";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene la lista paginada de productos con filtros opcionales (`GET /products`).
   */
  async getProductItems(
    page = 1,
    limit = 10,
    categoryId?: number | string,
  ): Promise<PaginatedResult<ProductEntity>> {
    const result: ApiResponse<PaginatedResult<ProductEntity>> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const categoryParam =
        categoryId !== undefined && categoryId !== 0 && categoryId !== "0"
          ? `&category_id=${categoryId}`
          : "";
      const response = await this.httpClient.get({
        url: `/products?page=${page}&limit=${limit}${categoryParam}`,
      });

      const { success, data, error } = response.data as ApiResponse<
        PaginatedResult<ProductEntity>
      >;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener productos";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene la lista paginada de subproductos con filtros opcionales (`GET /subproducts`).
   */
  async getSubProductItems(
    page = 1,
    limit = 10,
    subcategoryId?: number | string,
  ): Promise<PaginatedResult<SubProductEntity>> {
    const result: ApiResponse<PaginatedResult<SubProductEntity>> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const subcategoryParam =
        subcategoryId !== undefined &&
        subcategoryId !== 0 &&
        subcategoryId !== "0"
          ? `&sub_category_id=${subcategoryId}`
          : "";
      const response = await this.httpClient.get({
        url: `/subproducts?page=${page}&limit=${limit}${subcategoryParam}`,
      });

      const { success, data, error } = response.data as ApiResponse<
        PaginatedResult<SubProductEntity>
      >;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener subproductos";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene el catalogo detallado de un producto por su ID (`GET /products/:id/catalog`).
   */
  async getProductCatalog(id: number | string): Promise<ProductCatalogEntity> {
    const result: ApiResponse<ProductCatalogEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/products/${id}/catalog`,
      });

      const { success, data, error } =
        response.data as ApiResponse<ProductCatalogEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener el catalogo del producto";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene un producto individual por su ID (`GET /products/:id`).
   */
  async getProductById(id: number | string): Promise<ProductEntity> {
    const result: ApiResponse<ProductEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/products/${id}`,
      });

      const { success, data, error } =
        response.data as ApiResponse<ProductEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener el producto";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene un subproducto individual por su ID (`GET /subproducts/:id`).
   */
  async getSubproductById(id: number | string): Promise<SubProductEntity> {
    const result: ApiResponse<SubProductEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/subproducts/${id}`,
      });

      const { success, data, error } =
        response.data as ApiResponse<SubProductEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener el subproducto";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene una categoria por su ID (`GET /categories/:id`).
   */
  async getCategoryById(id: number | string): Promise<CategoryEntity> {
    const result: ApiResponse<CategoryEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/categories/${id}`,
      });

      const { success, data, error } =
        response.data as ApiResponse<CategoryEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener la categoria";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene una subcategoria por su ID (`GET /subcategories/:id`).
   */
  async getSubcategoryById(id: number | string): Promise<SubcategoryEntity> {
    const result: ApiResponse<SubcategoryEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/subcategories/${id}`,
      });

      const { success, data, error } =
        response.data as ApiResponse<SubcategoryEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener la subcategoria";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene un servidor por su ID (`GET /servers/:id`).
   */
  async getServerById(id: number | string): Promise<ServerEntity> {
    const result: ApiResponse<ServerEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/servers/${id}`,
      });

      const { success, data, error } =
        response.data as ApiResponse<ServerEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener el servidor";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene la lista de servidores con filtros (`GET /servers`).
   */
  async getServers(
    page = 1,
    limit = 50,
    productId?: number | string,
  ): Promise<PaginatedResult<ServerEntity>> {
    const result: ApiResponse<PaginatedResult<ServerEntity>> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const productParam =
        productId !== undefined && productId !== 0 && productId !== "0"
          ? `&product_id=${productId}`
          : "";
      const response = await this.httpClient.get({
        url: `/servers?page=${page}&limit=${limit}${productParam}`,
      });

      const { success, data, error } = response.data as ApiResponse<
        PaginatedResult<ServerEntity>
      >;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener servidores";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  async login(credentials: LoginDTO): Promise<AuthTokens> {
    const result: ApiResponse<AuthTokens> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.post<LoginDTO>({
        url: "/auth/admin/login",
        body: credentials,
      });

      const { success, data, error } = response.data as ApiResponse<AuthTokens>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Credenciales inválidas";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  async logout(refreshToken: string): Promise<string> {
    const result: ApiResponse<string> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const payload: RefreshTokenDTO = { refresh_token: refreshToken };
      const response = await this.httpClient.post<RefreshTokenDTO>({
        url: "/auth/logout",
        body: payload,
      });

      const { success, data, error } = response.data as ApiResponse<string>;
      if (!success) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al cerrar sesión";
        throw new Error(errorMessage);
      }

      return data || "Sesión cerrada exitosamente";
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }
}

export const webApi = new WebApi(httpClient);
