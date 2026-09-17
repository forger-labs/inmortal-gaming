import HttpClient, {
  handleApiError,
} from "@inmortal/shared/src/libs/httpClient";
import type {
  AddCartItemDTO,
  ApiResponse,
  AuthTokens,
  CartItemEntity,
  CartResponseDTO,
  CategoryEntity,
  CreateGuestOrderDTO,
  CreateOrderDTO,
  ItemPriceEntity,
  ItemPriceFilters,
  LandingItemEntity,
  LoginUserDTO,
  OrderEntity,
  OrderFilters,
  OrderItemEntity,
  PaginatedResult,
  ProductCatalogEntity,
  ProductEntity,
  RefreshTokenDTO,
  RegisterUserDTO,
  ServerEntity,
  SubcategoryEntity,
  SubProductEntity,
  UpdateCartItemDTO,
  UpdateUserDTO,
  UserEntity,
  UserMeDTO,
} from "@shared/types";
import axios, { isAxiosError } from "axios";

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
    serverId?: number | string,
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
      const serverParam =
        serverId !== undefined && serverId !== 0 && serverId !== "0"
          ? `&server_id=${serverId}`
          : "";
      const response = await this.httpClient.get({
        url: `/subproducts?page=${page}&limit=${limit}${subcategoryParam}${serverParam}`,
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

  /**
   * Registra un nuevo usuario en la plataforma (`POST /users/register`).
   */
  async register(userData: RegisterUserDTO): Promise<UserEntity> {
    const result: ApiResponse<UserEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.post<RegisterUserDTO>({
        url: "/users/register",
        body: userData,
      });

      const { success, data, error } = response.data as ApiResponse<UserEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al registrar usuario";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      if (isAxiosError(error) && error.response?.data) {
        const resData = error.response.data as {
          error?: string | { message?: string };
          message?: string;
        };
        const msg =
          typeof resData.error === "string"
            ? resData.error
            : resData.error?.message || resData.message || error.message;
        throw new Error(msg);
      }
      throw error;
    }
  }

  /**
   * Inicia sesión de usuario (`POST /auth/user/login`).
   */
  async login(credentials: LoginUserDTO): Promise<AuthTokens> {
    const result: ApiResponse<AuthTokens> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.post<LoginUserDTO>({
        url: "/auth/user/login",
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
      if (isAxiosError(error) && error.response?.data) {
        const resData = error.response.data as {
          error?: string | { message?: string };
          message?: string;
        };
        const msg =
          typeof resData.error === "string"
            ? resData.error
            : resData.error?.message || resData.message || error.message;
        throw new Error(msg);
      }
      throw error;
    }
  }

  /**
   * Obtiene el perfil del usuario autenticado actual (`GET /auth/user/me`).
   */
  async getMe(): Promise<UserMeDTO> {
    const result: ApiResponse<UserMeDTO> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: "/auth/user/me",
      });

      const { success, data, error } = response.data as ApiResponse<UserMeDTO>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener datos del usuario";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      if (isAxiosError(error) && error.response?.data) {
        const resData = error.response.data as {
          error?: string | { message?: string };
          message?: string;
        };
        const msg =
          typeof resData.error === "string"
            ? resData.error
            : resData.error?.message || resData.message || error.message;
        throw new Error(msg);
      }
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
      if (isAxiosError(error) && error.response?.data) {
        const resData = error.response.data as {
          error?: string | { message?: string };
          message?: string;
        };
        const msg =
          typeof resData.error === "string"
            ? resData.error
            : resData.error?.message || resData.message || error.message;
        throw new Error(msg);
      }
      throw error;
    }
  }

  /**
   * Actualiza el perfil de un usuario (`PUT /users/:id`).
   */
  async updateUser(
    id: number | string,
    dto: UpdateUserDTO,
  ): Promise<UserEntity> {
    const result: ApiResponse<UserEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.put({
        url: `/users/${id}`,
        body: dto,
      });

      const { success, data, error } = response.data as ApiResponse<UserEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al actualizar el usuario";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      if (isAxiosError(error) && error.response?.data) {
        const resData = error.response.data as {
          error?: string | { message?: string };
          message?: string;
        };
        const msg =
          typeof resData.error === "string"
            ? resData.error
            : resData.error?.message || resData.message || error.message;
        throw new Error(msg);
      }
      throw error;
    }
  }

  /**
   * Obtiene la lista paginada de ordenes del usuario autenticado (`GET /orders/my-orders`).
   */
  async getMyOrders(
    page = 1,
    limit = 10,
    filters?: OrderFilters,
  ): Promise<PaginatedResult<OrderEntity>> {
    const result: ApiResponse<PaginatedResult<OrderEntity>> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      let queryParams = `page=${page}&limit=${limit}`;
      if (filters?.status && filters.status !== "all") {
        queryParams += `&status=${encodeURIComponent(filters.status)}`;
      }
      if (
        filters?.min_total_amount !== undefined &&
        filters.min_total_amount !== ""
      ) {
        queryParams += `&min_total_amount=${filters.min_total_amount}`;
      }
      if (
        filters?.max_total_amount !== undefined &&
        filters.max_total_amount !== ""
      ) {
        queryParams += `&max_total_amount=${filters.max_total_amount}`;
      }
      if (filters?.created_at) {
        queryParams += `&created_at=${encodeURIComponent(filters.created_at)}`;
      }
      if (filters?.sort_created_at) {
        queryParams += `&sort_created_at=${filters.sort_created_at}`;
      }

      const response = await this.httpClient.get({
        url: `/orders/my-orders?${queryParams}`,
      });

      const { success, data, error } = response.data as ApiResponse<
        PaginatedResult<OrderEntity>
      >;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener las ordenes del usuario";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      if (isAxiosError(error) && error.response?.data) {
        const resData = error.response.data as {
          error?: string | { message?: string };
          message?: string;
        };
        const msg =
          typeof resData.error === "string"
            ? resData.error
            : resData.error?.message || resData.message || error.message;
        throw new Error(msg);
      }
      throw error;
    }
  }

  /**
   * Crea una orden de compra para un usuario autenticado (`POST /orders`).
   * Vacia el carrito persistido en base de datos.
   */
  async createOrder(dto: CreateOrderDTO): Promise<OrderEntity> {
    const result: ApiResponse<OrderEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.post<CreateOrderDTO>({
        url: "/orders",
        body: dto,
      });

      const { success, data, error } =
        response.data as ApiResponse<OrderEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al generar la orden";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      if (isAxiosError(error) && error.response?.data) {
        const resData = error.response.data as {
          error?: string | { message?: string };
          message?: string;
        };
        const msg =
          typeof resData.error === "string"
            ? resData.error
            : resData.error?.message || resData.message || error.message;
        throw new Error(msg);
      }
      throw error;
    }
  }

  /**
   * Crea una orden de compra publica para un usuario invitado / no autenticado (`POST /orders/guest`).
   */
  async createGuestOrder(dto: CreateGuestOrderDTO): Promise<OrderEntity> {
    const result: ApiResponse<OrderEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.post<CreateGuestOrderDTO>({
        url: "/orders/guest",
        body: dto,
      });

      const { success, data, error } =
        response.data as ApiResponse<OrderEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al generar la orden de invitado";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      if (isAxiosError(error) && error.response?.data) {
        const resData = error.response.data as {
          error?: string | { message?: string };
          message?: string;
        };
        const msg =
          typeof resData.error === "string"
            ? resData.error
            : resData.error?.message || resData.message || error.message;
        throw new Error(msg);
      }
      throw error;
    }
  }

  /**
   * Obtiene los detalles de una orden por su identificador (`GET /orders/my-orders/:id`).
   */
  async getOrderById(id: number | string): Promise<OrderEntity> {
    const result: ApiResponse<OrderEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/orders/my-orders/${id}`,
      });

      const { success, data, error } =
        response.data as ApiResponse<OrderEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener la orden";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      if (isAxiosError(error) && error.response?.data) {
        const resData = error.response.data as {
          error?: string | { message?: string };
          message?: string;
        };
        const msg =
          typeof resData.error === "string"
            ? resData.error
            : resData.error?.message || resData.message || error.message;
        throw new Error(msg);
      }
      throw error;
    }
  }

  /**
   * Obtiene la lista de items de una orden (`GET /orders/:id/items`).
   */
  async getOrderItems(orderId: number | string): Promise<OrderItemEntity[]> {
    const result: ApiResponse<OrderItemEntity[]> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/order-items/${orderId}`,
      });

      const { success, data, error } = response.data as ApiResponse<
        OrderItemEntity[]
      >;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener los items de la orden";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      if (isAxiosError(error) && error.response?.data) {
        const resData = error.response.data as {
          error?: string | { message?: string };
          message?: string;
        };
        const msg =
          typeof resData.error === "string"
            ? resData.error
            : resData.error?.message || resData.message || error.message;
        throw new Error(msg);
      }
      throw error;
    }
  }

  /**
   * Obtiene el carrito del usuario autenticado con totales e items (`GET /cart`).
   */
  async getCart(): Promise<CartResponseDTO> {
    const result: ApiResponse<CartResponseDTO> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: "/cart",
      });

      const { success, data, error } =
        response.data as ApiResponse<CartResponseDTO>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener el carrito";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      if (isAxiosError(error) && error.response?.data) {
        const resData = error.response.data as {
          error?: string | { message?: string };
          message?: string;
        };
        const msg =
          typeof resData.error === "string"
            ? resData.error
            : resData.error?.message || resData.message || error.message;
        throw new Error(msg);
      }
      throw error;
    }
  }

  /**
   * Agrega un item al carrito del usuario (`POST /cart/items`).
   */
  async addToCart(dto: AddCartItemDTO): Promise<CartItemEntity> {
    const result: ApiResponse<CartItemEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.post<AddCartItemDTO>({
        url: "/cart/items",
        body: dto,
      });

      const { success, data, error } =
        response.data as ApiResponse<CartItemEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al agregar el item al carrito";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      if (isAxiosError(error) && error.response?.data) {
        const resData = error.response.data as {
          error?: string | { message?: string };
          message?: string;
        };
        const msg =
          typeof resData.error === "string"
            ? resData.error
            : resData.error?.message || resData.message || error.message;
        throw new Error(msg);
      }
      throw error;
    }
  }

  /**
   * Actualiza la cantidad de un item en el carrito (`PUT /cart/items/:id`).
   */
  async updateCartItemQuantity(
    id: number | string,
    dto: UpdateCartItemDTO,
  ): Promise<CartItemEntity> {
    const result: ApiResponse<CartItemEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.put({
        url: `/cart/items/${id}`,
        body: dto,
      });

      const { success, data, error } =
        response.data as ApiResponse<CartItemEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al actualizar la cantidad del item";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      if (isAxiosError(error) && error.response?.data) {
        const resData = error.response.data as {
          error?: string | { message?: string };
          message?: string;
        };
        const msg =
          typeof resData.error === "string"
            ? resData.error
            : resData.error?.message || resData.message || error.message;
        throw new Error(msg);
      }
      throw error;
    }
  }

  /**
   * Elimina un item del carrito (`DELETE /cart/items/:id`).
   */
  async deleteCartItem(id: number | string): Promise<string> {
    const result: ApiResponse<string> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.delete({
        url: `/cart/items/${id}`,
      });

      const { success, data, error } = response.data as ApiResponse<string>;
      if (!success) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al eliminar el item del carrito";
        throw new Error(errorMessage);
      }

      return data || "Item eliminado exitosamente";
    } catch (error) {
      handleApiError(error, result);
      if (isAxiosError(error) && error.response?.data) {
        const resData = error.response.data as {
          error?: string | { message?: string };
          message?: string;
        };
        const msg =
          typeof resData.error === "string"
            ? resData.error
            : resData.error?.message || resData.message || error.message;
        throw new Error(msg);
      }
      throw error;
    }
  }

  /**
   * Vacia completamente el carrito del usuario (`DELETE /cart`).
   */
  async clearCart(): Promise<string> {
    const result: ApiResponse<string> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.delete({
        url: "/cart",
      });

      const { success, data, error } = response.data as ApiResponse<string>;
      if (!success) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al vaciar el carrito";
        throw new Error(errorMessage);
      }

      return data || "Carrito vaciado exitosamente";
    } catch (error) {
      handleApiError(error, result);
      if (isAxiosError(error) && error.response?.data) {
        const resData = error.response.data as {
          error?: string | { message?: string };
          message?: string;
        };
        const msg =
          typeof resData.error === "string"
            ? resData.error
            : resData.error?.message || resData.message || error.message;
        throw new Error(msg);
      }
      throw error;
    }
  }

  /**
   * Obtiene la lista paginada de precios de items por servidor (`GET /item-prices`).
   */
  async getItemPrices(
    page = 1,
    limit = 50,
    filter?: ItemPriceFilters,
  ): Promise<PaginatedResult<ItemPriceEntity>> {
    const result: ApiResponse<PaginatedResult<ItemPriceEntity>> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      let queryParams = `page=${page}&limit=${limit}`;
      if (filter?.sub_product_id !== undefined) {
        queryParams += `&sub_product_id=${filter.sub_product_id}`;
      }
      if (filter?.server_id !== undefined) {
        queryParams += `&server_id=${filter.server_id}`;
      }
      if (filter?.is_active !== undefined) {
        queryParams += `&is_active=${filter.is_active}`;
      }
      if (filter?.min_price !== undefined && filter.min_price !== "") {
        queryParams += `&min_price=${filter.min_price}`;
      }
      if (filter?.max_price !== undefined && filter.max_price !== "") {
        queryParams += `&max_price=${filter.max_price}`;
      }

      const response = await this.httpClient.get({
        url: `/item-prices?${queryParams}`,
      });

      const { success, data, error } = response.data as ApiResponse<
        PaginatedResult<ItemPriceEntity>
      >;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener los precios de items";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene un precio de item por su identificador (`GET /item-prices/:id`).
   */
  async getItemPriceById(id: number | string): Promise<ItemPriceEntity> {
    const result: ApiResponse<ItemPriceEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/item-prices/${id}`,
      });

      const { success, data, error } =
        response.data as ApiResponse<ItemPriceEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener el precio del item";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }

  /**
   * Obtiene el precio de un subproducto en un servidor puntual (`GET /item-prices/subproduct/:sub_product_id/server/:server_id`).
   */
  async getItemPriceBySubProductAndServer(
    subProductId: number | string,
    serverId: number | string,
  ): Promise<ItemPriceEntity> {
    const result: ApiResponse<ItemPriceEntity> = {
      data: null,
      success: false,
      error: null,
    };
    try {
      const response = await this.httpClient.get({
        url: `/item-prices/subproduct/${subProductId}/server/${serverId}`,
      });

      const { success, data, error } =
        response.data as ApiResponse<ItemPriceEntity>;
      if (!success || !data) {
        const errorMessage =
          typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Error al obtener el precio del subproducto en el servidor";
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      handleApiError(error, result);
      throw error;
    }
  }
}

export const webApi = new WebApi(httpClient);
