// -------- Authentication Service Layer --------
import { apiGet, apiPost } from "@/lib/api-client";
import { Role, TApiResponse, TUser } from "@/lib/types";

export type TRegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TAuthTokens = {
  accessToken: string;
  refreshToken: string;
};

/****
 * Registers a new user (TENANT or LANDLORD) via backend API
 ****/
export async function registerUser(
  payload: TRegisterPayload
): Promise<TApiResponse<{ user: TUser }>> {
  return apiPost<{ user: TUser }>("/api/auth/register", payload);
}

/****
 * Authenticates user credentials and retrieves JWT tokens
 ****/
export async function loginUser(
  payload: TLoginPayload
): Promise<TApiResponse<TAuthTokens>> {
  return apiPost<TAuthTokens>("/api/auth/login", payload);
}

/****
 * Retrieves profile information for the currently authenticated user
 ****/
export async function getCurrentUser(): Promise<TApiResponse<{ currentUser: TUser }>> {
  return apiGet<{ currentUser: TUser }>("/api/auth/me");
}

/****
 * Requests a new accessToken using the active refreshToken cookie
 ****/
export async function refreshToken(): Promise<TApiResponse<{ accessToken: string }>> {
  return apiPost<{ accessToken: string }>("/api/auth/refresh-token");
}

// -------- Service Export Bundle --------
export const authService = {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshToken,
}; 