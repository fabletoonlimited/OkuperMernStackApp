import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = [
  "/signInAdmin",
  "/signInSupport",
  "/admin/users",
  "/tenant/messages",
  "/landlord/properties",
  "/landlord/messages",
  "/signInSuperAdmin",
  "/signInTenant",
  "/signUpLanding",
  "/signInLandlord",
  "/landlordDashboardInbox",
  "/lib",
  "/manage",
  "/messages",
  "/policy",
  "/privacy",
  "/profile",
  "/propertyCardExpanded",
  "/propertyListingLanding",
  "/propertyListingUploadForm",
  "/rent",
  "/report",
  "/save",
  "/savedHomes",
  "/sell",
  "/settings",
  "/shortlets",
  "/signUpLandlord",
  "/signUpSuperAdmin",
  "/signUpTenant",
  "tenantDashboard",
  "/tennatDashboardCompleted",
  "/tenantDashboardInbox",
  "/tenantDisputeForm",
  "/terms",
  "/verification",
  "/xStories"
];

const PUBLIC_API_ROUTES = [
  "/api/admin",
  "/api/loginAdmin",
  "/api/auth",
  "/api/auth/me",
  "/api/auth/logout",
  "/api/auth/reset-password",
  "/api/landlord",
  "/api/landlordKyc",
  "/api/loginLandlord",
  "/api/loginSuperAdmin",
  "/api/loginTenant",
  "/api/otp",
  "/api/rent",
  "/api/send-email",
  "/api/user",
  "/api/support",
  "/api/loginSupport",
  "/api/script",
  "/api/sell",
  "/api/superAdmin",
  "/api/tenant",
];

const PROTECTED_API_ROUTES = [
  "/api/landlordAddressVerification",
  "/api/landlordSubscription",
  "/api/message",
  "/api/profile",
  "/api/property",
  "/api/propertyRequestForm",
  "/api/tenantVerification",

]

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  let user = null;

  // 🔐 Verify token
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = payload;
    } catch {
      user = null;
    }
  }

  const isAuthenticated = !!user;

  // ======================
  // ✅ Allow public APIs
  // ======================
  if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // ======================
  // ✅ Allow public pages
  // ======================
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    // If logged in, prevent going back to auth pages
    if (isAuthenticated) {
      if (user.role === "landlord") {
        return NextResponse.redirect(new URL("/landlordDashboard", req.url));
      }
      if (user.role === "tenant") {
        return NextResponse.redirect(new URL("/tenantDashboard", req.url));
      }
      if (user.role === "admin") {
        return NextResponse.redirect(new URL("/dashboardAdmin", req.url));
      }
      if (user.role === "superAdmin") {
        return NextResponse.redirect(new URL("/dashboardSuperAdmin", req.url));
      }
    }

    return NextResponse.next();
  }

  // ======================
  // 🔒 Protect dashboards
  // ======================

  // Landlord
  if (pathname.startsWith("/landlordDashboard")) {
    if (!isAuthenticated || user.role !== "landlord") {
      return NextResponse.redirect(new URL("/signInLandlord", req.url));
    }
  }

  // Tenant
  if (pathname.startsWith("/tenantDashboard")) {
    if (!isAuthenticated || user.role !== "tenant") {
      return NextResponse.redirect(new URL("/signInTenant", req.url));
    }
  }

   // Super Admin
  if (pathname.startsWith("/dashboardAdmin")) {
    if (!isAuthenticated || user.role !== "admin") {
      return NextResponse.redirect(new URL("/signInAdmin", req.url));
    }
  }

  // Super Admin
  if (pathname.startsWith("/dashboardSuperAdmin")) {
    if (!isAuthenticated || user.role !== "superAdmin") {
      return NextResponse.redirect(new URL("/signInSuperAdmin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};