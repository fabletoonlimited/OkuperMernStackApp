import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

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

  const SIGNUP_ROUTES = [
    "/signUpLanding",
    "/signUpTenant",
    "/signUpLandlord",
    "/signUpAdmin",
    "/signUpSuperAdmin",
  ];

  const SIGNIN_REDIRECT = {
    tenant: "/signInTenant",
    landlord: "/signInLandlord",
    admin: "/signInAdmin",
    superAdmin: "/signInSuperAdmin",
  };

  // 🚫 Block signup pages ONLY for authenticated users
  if (SIGNUP_ROUTES.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      const redirectTo = SIGNIN_REDIRECT[user.role] || "/";
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    return NextResponse.next();
  }

  const PUBLIC_ROUTES = [
    "/signInAdmin",
    "/signInSupport",
    "/signInSuperAdmin",
    "/signInTenant",
    "/signInLandlord",
    "/lib",
    "/manage",
    "/policy",
    "/privacy",
    "/rent",
    "/report",
    "/sell",
    "/shortlets",
    "/terms",
    "/xStories"
  ];

  const PUBLIC_API_ROUTES = [
    "/api/admin",
    "/api/loginAdmin",
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

  const PROTECTED_ROUTES = [
    "/landlordAddressVerification",
    "/landlordSubscription",
    "/message",
    "/profile",
    "/property",
    "/propertyRequestForm",
    "/tenantVerification",
    "/tenantDashboard",
    "/tenantDashboardCompleted",
    "/tenantDashboardInbox",
    "/tenant/properties",
    "/tenant/messages",
    "/tenant/profile",
    "/landlord/profile",
    "/propertyListingLanding",
    "/propertyListingUploadForm",
    "/landlordDashboardInbox",
    "/landlord/properties",
    "/landlord/messages",
    "/savedHomes",
    "/admin/users",
    "/propertyCardExpanded",
    "/auth",
    "/auth/me",
    "/auth/logout",
    "/settings",
    "/tenantDisputeForm",
    "/verification",
  ];

  const PROTECTED_API_ROUTES = [
    "/api/landlordAddressVerification",
    "/api/landlordSubscription",
    "/api/message",
    "/api/profile",
    "/api/property",
    "/api/propertyRequestForm",
    "/api/tenantVerification",
    "/api/tenantDashboard",
    "/api/tenantDashboardCompleted",
    "/api/tenantDashboardInbox",
    "/api/tenant/properties",
    "/api/tenant/messages",
    "/api/tenant/profile",
    "/api/landlord/profile",
    "/api/propertyListingLanding",
    "/api/propertyListingUploadForm",
    "/api/landlordDashboardInbox",
    "/api/landlord/properties",
    "/api/landlord/messages",
    "/api/savedHomes",
    "/api/admin/users",
    "/api/propertyCardExpanded",
    "/api/auth",
    "/api/auth/me",
    "/api/auth/logout",
    "/api/settings",
    "/api/tenantDisputeForm",
    "/api/verification",
  ];

  // ======================
  // 🔒 Protect API routes first
  // ======================
  if (PROTECTED_API_ROUTES.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // ======================
  // 🔒 Protect page routes
  // ======================
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/signInLanding", req.url));
    }
  }

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

  if (pathname.startsWith("/landlordDashboard")) {
    if (!isAuthenticated || user.role !== "landlord") {
      return NextResponse.redirect(new URL("/signInLandlord", req.url));
    }
  }

  if (pathname.startsWith("/tenantDashboard")) {
    if (!isAuthenticated || user.role !== "tenant") {
      return NextResponse.redirect(new URL("/signInTenant", req.url));
    }
  }

  if (pathname.startsWith("/dashboardAdmin")) {
    if (!isAuthenticated || user.role !== "admin") {
      return NextResponse.redirect(new URL("/signInAdmin", req.url));
    }
  }

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