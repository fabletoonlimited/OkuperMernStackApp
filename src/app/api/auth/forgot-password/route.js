export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import Landlord from "../../models/landlordModel.js";
import Tenant from "../../models/tenantModel.js";
import crypto from "crypto";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user (landlord or tenant)
    const landlord = await Landlord.findOne({ email: normalizedEmail });
    const tenant = await Tenant.findOne({ email: normalizedEmail });

    const user = landlord || tenant;
    const userType = landlord ? "landlord" : tenant ? "tenant" : null;

    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        {
          success: true,
          message:
            "If an account with that email exists, a password reset link has been sent.",
        },
        { status: 200 },
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    console.log("🔑 Generating reset token for:", normalizedEmail, {
      tokenPreview: resetToken.substring(0, 10) + "...",
      expiry: resetTokenExpiry,
    });

    // Save token to user
    user.forgotPasswordToken = resetToken;
    user.forgotPasswordTokenExpiry = resetTokenExpiry;
    await user.save();

    console.log("✅ Token saved to database for:", normalizedEmail);

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/forgotPassword?token=${resetToken}&email=${encodeURIComponent(normalizedEmail)}`;

    // Send email with reset link
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: process.env.SEND_OTP_FROM || "noreply@okuper.com",
        to: normalizedEmail,
        subject: "Reset Your Okuper Password",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
            <h1 style="color: #003399;">Password Reset Request</h1>
            <p>Hi ${user.firstName},</p>
            <p>We received a request to reset your password for your Okuper account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #003399; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p style="margin-top: 30px;"><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            <br/>
            <p>Best regards,<br/>The Okuper Team</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;"/>
            <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply.</p>
          </div>
        `,
      });

      if (error) {
        console.error("Failed to send password reset email:", error);
        return NextResponse.json(
          { message: "Failed to send reset email. Please try again." },
          { status: 500 },
        );
      }

      console.log(
        "✅ Password reset email sent successfully to:",
        normalizedEmail,
      );
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return NextResponse.json(
        { message: "Failed to send reset email. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Password reset email sent successfully. Please check your inbox.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
