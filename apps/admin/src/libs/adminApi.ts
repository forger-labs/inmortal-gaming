import HttpClient, {
  handleApiError,
} from "@inmortal/shared/src/libs/httpClient";
import type {
  AdminEntity,
  ApiResponse,
  AuthTokens,
  CategoryEntity,
  CreateAdminDTO,
  CreateCategoryDTO,
  CreateLandingItemDTO,
  CreateProductDTO,
  CreateServerDTO,
  CreateSubcategoryDTO,
  CreateSubProductDTO,
  LandingItemEntity,
  LoginDTO,
  PaginatedResult,
  ProductCatalogEntity,
  ProductEntity,
  RefreshTokenDTO,
  ServerEntity,
  SubcategoryEntity,
  SubProductEntity,
  UpdateAdminDTO,
  UpdateCategoryDTO,
  UpdateLandingItemDTO,
  UpdateProductDTO,
  UpdateServerDTO,
  UpdateSubcategoryDTO,
  UpdateSubProductDTO,
} from "@shared/types";
import axios from "axios";

import { LOCAL_STORAGE_KEYS } from "@/constants";
import { BASE_API_URL } from "@/constants/environment";

const httpClient = new HttpClient(BASE_API_URL, axios, LOCAL_STORAGE_KEYS);

export default class AdminApi {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Inicia sesión de administrador utilizando el cliente HTTP estándar (`POST /auth/admin/login`).
   */
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

  /**
   * Cierra la sesión activa en el backend (`POST /auth/logout`).
   */
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

