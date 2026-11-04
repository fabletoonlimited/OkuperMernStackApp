
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  let user = null;

  // Verify the authentication token
  if (token && process.env.JWT_SECRET) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = payload;
    } catch {
      user = null;
    }
  }

  const isAuthenticated = !!user;
  const role = user?.role;

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
    "/buy",
    "/shortlets",
    "/terms",
    "/xStories",
  ];

  const ALWAYS_PUBLIC_ROUTES = [
    "/property",
    "/propertyCardExpanded",
    "/report",
    "/favorites",
  ];

  const PUBLIC_API_ROUTES = [
    "/api/script",
    "/api/send-email",
    "/api/user",
    "/api/landlord",
    "/api/loginLandlord",
    "/api/tenant",
    "/api/loginTenant",
    "/api/loginAdmin",
    "/api/loginAgent",
    "/api/loginSupport",
    "/api/loginSuperAdmin",
    "/api/otp",
    "/api/auth/reset-password",
    "/api/landlordKyc",
    "/api/rent",
    "/api/buy",
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
  ];

  const PROTECTED_API_ROUTES = [
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
    "/api/auth/me",
    "/api/settings",
    "/api/tenantDisputeForm",
    "/api/verification",
    "/api/disputes",
    "/api/payment/xPress",
    "/api/uploads/utilityBill",
    "/api/subscription",
    "/api/referral",
    "/api/analytics",
    "/api/notifications",
    "/api/landlordAccountForm",
    "/api/favorites",
  ];

  // Prevent authenticated users from returning to signup pages.
  if (
    SIGNUP_ROUTES.some(
      (route) =>
        pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    if (isAuthenticated) {
      const redirectTo = DASHBOARD_REDIRECT[role] || "/";
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    return NextResponse.next();
  }

  // Public pages that must remain accessible to everyone.
  if (
    ALWAYS_PUBLIC_ROUTES.some(
      (route) =>
        pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    return NextResponse.next();
  }

  // Public API routes.
  if (
    PUBLIC_API_ROUTES.some(
      (route) =>
        pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    return NextResponse.next();
  }

  // Protected API routes.
  if (
    PROTECTED_API_ROUTES.some(
      (route) =>
        pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  // Public pages stay accessible even when the user is signed in.
  // In particular, do not redirect /rent, /buy, or /shortlets.
  if (
    PUBLIC_ROUTES.some(
      (route) =>
        pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    return NextResponse.next();
  }

  // Protect landlord dashboard pages.
  if (pathname.startsWith("/landlordDashboard")) {
    if (!isAuthenticated || role !== "landlord") {
      return NextResponse.redirect(
        new URL("/signInLandlord", req.url)
      );
    }
  }

  // Protect tenant dashboard pages.
  if (pathname.startsWith("/tenantDashboard")) {
    if (!isAuthenticated || role !== "tenant") {
      return NextResponse.redirect(
        new URL("/signInTenant", req.url)
      );
    }
  }

  // Protect admin dashboard pages.
  if (pathname.startsWith("/dashboardAdmin")) {
    if (!isAuthenticated || role !== "admin") {
      return NextResponse.redirect(
        new URL("/signInAdmin", req.url)
      );
    }
  }

  // Protect super-admin dashboard pages.
  if (pathname.startsWith("/dashboardSuperAdmin")) {
    if (!isAuthenticated || role !== "superAdmin") {
      return NextResponse.redirect(
        new URL("/signInSuperAdmin", req.url)
      );
    }
  }

  // Protect agent dashboard pages.
  if (pathname.startsWith("/agentDashboard")) {
    if (!isAuthenticated || role !== "agent") {
      return NextResponse.redirect(
        new URL("/signInAgent", req.url)
      );
    }
  }

  // Protect support dashboard pages.
  if (pathname.startsWith("/supportDashboard")) {
    if (!isAuthenticated || role !== "support") {
      return NextResponse.redirect(
        new URL("/signInSupport", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
