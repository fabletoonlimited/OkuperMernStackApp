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

    console.log("📨 Request body:", {
      action,
      email,
      userType,
      hasCode: !!code,
    });

    if (!action || !email || !userType) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: action, email, and userType are required",
        },
        { status: 400 }
      );
    }

    // 👉 Generate OTP
    if (action === "generate") {
      const result = await generateOtp({
        action,
        email,
        purpose: purpose || "verifyAccount",
        userType,
      });

      // Send OTP via email
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
          from: process.env.SEND_OTP_FROM || "noreply@okuper.com",
          to: email,
          subject: "Your Okuper Verification Code",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h1 style="color: #003399;">Okuper Verification Code</h1>
              <p>Your verification code is:</p>
              <h2 style="color: #003399; font-size: 32px; letter-spacing: 5px;">${result.otpCode}</h2>
              <p>This code will expire in 5 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
              <br/>
              <p>Best regards,<br/>The Okuper Team</p>
            </div>
          `,
        });

        if (error) {
          console.error("Failed to send OTP email:", error);
        } else {
          console.log("✅ OTP email sent successfully to:", email);
        }
      } catch (emailError) {
        console.error("Failed to send OTP email:", emailError);
        // Don't fail the request if email fails
      }

      return NextResponse.json(
        { message: result.message, otpId: result.otpId },
        { status: 201 }
      );
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
        action,
        email,
        code,
        purpose: purpose || "verifyAccount",
        userType,
      });

      return NextResponse.json(result, { status: 200 });
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
