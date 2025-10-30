// otpController.js
import Otp from "../models/otpModel.js";
import { Resend } from "resend";

//1====================CreateOTP=========================//
const resend = new Resend(process.env.RESEND_API_KEY);

export const requestOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  try {
    // Generate random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB (auto-expire in 5 mins via your schema)
    await Otp.create({ email, otp: otpCode });

    // Send OTP via Resend
    const { data, error } = await resend.emails.send({
      from: process.env.SEND_OTP_FROM, 
      to: email,
      subject: "Your OTP Code",
      html: `Your OTP code is <strong>${otpCode}</strong>. It expires in 5 minutes.`
    });

    if (error) {
      console.error("Resend send email error:", error);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP request error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//2====================VerifyOTP=========================//
export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP required" });
  }

  try {
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Success → delete OTP so it can’t be reused
    await Otp.deleteOne({ _id: otpRecord._id });

    // Attach verified email to request for next controller
    req.verifiedEmail = email;

    // Continue to createLandlord
    next();
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
