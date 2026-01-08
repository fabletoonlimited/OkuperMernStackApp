import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

/* ===============================
   CONFIG
================================ */
const PUBLIC_ROUTES = [
    "/api/admin/login",
    "/api/admin/signup",
    "/api/user",
    "/api/tenant/signup",
    "/api/tenant/login",
    "/api/landlord/signup",
    "/api/landlord/login",
    "/api/otp/requestOtp",
    "/api/otp/verifyOtp"
];

const ALLOWED_ORIGINS = [
  "http://localhost:5001",
  "https://okuper.onrender.app",
];

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

/* ===============================
   MIDDLEWARE
================================ */
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin");

  /* -------- LOGGING -------- */
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${pathname}`
  );

  /* -------- CORS -------- */
  const res = NextResponse.next();

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }

  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  /* -------- AUTH -------- */
  const isPublic = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isPublic) {
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      await jwtVerify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
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
