"use server";

// -------- Authentication Server Actions --------
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { authService, TLoginPayload, TRegisterPayload } from "@/service/auth";
import { Role } from "@/lib/types";

interface TDecodedAuthToken extends JwtPayload {
  id?: string;
  name?: string;
  email?: string; 
  role?: Role;
}

export type TActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

/****
 * Server action to register a new user with TENANT or LANDLORD role
 ****/
export async function registerAction(
  payload: TRegisterPayload
): Promise<TActionResponse> {
  try {
    const response = await authService.registerUser(payload);
    return {
      success: true,
      message: response.message || "User registered successfully.",
      data: response.data,
    };
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Registration failed. Please try again.";
    return {
      success: false,
      message: errMessage,
      error: errMessage,
    };
  }
}

/****
 * Server action to authenticate user, set HTTP-only session cookies, and return role info
 ****/
export async function loginAction(
  payload: TLoginPayload
): Promise<TActionResponse<{ role?: Role; redirectUrl: string }>> {
  try {
    const response = await authService.loginUser(payload);
    const { accessToken, refreshToken } = response.data;

    const cookieStore = await cookies();

    // Set Access Token Cookie (1 Day)
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 1 * 24 * 60 * 60,
    });

    // Set Refresh Token Cookie (10 Days)
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 24 * 60 * 60,
    });

    // Decode token to determine user dashboard destination
    const secret = process.env.JWT_ACCESS_SECRET || "";
    let userRole: Role | undefined;

    try {
      const decoded = jwt.verify(accessToken, secret) as TDecodedAuthToken;
      userRole = decoded.role;
    } catch {
      const decoded = jwt.decode(accessToken) as TDecodedAuthToken | null;
      userRole = decoded?.role;
    }

    let redirectUrl = "/";
    if (userRole === "TENANT") {
      redirectUrl = "/dashboard/tenant";
    } else if (userRole === "LANDLORD") {
      redirectUrl = "/dashboard/landlord";
    } else if (userRole === "ADMIN") {
      redirectUrl = "/dashboard/admin";
    }

    return {
      success: true,
      message: response.message || "Logged in successfully.",
      data: {
        role: userRole,
        redirectUrl,
      },
    };
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Invalid credentials. Please try again.";
    return {
      success: false,
      message: errMessage,
      error: errMessage,
    };
  }
}

/****
 * Server action to clear session cookies and log out user
 ****/
export async function logoutAction(): Promise<TActionResponse> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return {
      success: true,
      message: "Logged out successfully.",
    };
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Failed to log out.";
    return {
      success: false,
      message: errMessage,
      error: errMessage,
    };
  }
}

/****
 * Server action to fetch current authenticated user profile from backend
 ****/
export async function getCurrentUserAction(): Promise<TActionResponse> {
  try {
    const response = await authService.getCurrentUser();
    return {
      success: true,
      message: response.message || "User profile retrieved successfully.",
      data: response.data.currentUser,
    };
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Failed to retrieve user profile.";
    return {
      success: false,
      message: errMessage,
      error: errMessage,
    };
  }
}