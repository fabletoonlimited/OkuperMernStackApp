export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { generateOtp, verifyOtp } from "@/app/lib/otpService";

export async function POST(req) {
  console.log("➡️ POST /api/otp hit");

  try {
    await dbConnect();

    const body = await req.json();
    const { action, email, code, purpose, userType } = body;

    if (!action || !email || !purpose || !userType) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 👉 Generate OTP
    if (action === "generate") {
      const result = await generateOtp({
        email,
        purpose,
        userType,
      });

      return NextResponse.json(result, { status: 201 });
    }

    // 👉 Verify OTP
    if (action === "verify") {
      if (!code) {
        return NextResponse.json(
          { message: "OTP code is required" },
          { status: 400 }
        );
      }
      const result = await verifyOtp({
        email,
        code,
        purpose,
        userType,
      });

      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(
      { message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("OTP route error:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
