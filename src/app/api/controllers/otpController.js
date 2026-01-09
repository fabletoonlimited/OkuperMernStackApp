// otpController.js
import { NextResponse } from "next/server";
import Otp from "../models/otpModel.js";
import { Resend } from "resend";

//1====================CreateOTP=========================//
const resend = new Resend(process.env.RESEND_API_KEY);

export const requestOtp = async (req) => {
  const { email, userId, userType } = await req.json();

  if (!email || !userId || !userType) {
    return NextResponse.json({
      message: "Email, userId and userType required",
    });
  }

  try {
    // Generate random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB (auto-expire in 5 mins via your schema)
    await Otp.create({
      code: otpCode,
      purpose: "verifyAccount",
      userType,
      user: userId,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      used: false,
    });

    // Send OTP via Resend
    await resend.emails.send({
      from: process.env.SEND_OTP_FROM,
      to: email,
      subject: "Your OTP Code",
      html: `Your OTP code is <strong>${otpCode}</strong>. It expires in 5 minutes.`,
    });

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );

    // if (error) {
    //   console.error("Resend send email error:", error);
    //   return res.status(500).json({ message: "Failed to send OTP email" });
    // }

    // res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP request error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};

//2====================VerifyOTP=========================//
export const verifyOtp = async (req) => {
  const { userId, userType, code } = await req.json();

  if (!userId || !userType || !code) {
    return NextResponse.json(
      { message: "UserId, userType, and OTP required" },
      { status: 400 }
    );
  }

  try {
    const otpRecord = await Otp.findOne({
      user: userId,
      userType,
      code,
      used: false,
      expiresAt: { $gt: new Date() },
    });
    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // // Success → delete OTP so it can’t be reused
    // await Otp.deleteOne({ _id: otpRecord._id });

    // Mark as used
    otpRecord.used = true;
    await otpRecord.save();

    return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 })

    // // Attach verified email to request for next controller
    // req.verifiedEmail = email;

    // // Continue to createLandlord
    // next();
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
