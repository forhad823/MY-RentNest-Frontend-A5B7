// -------- Server-Side Cookie & Session Management Utilities --------
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role, ActiveStatus } from "./types";

export type TAuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  activeStatus?: ActiveStatus;
  iat?: number;
  exp?: number;
};

export type TAuthSession = {
  user: TAuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
};

// -------- Auth Tokens Retrieval --------

/****
 * Reads accessToken and refreshToken from server-side cookies
 ****/
export async function getAuthTokens(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;
    const refreshToken = cookieStore.get("refreshToken")?.value || null;
    return { accessToken, refreshToken };
  } catch {
    return { accessToken: null, refreshToken: null };
  }
}

// -------- Server Session Parsing --------

/****
 * Parses and verifies accessToken from cookies to return complete server session information
 ****/
export async function getServerSession(): Promise<TAuthSession> {
  const { accessToken, refreshToken } = await getAuthTokens();

  if (!accessToken) {
    return {
      user: null,
      accessToken: null,
      refreshToken,
      isAuthenticated: false,
    };
  }

  try {
    const secret = process.env.JWT_ACCESS_SECRET || "";
    const decoded = jwt.verify(accessToken, secret) as JwtPayload;

    if (!decoded || typeof decoded === "string" || !decoded.id) {
      return {
        user: null,
        accessToken,
        refreshToken,
        isAuthenticated: false,
      };
    }

    const user: TAuthUser = {
      id: decoded.id as string,
      name: (decoded.name as string) || "",
      email: (decoded.email as string) || "",
      role: decoded.role as Role,
      activeStatus: (decoded.activeStatus as ActiveStatus) || "ACTIVE",
      iat: decoded.iat,
      exp: decoded.exp,
    };

    return {
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    };
  } catch {
    return {
      user: null,
      accessToken,
      refreshToken,
      isAuthenticated: false,
    };
  }
}

// -------- Shorthand Session Helpers --------

/****
 * Retrieves the currently logged-in user payload from server cookies
 ****/
export async function getCurrentUser(): Promise<TAuthUser | null> {
  const session = await getServerSession();
  return session.user;
}

/****
 * Retrieves the role of the currently logged-in user
 ****/
export async function getUserRole(): Promise<Role | null> {
  const session = await getServerSession();
  return session.user?.role || null;
}

/****
 * Checks if the current request is from an authenticated user
 ****/
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return session.isAuthenticated;
}
