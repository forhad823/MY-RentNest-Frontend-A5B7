// -------- Next.js 16 Proxy Route Guard --------
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtUtils } from "./utils/jwt";
import { getNewAccessToken } from "./service/refreshToken";

const AUTH_ROUTES = ["/login", "/register"];
const TENANT_ROUTES = ["/dashboard/tenant"];
const LANDLORD_ROUTES = ["/dashboard/landlord"];
const ADMIN_ROUTES = ["/dashboard/admin"];

/****
 * Next.js 16 Proxy function providing:
 * 1. Automatic token refresh when accessToken expires but refreshToken is valid
 * 2. Redirection away from login/register for authenticated users
 * 3. Route guarding for protected paths (/dashboard, /payment)
 * 4. Strict role-based access control (TENANT, LANDLORD, ADMIN)
 ****/
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccess = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  const decodedRefresh = refreshToken
    ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string)
    : null;

  // Auto-refresh token if access token is expired but refresh token is valid
  if (!decodedAccess?.success && decodedRefresh?.success) {
    const refreshRes = await getNewAccessToken();
    if (refreshRes?.success && refreshRes.data?.accessToken) {
      accessToken = refreshRes.data.accessToken;
      decodedAccess = jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      );
    }
  }

  const userRole = decodedAccess?.success
    ? (decodedAccess.data as any).role
    : null;

  // Authenticated user accessing auth routes
  if (accessToken && userRole && AUTH_ROUTES.includes(pathname)) {
    if (userRole === "TENANT") return NextResponse.redirect(new URL("/dashboard/tenant", request.url));
    if (userRole === "LANDLORD") return NextResponse.redirect(new URL("/dashboard/landlord", request.url));
    if (userRole === "ADMIN") return NextResponse.redirect(new URL("/dashboard/admin", request.url));
  }

  // Guard protected routes
  if (!accessToken && (pathname.startsWith("/dashboard") || pathname.startsWith("/payment"))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role authorization guards
  if (pathname.startsWith("/dashboard/tenant") && userRole !== "TENANT") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
  if (pathname.startsWith("/dashboard/landlord") && userRole !== "LANDLORD") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
  if (pathname.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)"],
};
