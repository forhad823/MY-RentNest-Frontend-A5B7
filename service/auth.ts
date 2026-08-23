// -------- Authentication Service Layer --------
import { apiPost } from "@/lib/api-client";
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

//  * Registers a new user (TENANT or LANDLORD) via backend API

export async function registerUser(
  payload: TRegisterPayload,
): Promise<TApiResponse<{ user: TUser }>> {
  return apiPost<{ user: TUser }>("/api/auth/register", payload);
}

//  * Authenticates user credentials and retrieves JWT tokens

export async function loginUser(
  payload: TLoginPayload,
): Promise<TApiResponse<TAuthTokens>> {
  return apiPost<TAuthTokens>("/api/auth/login", payload);
}
