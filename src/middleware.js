import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = [
  "/api/user",
  "/api/admin/login",
  "/api/admin",
  "/api/tenant",
  "/api/loginTenant",
  "/api/landlord",
  "/api/loginLandlord",
  "/api/otp",
  "/signUpLanding",
  "/signUpTenant",
  "/signUpLandlord",
];

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://okuper.onrender.app",
];

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

/* ===============================
   MIDDLEWARE
================================ */

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Make sure origin is declared!
  const origin = req.headers.get("origin");

  const res = NextResponse.next();

  // CORS
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  } else {
    res.headers.set("Access-Control-Allow-Origin", "*");
  }

  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS",
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  if (req.method === "OPTIONS") {
    return res;
  }

  /* -------- AUTH -------- */
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (!isPublic) {
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      await jwtVerify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 },
      );
    }
  }

  return res;
}

/* ===============================
   APPLY TO API ROUTES ONLY
================================ */
export const config = {
  matcher: "/api/:path*",
};
