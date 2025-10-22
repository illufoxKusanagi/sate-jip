import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

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
  "/admins",
];

// Routes that only admins can access
const adminOnlyRoutes = ["/server-management", "/server-data"];

// Public routes (accessible without authentication)
const publicRoutes = ["/login", "/dashboard", "/activity-calendar", "/"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ALWAYS log this first to confirm middleware is running
  console.log("========================================");
  console.log("[MIDDLEWARE RUNNING]", pathname);
  console.log("========================================");

  console.log("[Middleware] Processing:", pathname);

  // Show all cookies for debugging
  console.log("[Middleware] All cookies:", request.cookies.getAll()); // Skip middleware for API routes, static files, and public routes
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    publicRoutes.some((route) => pathname === route)
  ) {
    console.log("[Middleware] Allowing public/API route");
    return NextResponse.next();
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    console.log("[Middleware] Not a protected route");
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value;

  console.log("[Middleware] Protected route, token exists:", !!token);

  if (!token) {
    // No authentication - redirect to login
    console.log("[Middleware] No token, redirecting to login");
    const loginUrl = new URL("/login", request.url);
    // loginUrl.searchParams.set("redirect", pathname);
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

    console.log("[Middleware] Token valid, user role:", decoded.role);

    // Check if route is admin-only
    const isAdminRoute = adminOnlyRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isAdminRoute && decoded.role !== "admin") {
      // Non-admin trying to access admin route
      console.log("[Middleware] Non-admin accessing admin route, blocking");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    console.log("[Middleware] Access granted");
    return NextResponse.next();
  } catch (error) {
    // Invalid token - redirect to login
    console.error("[Middleware] Token verification failed:", error);
    const loginUrl = new URL("/login", request.url);
    // loginUrl.searchParams.set("redirect", pathname);

    // Clear invalid cookie
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("auth-token"); // Fixed: was "admin-token"
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
