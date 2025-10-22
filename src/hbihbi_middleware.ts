import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Define which routes require authentication
const protectedRoutes = [
  //   "/dashboard",
  "/admins",
  "/locations",
  "/dataConfig",
  "/activityCalendar",
  "/server-management",
  "/server-data",
  "/data-central-dashboard",
];

// Define which routes are admin-only
const adminOnlyRoutes = [
  "/admins",
  "/locations",
  "/server-management",
  "/server-data",
];

// Public routes that don't require authentication
const publicRoutes = ["/login", "/api/login", "/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get token from cookies or localStorage (via headers)
  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    // Redirect to login if no token
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { userId: string; username: string; role: string };

    // Check if admin-only route
    const isAdminRoute = adminOnlyRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isAdminRoute && decoded.role !== "admin") {
      // Redirect non-admins trying to access admin routes
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Add user info to request headers for use in components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", decoded.userId);
    requestHeaders.set("x-user-role", decoded.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Invalid token - redirect to login
    console.error("Token verification failed:", error);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
