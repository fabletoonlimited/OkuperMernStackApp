// otpController.js
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateOtp, verifyOtp } from "../lib/otpService.js";
import Tenant from "../models/tenantModel.js";
import Landlord from "../models/landlordModel.js";

//1====================CreateOTP=========================//
// generateOtp handles old OTP invalidation, new OTP creation, and expiration
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null; //Resend saftey fallback to prevent silent crashes

export const requestOtp = async (body) => {
  try {
    let { email, userId, userType } = body;

    if (!email || !userType) {
      return NextResponse.json(
        {
          message: "Email and userType required",
        },
        { status: 400 }
      );
    }

    // If userId is missing (e.g. resend OTP), try to find it
    if (!userId) {
      if (userType === "Landlord") {
        const user = await Landlord.findOne({ email });
        if (user) userId = user._id;
      } else if (userType === "Tenant") {
        const user = await Tenant.findOne({ email });
        if (user) userId = user._id;
      }
    }

    const otp = await generateOtp(email, "verifyAccount", userType, userId);

    // Safety check for Resend
    if (resend) {
      await resend.emails.send({
        from: process.env.SEND_OTP_FROM || "onboarding@resend.dev",
        to: email,
        subject: "Verify your account",
        html: `Your OTP code is <strong>${otp.code}</strong>. It expires in 5 minutes.`,
      });
    } else {
      // Fallback for local development
      console.warn(
        "RESEND_API_KEY is missing. OTP for",
        email,
        "is:",
        otp.code
      );
    }

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP request error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};

//2====================VerifyOTP=========================//
export const verifyOtpCode = async (body) => {
  try {
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and OTP code required" },
        { status: 400 }
      );
    }

    const otp = await verifyOtp(email, code, "verifyAccount");

    if (!otp) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    if (otp.userType === "Landlord") {
      await Landlord.findByIdAndUpdate(otp.user, { isVerified: true });
    } else if (otp.userType === "Tenant") {
      await Tenant.findByIdAndUpdate(otp.user, { isVerified: true });
    }

    return NextResponse.json(
      { message: "OTP verified successfully", userType: otp.userType },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