  /**
   * Obtiene la lista paginada de administradores (`GET /admins`).
   */
  async getAdmins(page = 1, limit = 10): Promise<PaginatedResult<AdminEntity>> {
    const result: ApiResponse<PaginatedResult<AdminEntity>> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/admins?page=${page}&limit=${limit}`,
      });

      const { success, data, error } = response.data as ApiResponse<
        PaginatedResult<AdminEntity>
      >;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener administradores";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene un administrador por su identificador (`GET /admins/:id`).
   */
  async getAdminById(id: number | string): Promise<AdminEntity> {
    const result: ApiResponse<AdminEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/admins/${id}`,
      });

      const { success, data, error } =
        response.data as ApiResponse<AdminEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener el administrador";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene un administrador por su correo electrónico (`GET /admins/email/:email`).
   */
  async getAdminByEmail(email: string): Promise<AdminEntity> {
    const result: ApiResponse<AdminEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/admins/email/${encodeURIComponent(email)}`,
      });

      const { success, data, error } =
        response.data as ApiResponse<AdminEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener el administrador por email";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Crea un nuevo administrador (`POST /admins`).
   */
  async createAdmin(dto: CreateAdminDTO): Promise<AdminEntity> {
    const result: ApiResponse<AdminEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.post<CreateAdminDTO>({
        url: "/admins",
        body: dto,
      });

      const { success, data, error } =
        response.data as ApiResponse<AdminEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al crear el administrador";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Actualiza un administrador existente (`PUT /admins/:id`).
   */
  async updateAdmin(
    id: number | string,
    dto: UpdateAdminDTO,
  ): Promise<AdminEntity> {
    const result: ApiResponse<AdminEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.put({
        url: `/admins/${id}`,
        body: dto,
      });

      const { success, data, error } =
        response.data as ApiResponse<AdminEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al actualizar el administrador";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene la lista paginada de categorías (`GET /categories`).
   */
  async getCategories(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<CategoryEntity>> {
    const result: ApiResponse<PaginatedResult<CategoryEntity>> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/categories?page=${page}&limit=${limit}`,
      });

      const { success, data, error } = response.data as ApiResponse<
        PaginatedResult<CategoryEntity>
      >;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener categorías";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene una categoría por su identificador (`GET /categories/:id`).
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
              "Error al obtener la categoría";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene una categoría por su nombre (`GET /categories/name/:name`).
   */
  async getCategoryByName(name: string): Promise<CategoryEntity> {
    const result: ApiResponse<CategoryEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/categories/name/${encodeURIComponent(name)}`,
      });

      const { success, data, error } =
        response.data as ApiResponse<CategoryEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener la categoría por nombre";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Crea una nueva categoría (`POST /categories`).
   */
  async createCategory(dto: CreateCategoryDTO): Promise<CategoryEntity> {
    const result: ApiResponse<CategoryEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.post<CreateCategoryDTO>({
        url: "/categories",
        body: dto,
      });

      const { success, data, error } =
        response.data as ApiResponse<CategoryEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al crear la categoría";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Actualiza una categoría existente (`PUT /categories/:id`).
   */
  async updateCategory(
    id: number | string,
    dto: UpdateCategoryDTO,
  ): Promise<CategoryEntity> {
    const result: ApiResponse<CategoryEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.put({
        url: `/categories/${id}`,
        body: dto,
      });

      const { success, data, error } =
        response.data as ApiResponse<CategoryEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al actualizar la categoría";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Elimina una categoría (`DELETE /categories/:id`).
   */
  async deleteCategory(id: number | string): Promise<{ message: string }> {
    const result: ApiResponse<{ message: string }> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.delete({
        url: `/categories/${id}`,
      });

      const { success, data, error } = response.data as ApiResponse<{
        message: string;
      }>;
      if (!success) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al eliminar la categoría";
        throw new Error(errorMessage);
      }

      return data ?? { message: "Categoría eliminada exitosamente" };
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene la lista paginada de subcategorías (`GET /subcategories`).
   */
  async getSubcategories(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<SubcategoryEntity>> {
    const result: ApiResponse<PaginatedResult<SubcategoryEntity>> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/subcategories?page=${page}&limit=${limit}`,
      });

      const { success, data, error } = response.data as ApiResponse<
        PaginatedResult<SubcategoryEntity>
      >;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener subcategorías";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene una subcategoría por su identificador (`GET /subcategories/:id`).
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
              "Error al obtener la subcategoría";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene una subcategoría por su nombre (`GET /subcategories/name/:name`).
   */
  async getSubcategoryByName(name: string): Promise<SubcategoryEntity> {
    const result: ApiResponse<SubcategoryEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/subcategories/name/${encodeURIComponent(name)}`,
      });

      const { success, data, error } =
        response.data as ApiResponse<SubcategoryEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener la subcategoría por nombre";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Crea una nueva subcategoría (`POST /subcategories`).
   */
  async createSubcategory(
    dto: CreateSubcategoryDTO,
  ): Promise<SubcategoryEntity> {
    const result: ApiResponse<SubcategoryEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.post<CreateSubcategoryDTO>({
        url: "/subcategories",
        body: dto,
      });

      const { success, data, error } =
        response.data as ApiResponse<SubcategoryEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al crear la subcategoría";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Actualiza una subcategoría existente (`PUT /subcategories/:id`).
   */
  async updateSubcategory(
    id: number | string,
    dto: UpdateSubcategoryDTO,
  ): Promise<SubcategoryEntity> {
    const result: ApiResponse<SubcategoryEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.put({
        url: `/subcategories/${id}`,
        body: dto,
      });

      const { success, data, error } =
        response.data as ApiResponse<SubcategoryEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al actualizar la subcategoría";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Elimina una subcategoría (`DELETE /subcategories/:id`).
   */
  async deleteSubcategory(id: number | string): Promise<{ message: string }> {
    const result: ApiResponse<{ message: string }> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.delete({
        url: `/subcategories/${id}`,
      });

      const { success, data, error } = response.data as ApiResponse<{
        message: string;
      }>;
      if (!success) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al eliminar la subcategoría";
        throw new Error(errorMessage);
      }

      return data ?? { message: "Subcategoría eliminada exitosamente" };
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene la lista paginada de productos (`GET /products`).
   */
  async getProducts(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<ProductEntity>> {
    const result: ApiResponse<PaginatedResult<ProductEntity>> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/products?page=${page}&limit=${limit}`,
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
   * Obtiene un producto por su identificador (`GET /products/:id`).
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
   * Obtiene un producto por su nombre (`GET /products/name/:name`).
   */
  async getProductByName(name: string): Promise<ProductEntity> {
    const result: ApiResponse<ProductEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/products/name/${encodeURIComponent(name)}`,
      });

      const { success, data, error } =
        response.data as ApiResponse<ProductEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener el producto por nombre";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene el catálogo completo de un producto con subcategorías y servidores (`GET /products/:id/catalog`).
   */
  async getProductCatalogById(
    id: number | string,
  ): Promise<ProductCatalogEntity> {
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
              "Error al obtener el catálogo del producto";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Crea un nuevo producto utilizando multipart/form-data (`POST /products`).
   */
  async createProduct(
    dto: CreateProductDTO | FormData,
  ): Promise<ProductEntity> {
    const result: ApiResponse<ProductEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      let body: FormData;
      if (dto instanceof FormData) {
        body = dto;
      } else {
        body = new FormData();
        body.append("name", dto.name);
        body.append("description", dto.description);
        body.append("category_id", String(dto.category_id));
        if (dto.is_active !== undefined) {
          body.append("is_active", String(dto.is_active));
        }
        if (dto.image instanceof File || dto.image instanceof Blob) {
          body.append("image", dto.image);
        } else if (typeof dto.image === "string" && dto.image) {
          body.append("image", dto.image);
        }
      }

      const response = await this.httpClient.post<FormData>({
        url: "/products",
        body,
      });

      const { success, data, error } =
        response.data as ApiResponse<ProductEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al crear el producto";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Actualiza un producto existente utilizando multipart/form-data (`PUT /products/:id`).
   */
  async updateProduct(
    id: number | string,
    dto: UpdateProductDTO | FormData,
  ): Promise<ProductEntity> {
    const result: ApiResponse<ProductEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      let body: FormData;
      if (dto instanceof FormData) {
        body = dto;
      } else {
        body = new FormData();
        if (dto.name !== undefined) {
          body.append("name", dto.name);
        }
        if (dto.description !== undefined) {
          body.append("description", dto.description);
        }
        if (dto.category_id !== undefined) {
          body.append("category_id", String(dto.category_id));
        }
        if (dto.is_active !== undefined) {
          body.append("is_active", String(dto.is_active));
        }
        if (dto.image instanceof File || dto.image instanceof Blob) {
          body.append("image", dto.image);
        } else if (typeof dto.image === "string" && dto.image) {
          body.append("image", dto.image);
        }
      }

      const response = await this.httpClient.put({
        url: `/products/${id}`,
        body,
      });

      const { success, data, error } =
        response.data as ApiResponse<ProductEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al actualizar el producto";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Elimina un producto (`DELETE /products/:id`).
   */
  async deleteProduct(id: number | string): Promise<{ message: string }> {
    const result: ApiResponse<{ message: string }> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.delete({
        url: `/products/${id}`,
      });

      const { success, data, error } = response.data as ApiResponse<{
        message: string;
      }>;
      if (!success) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al eliminar el producto";
        throw new Error(errorMessage);
      }

      return data ?? { message: "Producto eliminado exitosamente" };
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene la lista paginada de servidores (`GET /servers`).
   */
  async getServers(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<ServerEntity>> {
    const result: ApiResponse<PaginatedResult<ServerEntity>> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/servers?page=${page}&limit=${limit}`,
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

  /**
   * Obtiene un servidor por su identificador (`GET /servers/:id`).
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
   * Obtiene un servidor por su nombre (`GET /servers/name/:name`).
   */
  async getServerByName(name: string): Promise<ServerEntity> {
    const result: ApiResponse<ServerEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/servers/name/${encodeURIComponent(name)}`,
      });

      const { success, data, error } =
        response.data as ApiResponse<ServerEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener el servidor por nombre";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Crea un nuevo servidor (`POST /servers`).
   */
  async createServer(dto: CreateServerDTO): Promise<ServerEntity> {
    const result: ApiResponse<ServerEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.post<CreateServerDTO>({
        url: "/servers",
        body: dto,
      });

      const { success, data, error } =
        response.data as ApiResponse<ServerEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al crear el servidor";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Actualiza un servidor existente (`PUT /servers/:id`).
   */
  async updateServer(
    id: number | string,
    dto: UpdateServerDTO,
  ): Promise<ServerEntity> {
    const result: ApiResponse<ServerEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.put({
        url: `/servers/${id}`,
        body: dto,
      });

      const { success, data, error } =
        response.data as ApiResponse<ServerEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al actualizar el servidor";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Elimina un servidor (`DELETE /servers/:id`).
   */
  async deleteServer(id: number | string): Promise<{ message: string }> {
    const result: ApiResponse<{ message: string }> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.delete({
        url: `/servers/${id}`,
      });

      const { success, data, error } = response.data as ApiResponse<{
        message: string;
      }>;
      if (!success) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al eliminar el servidor";
        throw new Error(errorMessage);
      }

      return data ?? { message: "Servidor eliminado exitosamente" };
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /* ══════════════════════════════════════════════════════════════════
     MÓDULO LANDING PAGE (`/v1/landing`)
     ══════════════════════════════════════════════════════════════════ */

  /**
   * Obtiene la lista paginada de items configurados para la landing page (`GET /landing`).
   */
  async getLandingItems(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<LandingItemEntity>> {
    const result: ApiResponse<PaginatedResult<LandingItemEntity>> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/landing?page=${page}&limit=${limit}`,
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
   * Obtiene un item de landing por ID (`GET /landing/:id`).
   */
  async getLandingItemById(id: number | string): Promise<LandingItemEntity> {
    const result: ApiResponse<LandingItemEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/landing/${id}`,
      });

      const { success, data, error } =
        response.data as ApiResponse<LandingItemEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Elemento de landing no encontrado";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Crea un nuevo item para la landing page (`POST /landing`).
   */
  async createLandingItem(
    dto: CreateLandingItemDTO,
  ): Promise<LandingItemEntity> {
    const result: ApiResponse<LandingItemEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.post<CreateLandingItemDTO>({
        url: "/landing",
        body: dto,
      });

      const { success, data, error } =
        response.data as ApiResponse<LandingItemEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al crear el elemento de la landing";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Actualiza un item existente de la landing page (`PUT /landing/:id`).
   */
  async updateLandingItem(
    id: number | string,
    dto: UpdateLandingItemDTO,
  ): Promise<LandingItemEntity> {
    const result: ApiResponse<LandingItemEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.put({
        url: `/landing/${id}`,
        body: dto,
      });

      const { success, data, error } =
        response.data as ApiResponse<LandingItemEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al actualizar el elemento de la landing";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Elimina un item de la landing page (`DELETE /landing/:id`).
   * No elimina la categoría ni subcategoría original referenciada.
   */
  async deleteLandingItem(id: number | string): Promise<{ message: string }> {
    const result: ApiResponse<{ message: string }> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.delete({
        url: `/landing/${id}`,
      });

      const { success, data, error } = response.data as ApiResponse<{
        message: string;
      }>;
      if (!success) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al eliminar el elemento de la landing";
        throw new Error(errorMessage);
      }

      return (
        data ?? { message: "Elemento eliminado de la landing exitosamente" }
      );
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene la lista paginada de subproductos (`GET /subproducts`).
   */
  async getSubproducts(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<SubProductEntity>> {
    const result: ApiResponse<PaginatedResult<SubProductEntity>> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/subproducts?page=${page}&limit=${limit}`,
      });

      const { success, data, error } = response.data as ApiResponse<
        PaginatedResult<SubProductEntity>
      >;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener la lista de subproductos";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene un subproducto por su identificador (`GET /subproducts/:id`).
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
   * Obtiene un subproducto por su nombre (`GET /subproducts/name/:name`).
   */
  async getSubproductByName(name: string): Promise<SubProductEntity> {
    const result: ApiResponse<SubProductEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/subproducts/name/${encodeURIComponent(name)}`,
      });

      const { success, data, error } =
        response.data as ApiResponse<SubProductEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener el subproducto por nombre";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Crea un nuevo subproducto utilizando multipart/form-data (`POST /subproducts`).
   */
  async createSubproduct(
    dto: CreateSubProductDTO | FormData,
  ): Promise<SubProductEntity> {
    const result: ApiResponse<SubProductEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      let body: FormData;
      if (dto instanceof FormData) {
        body = dto;
      } else {
        body = new FormData();
        body.append("name", dto.name);
        body.append("sub_category_id", String(dto.sub_category_id));
        body.append("server_id", String(dto.server_id));
        body.append("product_id", String(dto.product_id));
        body.append("price", String(dto.price));
        const productDataStr =
          typeof dto.product_data === "string"
            ? dto.product_data
            : JSON.stringify(dto.product_data);
        body.append("product_data", productDataStr);
        if (dto.is_active !== undefined) {
          body.append("is_active", String(dto.is_active));
        }
        if (dto.image instanceof File || dto.image instanceof Blob) {
          body.append("image", dto.image);
        } else if (typeof dto.image === "string" && dto.image) {
          body.append("image", dto.image);
        }
      }

      const response = await this.httpClient.post({
        url: "/subproducts",
        body,
      });

      const { success, data, error } =
        response.data as ApiResponse<SubProductEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al crear el subproducto";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Actualiza un subproducto existente utilizando multipart/form-data (`PUT /subproducts/:id`).
   */
  async updateSubproduct(
    id: number | string,
    dto: UpdateSubProductDTO | FormData,
  ): Promise<SubProductEntity> {
    const result: ApiResponse<SubProductEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      let body: FormData;
      if (dto instanceof FormData) {
        body = dto;
      } else {
        body = new FormData();
        if (dto.name !== undefined) {
          body.append("name", dto.name);
        }
        if (dto.sub_category_id !== undefined) {
          body.append("sub_category_id", String(dto.sub_category_id));
        }
        if (dto.server_id !== undefined) {
          body.append("server_id", String(dto.server_id));
        }
        if (dto.product_id !== undefined) {
          body.append("product_id", String(dto.product_id));
        }
        if (dto.price !== undefined) {
          body.append("price", String(dto.price));
        }
        if (dto.product_data !== undefined) {
          const productDataStr =
            typeof dto.product_data === "string"
              ? dto.product_data
              : JSON.stringify(dto.product_data);
          body.append("product_data", productDataStr);
        }
        if (dto.is_active !== undefined) {
          body.append("is_active", String(dto.is_active));
        }
        if (dto.image instanceof File || dto.image instanceof Blob) {
          body.append("image", dto.image);
        }
      }

      const response = await this.httpClient.put({
        url: `/subproducts/${id}`,
        body,
      });

      const { success, data, error } =
        response.data as ApiResponse<SubProductEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al actualizar el subproducto";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Elimina un subproducto (`DELETE /subproducts/:id`).
   */
  async deleteSubproduct(id: number | string): Promise<{ message: string }> {
    const result: ApiResponse<{ message: string }> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.delete({
        url: `/subproducts/${id}`,
      });

      const { success, data, error } = response.data as ApiResponse<{
        message: string;
      }>;
      if (!success) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al eliminar el subproducto";
        throw new Error(errorMessage);
      }

      return data ?? { message: "Subproducto eliminado exitosamente" };
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }
}

export const adminApi = new AdminApi(httpClient);
