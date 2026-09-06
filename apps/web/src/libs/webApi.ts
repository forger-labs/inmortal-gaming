import HttpClient, {
  handleApiError,
} from "@inmortal/shared/src/libs/httpClient";
import type {
  ApiResponse,
  AuthTokens,
  LoginDTO,
  RefreshTokenDTO,
} from "@shared/types";
import axios from "axios";

import { BASE_API_URL, LOCAL_STORAGE_KEYS } from "@/constants/environment";

const httpClient = new HttpClient(BASE_API_URL, axios, LOCAL_STORAGE_KEYS);

export default class WebApi {
  constructor(private readonly httpClient: HttpClient) {}

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
