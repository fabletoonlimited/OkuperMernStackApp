export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import Landlord from "../../models/landlordModel.js";
import Tenant from "../../models/tenantModel.js";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, token, newPassword } = body;

    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { message: "Email, token, and new password are required" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    console.log("🔍 Reset password attempt:", {
      email: normalizedEmail,
      tokenReceived: token?.substring(0, 10) + "...",
    });

    // Find user (landlord or tenant)
    const landlord = await Landlord.findOne({ email: normalizedEmail });
    const tenant = await Tenant.findOne({ email: normalizedEmail });

    const user = landlord || tenant;

    if (!user) {
      console.log("❌ User not found for email:", normalizedEmail);
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    console.log("✅ User found:", {
      email: user.email,
      hasToken: !!user.forgotPasswordToken,
      tokenInDB: user.forgotPasswordToken?.substring(0, 10) + "...",
      tokenExpiry: user.forgotPasswordTokenExpiry,
      isExpired: user.forgotPasswordTokenExpiry
        ? new Date() > user.forgotPasswordTokenExpiry
        : "no expiry set",
    });

    // Check if token matches and hasn't expired
    if (
      !user.forgotPasswordToken ||
      user.forgotPasswordToken !== token ||
      !user.forgotPasswordTokenExpiry ||
      new Date() > user.forgotPasswordTokenExpiry
    ) {
      console.log("❌ Token validation failed:", {
        hasStoredToken: !!user.forgotPasswordToken,
        tokensMatch: user.forgotPasswordToken === token,
        hasExpiry: !!user.forgotPasswordTokenExpiry,
        isExpired: user.forgotPasswordTokenExpiry
          ? new Date() > user.forgotPasswordTokenExpiry
          : "no expiry",
      });
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    // Hash new password and update user
    // Note: The pre-save hook will hash the password automatically
    user.password = newPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
