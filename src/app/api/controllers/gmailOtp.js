import Otp from "../models/otpModel.js";
import nodemailer from "nodemailer"; 

// 1. Request OTP
export const requestOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    // Generate random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB (will auto-expire in 5 mins due to your schema)
    await Otp.create({ email, otp: otpCode });

    // Send OTP (via email for example)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otpCode}. It expires in 5 minutes.`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP request error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// 2. Verify OTP
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