import HttpClient, {
  handleApiError,
} from "@inmortal/shared/src/libs/httpClient";
import type {
  AdminEntity,
  ApiResponse,
  AuthTokens,
  CreateAdminDTO,
  LoginDTO,
  PaginatedResult,
  RefreshTokenDTO,
  UpdateAdminDTO,
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
}

export const adminApi = new AdminApi(httpClient);
