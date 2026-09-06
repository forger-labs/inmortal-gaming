export interface LoginDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refresh_token: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface JwtPayload {
  id?: number;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
}
