"use server";

import { jwtUtils } from "@/utils/jwt";
import { cookies } from "next/headers";

export const getNewAccessToken = async () => {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value || null;

    if (!refreshToken) {
      return {
        success: false,
        message: "Refresh token not found!",
      };
    }

    const backendUrl =
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-cache",
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("RefreshToken error:", error);
    return {
      success: false,
      message: "Failed to refresh token",
    };
  }
};

export const isAccessTokenExist = async () => {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value || null;
  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  if (!accessToken && !refreshToken) {
    return null;
  }

  const decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      )
    : null;

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken();

    if (result?.success && result?.data?.accessToken) {
      const newAccessToken = result.data.accessToken;

      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });

      accessToken = newAccessToken;
    }
  }

  return accessToken;
};
