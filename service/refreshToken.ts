// -------- Token Refresh Service --------
import { cookies } from "next/headers";
import { TApiResponse } from "@/lib/types";

const BASE_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "http://localhost:5000";

/****
 * Calls backend refresh-token endpoint using the refreshToken cookie
 ****/
export async function getNewAccessToken(): Promise<TApiResponse<{ accessToken: string }>> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    });

    const data = await response.json();
    return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to refresh access token",
      data: { accessToken: "" },
    };
  }
}
