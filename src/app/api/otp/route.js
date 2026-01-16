export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose";
import { generateOtp, verifyOtp } from "@/app/lib/otpService";

export async function POST(req) {
  console.log("OTP HIT");

  try {
    await dbConnect();

    const body = await req.json();
    console.log("OTP BODY:", body);

    const { action, email, purpose, userType, code, userId } = body;

    if (!action) {
      return NextResponse.json(
        { message: "Action is required" },
        { status: 400 }
      );
    }

    // =====================
    // GENERATE OTP
    // =====================
    if (action === "generateOtp") {
      if (!email || !purpose || !userType) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: 400 }
        );
      }

      console.log("SENDING OTP EMAIL to:", email);

      const otp = await generateOtp(email, purpose, userType, userId || null);

      return NextResponse.json(
        { success: true, otpId: otp._id, message: "OTP sent to your email" },
        { status: 200 }
      );
    }

    // =====================
    // VERIFY OTP
    // =====================
    if (action === "verifyOtp") {
      if (!email || !code || !purpose || !userType) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: 400 }
        );
      }

      try {
        const otp = await verifyOtp(
          email,
          code,
          purpose,
          userType,
          userId || null
        );
        return NextResponse.json(
          { success: true, message: "OTP verified successfully" },
          { status: 200 }
        );
      } catch (verifyError) {
        return NextResponse.json(
          { message: verifyError.message || "Invalid or expired OTP" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("OTP route error:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
