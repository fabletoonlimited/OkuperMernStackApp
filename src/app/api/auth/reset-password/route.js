export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import Landlord from "../../models/landlordModel.js";
import Tenant from "../../models/tenantModel.js";
import crypto from "crypto";
import { Resend } from "resend";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, token, newPassword } = body;

    // Email is required for both steps
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user (landlord or tenant)
    const landlord = await Landlord.findOne({
      email: normalizedEmail,
    });

    const tenant = await Tenant.findOne({
      email: normalizedEmail,
    });

    const user = landlord || tenant;

    // =====================================================
    // STEP 1: User requested a password reset
    // Request contains ONLY email
    // =====================================================

    if (!token && !newPassword) {
      if (!user) {
        return NextResponse.json(
          { message: "No account found with this email address" },
          { status: 404 }
        );
      }

      const resend = new Resend(process.env.RESEND_API_KEY);

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");

      // Token expires in 1 hour
      const resetTokenExpiry = new Date(
        Date.now() + 60 * 60 * 1000
      );

      // Save token to the user
      user.forgotPasswordToken = resetToken;
      user.forgotPasswordTokenExpiry = resetTokenExpiry;

      await user.save();

      // Create reset URL
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      const resetUrl =
        `${baseUrl}/forgotPassword` +
        `?token=${encodeURIComponent(resetToken)}` +
        `&email=${encodeURIComponent(normalizedEmail)}`;

      console.log("Password reset URL:", resetUrl);

  const { data: emailData, error: emailError } =
  await resend.emails.send({
    from: process.env.SEND_OTP_FROM || "noreply@okuper.com",
    to: normalizedEmail,
    subject: "Reset Your Password",
    html: `
      <h2>Your Okuper Password Reset</h2>
      <p>You requested to reset your password.</p>
      <p>Click the button below to reset your password:</p>

      <a
        href="${resetUrl}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#003399;
          color:white;
          text-decoration:none;
          border-radius:5px;
        "
      >
        Reset Password
      </a>

      <p>This link will expire in 1 hour.</p>

      <p>If you did not request this, you can ignore this email.</p>

      <div className= "row mt-5">
        <p>Warm Regards</p>
        <p>Okuper Team</p>
      </div>
    `,
  });

if (emailError) {
  console.error("Resend error:", emailError);

  return NextResponse.json(
    {
      message: "Failed to send password reset email",
      error: emailError.message,
    },
    { status: 500 }
  );
}

console.log("Resend email sent:", emailData);

      return NextResponse.json(
        {
          success: true,
          message: "Password reset email sent successfully",
        },
        { status: 200 }
      );
    }

    // =====================================================
    // STEP 2: User is actually resetting the password
    // Request contains email + token + newPassword
    // =====================================================

    if (!token || !newPassword) {
      return NextResponse.json(
        {
          message: "Token and new password are required",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          message: "Password must be at least 8 characters",
        },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid or expired reset token",
        },
        { status: 400 }
      );
    }

    // Check if token matches and hasn't expired
    if (
      !user.forgotPasswordToken ||
      user.forgotPasswordToken !== token ||
      !user.forgotPasswordTokenExpiry ||
      new Date() > new Date(user.forgotPasswordTokenExpiry)
    ) {
      return NextResponse.json(
        {
          message: "Invalid or expired reset token",
        },
        { status: 400 }
      );
    }

    // Update password
    // Your model's pre-save hook will hash it automatically
    user.password = newPassword;

    // Remove reset token after successful reset
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully",
        userType: landlord ? "landlord" : "tenant",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        message: "Server error. Please try again.",
      },
      { status: 500 }
    );
  }
}