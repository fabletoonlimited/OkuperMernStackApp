import crypto from "crypto";
import Otp from "../../app/api/models/otpModel";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// =====================
// Generate OTP
// =====================
export async function generateOtp(email, purpose, userType, userId = null) {
  // Invalidate previous unused OTPs for same context
  await Otp.updateMany(
    { email, purpose, userType, used: false },
    { used: true }
  );

  const code = crypto.randomInt(100000, 1000000).toString();

  const otpData = {
    action: "generateOtp",
    email,
    purpose,
    userType,
    user: userId,
    code,
    used: false,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  };

  const otp = new Otp(otpData);
  await otp.save();

  // Send OTP via email
  if (!resend) {
    throw new Error("Email service not configured");
  }

  try {
    await resend.emails.send({
      from: process.env.SEND_OTP_FROM || "noreply@okuper.com",
      to: email,
      subject: `Your Okuper OTP Code - ${purpose}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #003399;">Okuper Verification Code</h2>
          <p>Hello,</p>
          <p>Your one-time password (OTP) for <strong>${purpose}</strong> is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #003399; margin: 0; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          </div>
          <p>This code will expire in <strong>5 minutes</strong>.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <br/>
          <p>Best regards,<br/>The Okuper Team</p>
        </div>
      `,
    });

    console.log(`✅ OTP sent to ${email}`);
  } catch (emailError) {
    console.error("Failed to send OTP email:", emailError);
    throw new Error("Failed to send OTP email");
  }

  return otp;
}

// =====================
// Verify OTP
// =====================
export async function verifyOtp(email, code, purpose, userType, userId = null) {
  // const hashedCode = crypto
  // .createHash("sha256")
  // .update(code)
  // .digest("hex")

  const query = {
    email,
    code,
    // code: hashedCode,
    purpose,
    userType,
    used: false,
    expiresAt: { $gt: new Date() },
  };

  if (userId) query.user = userId;

  const otp = await Otp.findOne(query);

  if (!otp) {
    throw new Error("Invalid or Expired OTP");
  }

  otp.used = true;
  await otp.save();

  return otp;
}
