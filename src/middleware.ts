import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { geolocation } from "@vercel/functions";

const JWT_SECRET_STRING = process.env.JWT_SECRET;
if (!JWT_SECRET_STRING || JWT_SECRET_STRING.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long");
}

const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

const protectedRoutes = [
  "/admins",
  "/locations",
  "/data-config",
  "/server-management",
  "/server-data",
  "/data-central-dashboard",
  "/tickets/help-desk",
  "/tickets/help-desk/[id]",
];

const adminOnlyRoutes = [
  "/server-management",
  "/server-data",
  "/tickets/help-desk/[id]",
];

const publicRoutes = ["/login", "/dashboard", "/activity-calendar", "/"];
const geolocationBypassRoutes = ["/access-denied", "/unauthorized"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (
    !geolocationBypassRoutes.some((route) => pathname.startsWith(route)) &&
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/_next/")
  ) {
    const location = geolocation(request);
    if (location.country && location.country !== "ID") {
      const accessDeniedUrl = new URL("/access-denied", request.url);
      return NextResponse.redirect(accessDeniedUrl);
    }
  }

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    publicRoutes.some((route) => pathname === route) ||
    geolocationBypassRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const decoded = payload as {
      userId: string;
      username: string;
      role: string;
    };
    const isAdminRoute = adminOnlyRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isAdminRoute && decoded.role !== "admin") {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      unauthorizedUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(unauthorizedUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("[Middleware] Token verification failed:", error);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("auth-token");
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
