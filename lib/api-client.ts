// -------- Centralized API Client Wrapper --------
import { cookies } from "next/headers";
import { TApiResponse } from "./types";

const BASE_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "http://localhost:5000";

/****
 * Executes server or client-side fetch requests with cookie propagation,
 * automatic header resolution, and standardized error parsing.
 ****/
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<TApiResponse<T>> {
  let cookieHeader = "";

  if (typeof window === "undefined") {
    try {
      // Server environment: forward browser request cookies
      const cookieStore = await cookies();
      cookieHeader = cookieStore.toString();
    } catch {
      // Fallback if accessed outside request context
      cookieHeader = "";
    }
  }

  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (cookieHeader && !headers.has("Cookie")) {
    headers.set("Cookie", cookieHeader);
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  const response = await fetch(`${BASE_URL}${normalizedEndpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let resData: any;
  try {
    resData = await response.json();
  } catch {
    resData = {
      success: response.ok,
      statusCode: response.status,
      message: response.statusText || "An unexpected server response occurred",
      data: null as unknown as T,
    };
  }

  if (!response.ok || !resData.success) {
    throw new Error(
      resData.message || `Request failed with status ${response.status}`,
    );
  }
  return resData as TApiResponse<T>;
}

// -------- Convenience HTTP Method Wrappers --------

//  * HTTP GET request wrapper

export async function apiGet<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<TApiResponse<T>> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: "GET",
  });
}

//  * HTTP POST request wrapper

export async function apiPost<T>(
  endpoint: string,
  body?: unknown,
  options: RequestInit = {},
): Promise<TApiResponse<T>> {
  const isFormData = body instanceof FormData;
  return apiFetch<T>(endpoint, {
    ...options,
    method: "POST",
    body: isFormData ? body : JSON.stringify(body ?? {}),
  });
}

//  * HTTP PUT request wrapper

export async function apiPut<T>(
  endpoint: string,
  body?: unknown,
  options: RequestInit = {},
): Promise<TApiResponse<T>> {
  const isFormData = body instanceof FormData;
  return apiFetch<T>(endpoint, {
    ...options,
    method: "PUT",
    body: isFormData ? body : JSON.stringify(body ?? {}),
  });
}

//   HTTP PATCH request wrapper

export async function apiPatch<T>(
  endpoint: string,
  body?: unknown,
  options: RequestInit = {},
): Promise<TApiResponse<T>> {
  const isFormData = body instanceof FormData;
  return apiFetch<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: isFormData ? body : JSON.stringify(body ?? {}),
  });
}

//   HTTP DELETE request wrapper
export async function apiDelete<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<TApiResponse<T>> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: "DELETE",
  });
}
