import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = [
  "/api/user",
  "/api/admin/login",
  "/api/admin/signUp",
  "/api/admin",
  "/api/tenant",
  "/api/signUpTenant",
  "/api/signInTenant",
  "/api/landlord",
  "/api/signUpLanding",
  "/api/signInLandlord",
  "/api/otp",
  "/api/auth/me"
];

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://okuper.onrender.app",
];

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value;

  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // Landlord auth pages
  const landlordAuthPages =
    pathname.startsWith("/signInLandlord") ||
    pathname.startsWith("/signUpLandlord");

  // Landlord dashboard
  const landlordDashboard =
    pathname.startsWith("/landlordDashboard");

  if (isAuthenticated && landlordAuthPages) {
    return NextResponse.redirect(
      new URL("/landlordDashboard", req.url)
    );
  }

  if (!isAuthenticated && landlordDashboard) {
    return NextResponse.redirect(
      new URL("/signInLandlord", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
