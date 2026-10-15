// -------- Token Refresh Service --------
import { cookies } from "next/headers";
import { TApiResponse } from "@/lib/types";
import { BACKEND_BASE_URL } from "@/lib/api-client";

/****
 * Calls backend refresh-token endpoint using the refreshToken cookie.
 * Kept separate from apiFetch() because the proxy (route guard) calls it
 * before a request context exists, so it builds its own fetch with the
 * incoming cookies forwarded manually.
 ****/
export async function getNewAccessToken(): Promise<
  TApiResponse<{ accessToken: string }>
> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    console.log("cookieHeader", cookieHeader);

    const response = await fetch(`${BACKEND_BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (data.success) {
      // Set Access Token Cookie again (1 Day)
      cookieStore.set("accessToken", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 1 * 24 * 60 * 60,
      });
    }
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

//প
