export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { loginSuperAdmin } from "../controllers/superAdmin.controller.js";
import { NextResponse } from "next/server";

//Login Super Admin
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const { email, password } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Please input your email" },
        { status: 400 },
      );
    }

    if (!password) {
      return NextResponse.json(
        { message: "Please input password" },
        { status: 400 },
      );
    }

    // Normalize email (trim and lowercase to match signup)
    const normalizedBody = {
      email: email.trim().toLowerCase(),
      password: password,
    };

    const result = await loginSuperAdmin(normalizedBody);
    const response = NextResponse.json(result, {
      status: result.status || 200,
    });

    if (result?.token) {
      response.cookies.set("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000, // 1day
      });
    }

    return response;
  } catch (error) {
    console.error("❌ API ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
