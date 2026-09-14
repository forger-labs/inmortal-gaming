export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginUserDTO {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterUserDTO {
  name: string;
  last_name: string;
  email: string;
  password: string;
  username: string;
}

export interface UserEntity {
  id: number;
  name: string;
  last_name: string;
  email: string;
  username: string;
  role?: string;
}

export interface UserMeDTO {
  id: number;
  name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
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
