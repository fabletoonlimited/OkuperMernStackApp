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

  const DASHBOARD_REDIRECT = {
    tenant: "/tenantDashboard",
    landlord: "/landlordDashboard",
    admin: "/dashboardAdmin",
    superAdmin: "/dashboardSuperAdmin",
  };

  // 🚫 Block signup pages ONLY for authenticated users
  if (SIGNUP_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    if (isAuthenticated) {
      const redirectTo = DASHBOARD_REDIRECT[user.role] || "/";
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    return NextResponse.next();
  }

  const PUBLIC_ROUTES = [
    "/signInAdmin",
    "/signInAgent",
    "/signInLandlord",
    "/signInSuperAdmin",
    "/signInSupport",
    "/signInTenant",
    "/lib",
    "/manage",
    "/policy",
    "/privacy",
    "/rent",
    "/report",
    "/sell",
    "/shortlets",
    "/terms",
    "/xStories",
    "/property",
    "/propertyCardExpanded",
    "/favorites",
    // "/auth/logout",
  ];

  const PUBLIC_API_ROUTES = [
    "/api/script",
    "/api/send-email",

    "/api/user",

    "/api/landlord",
    "/api/loginLandlord",

    "/api/tenant",
    "/api/loginTenant",

    // "/api/admin",
    "/api/loginAdmin",

    // "/api/agent",
    "/api/loginAgent",

    // "/api/support",
    "/api/loginSupport",

    // "/api/superAdmin",
    "/api/loginSuperAdmin",

    "/api/otp",
    
    "/api/auth/reset-password",
    "/api/landlordKyc",
    
    "/api/rent",

    "/api/sell",
    "/api/shortlets",
    "/api/report",
    "/api/policy",
    "/api/propertyCardExpanded",
    "/api/propertyInterest",
    "/api/terms",
    "/api/privacy",
    "/api/xStories",
    "/api/property",

    "/api/auth/logout",
    "/api/auth/reset-password",
  ];

  const PROTECTED_ROUTES = [
    "/landlordDashboard",
    "/landlordDashboardCompleted",
    "/landlordDashboardInbox",
    "/landlord/properties",
    "/landlord/messages",
    "/landlordAddressVerification",
    "/landlordSubscription",
    "/landlord/profile",
    "/landlord/disputes",
    "/landlord/subscription",
    "/landlord/payment",
    "/tenantDashboard",
    "/tenantDashboardCompleted",
    "/tenantDashboardInbox",
    "/tenant/properties",
    "/tenant/messages",
    "/tenantAddressVerification",
    "/tenant/profile",
    "/tenant/disputes",
    "/tenant/payment",
    "/utilityBillUploadPage",
    "/propertyRequestForm",
    "/propertyListingLanding",
    "/propertyListingUploadForm",
    "/savedHomes",
    "/admin/users",
    "/auth/me",
    "/settings",
    "/tenantDisputeForm",
    "/verification",
  ];

  const PROTECTED_API_ROUTES = [
    // "/api/profile",
    "/api/landlordAddressVerification",
    "/api/landlordSubscription",
    "/api/message",
    "/api/propertyRequestForm",
    "/api/tenantVerification",
    "/api/landlord/profile",
    "/api/propertyListingLanding",
    "/api/propertyListingUploadForm",
    "/api/savedHomes",
    "/api/admin/users",
    "/api/propertyCardExpanded",
    "/api/auth/me",
    "/api/settings",
    "/api/tenantDisputeForm",
    "/api/verification",
    "/api/disputes",
    "/api/verification",
    "/api/payment/Xpress",
    "/api/uploads/utilityBill",
    "/api/subscription",
    "/api/referral",
    "/api/analytics",
    "/api/notifications",
    "/api/propertyListingLanding",
    "/api/propertyListingUploadForm",
    "/api/favorites"

    // "/api/tenantDashboard",
    // "/api/tenantDashboardCompleted",
    // "/api/tenantDashboardInbox",
    // "/api/tenant/properties",
    // "/api/tenant/messages",
    // "/api/tenant/profile",
    // "/api/landlordDashboard",
    // "/api/landlordDashboardCompleted",
    // "/api/landlordDashboardInbox",
    // "/api/landlord/properties",
    // "/api/landlord/messages",
  ];

  // ======================
  // ✅ Allow public APIs
  // ======================
if (
  PUBLIC_API_ROUTES.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  )
) {
  return NextResponse.next();
}

  // ======================
  // 🔒 Protect API routes first
  // ======================
if (
  PROTECTED_API_ROUTES.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  )
) {
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}

  // ======================
  // ✅ Allow public pages
  // ======================
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
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
      if (user.role === "agent") {
        return NextResponse.redirect(new URL("/agentDashboard", req.url));
      }
      if (user.role === "support") {
        return NextResponse.redirect(new URL("/supportDashboard", req.url));
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

    if (pathname.startsWith("/agentDashboard")) { 
    if (!isAuthenticated || user.role !== "agent") {
      return NextResponse.redirect(new URL("/signInAgent", req.url));
    }
  }

    if (pathname.startsWith("/supportDashboard")) {
    if (!isAuthenticated || user.role !== "support") {
      return NextResponse.redirect(new URL("/signInSupport", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};