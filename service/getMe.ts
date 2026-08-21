"use server";

import { GetMeResponse } from "@/lib/types";
import { cookies } from "next/headers";


export const getMe = async (): Promise<GetMeResponse> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
      return {
        success: false,
        message: "User not logged in!",
      };
    }

    const backendUrl =
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      "http://localhost:5000";

    const res = await fetch(`${backendUrl}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Cookie: `accessToken=${accessToken}`,
      },
      next: {
        revalidate: 60, // 1 minute revalidation or on-demand cache
        tags: ["my-profile"],
      },
    });

    if (!res.ok) {
      return {
        success: false,
        message: "Failed to fetch user profile",
      };
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("getMe error:", error);
    return {
      success: false,
      message: "Internal server error fetching user",
    };
  }
};
