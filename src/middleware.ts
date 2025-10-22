import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { geolocation } from "@vercel/functions";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

// Routes that require authentication
const protectedRoutes = [
  "/admins",
  "/locations",
  "/data-config",
  "/server-management",
  "/server-data",
  "/data-central-dashboard",
];

// Routes that only admins can access
const adminOnlyRoutes = ["/server-management", "/server-data", "/data-config"];

// Public routes (accessible without authentication)
const publicRoutes = ["/login", "/dashboard", "/activity-calendar", "/"];

// Routes that should bypass geolocation check
const geolocationBypassRoutes = ["/access-denied", "/unauthorized"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip geolocation check for bypass routes, API, and static files
  if (
    !geolocationBypassRoutes.some((route) => pathname.startsWith(route)) &&
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/_next/")
  ) {
    // Check geolocation - only allow access from Indonesia
    const location = geolocation(request);
    if (location.country && location.country !== "ID") {
      const accessDeniedUrl = new URL("/access-denied", request.url);
      return NextResponse.redirect(accessDeniedUrl);
    }
  }

  // Allow public routes, API routes, and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    publicRoutes.some((route) => pathname === route) ||
    geolocationBypassRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token and check role
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const decoded = payload as {
      userId: string;
      username: string;
      role: string;
    };

    // Check if route is admin-only
    const isAdminRoute = adminOnlyRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isAdminRoute && decoded.role !== "admin") {
      // Redirect to unauthorized page with information about the attempted access
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
