import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { DEFAULT_REDIRECT, type Role } from "@/lib/roles";

const routePermissions: Record<string, Role[]> = {
  // Users
  "/admin": ["ADMIN", "MANAGER"],
  "/admin/users/roles": ["ADMIN", "MANAGER"],
  "/admin/users/customers": ["ADMIN", "MANAGER", "FRONT_DESK"],
  "/admin/users/employees": ["ADMIN", "MANAGER"],
  "/admin/users": ["ADMIN", "MANAGER"],

  // Audit & Reviews
  "/admin/reviews/audit-logs": ["ADMIN"],
  "/admin/reviews": ["ADMIN", "MANAGER", "MARKETING"],

  // Discounts
  "/admin/discounts": ["ADMIN", "MANAGER"],

  // Seasonal Rates
  "/admin/seasonal-rates/add": ["ADMIN", "MANAGER"],
  "/admin/seasonal-rates": ["ADMIN", "MANAGER"],

  // Blog
  "/admin/blog/add": ["ADMIN", "MANAGER", "MARKETING"],
  "/admin/blog": ["ADMIN", "MANAGER", "MARKETING"],

  // Statistical
  "/admin/statiscal": ["ADMIN", "MANAGER"],

  // Rooms
  "/admin/rooms/maintenance": ["ADMIN", "MANAGER", "MAINTENANCE"],
  "/admin/rooms": ["ADMIN", "MANAGER", "FRONT_DESK", "MAINTENANCE"],

  // Bookings
  "/admin/bookings/add-booking": ["ADMIN", "MANAGER", "FRONT_DESK"],
  "/admin/bookings/listbooking": ["ADMIN", "MANAGER", "FRONT_DESK"],
  "/admin/bookings": ["ADMIN", "MANAGER", "FRONT_DESK"],
};

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // 1. Handle auth pages (signIn, signUp)
  if (pathname === "/signIn" || pathname === "/signUp") {
    if (token) {
      try {
        const decoded = jwtDecode<{ role?: Role; userType?: string; exp?: number }>(token);

        // Nếu token đã hết hạn -> Xóa cookie token và cho phép vào trang signIn / signUp bình thường
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          const res = NextResponse.next();
          res.cookies.delete("token");
          return res;
        }

        // Redirect based on role or userType
        if (
          decoded.role ||
          decoded.userType === "ADMIN" ||
          decoded.userType === "EMPLOYEE"
        ) {
          return NextResponse.redirect(new URL("/admin", req.url));
        }
        return NextResponse.redirect(new URL("/", req.url));
      } catch {
        // Invalid token, delete cookie and let them access signIn/signUp
        const res = NextResponse.next();
        res.cookies.delete("token");
        return res;
      }
    }
    return NextResponse.next();
  }

  // 2. Handle admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/unauthorized") return NextResponse.next();
  if (pathname === "/admin/profile") return NextResponse.next();

  // Chưa có token → về login
  if (!token) {
    return NextResponse.redirect(new URL("/signIn", req.url));
  }

  try {
    const decoded = jwtDecode<{ role: Role }>(token);
    const userRole = decoded.role;

    // Role không hợp lệ → về login
    if (!userRole || !(userRole in DEFAULT_REDIRECT)) {
      return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
    }

    const homePage = DEFAULT_REDIRECT[userRole];

    const matchedRoute = Object.keys(routePermissions)
      .filter((route) => pathname.startsWith(route))
      .sort((a, b) => b.length - a.length)[0];

    if (matchedRoute) {
      const allowedRoles = routePermissions[matchedRoute];
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL(homePage, req.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/signIn", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/signIn", "/signUp"],
};
