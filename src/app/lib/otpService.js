import crypto from "crypto";
import Otp from "../../app/api/models/otpModel.js";

// Generate OTP
export async function generateOtp({
  action,
  email,
  purpose,
  userType,
  userId = null,
}) {
  // Invalidate previous unused OTPs for same context
  const invalidateQuery = { action, email, userType, used: false };
  if (userId) invalidateQuery.user = userId;

  await Otp.updateMany(invalidateQuery, { used: true });
  const otpCode = crypto.randomInt(100000, 1000000).toString();

  console.log("🔑 Generated OTP code:", otpCode, "for email:", email);

  const hashedCode = crypto.createHash("sha256").update(otpCode).digest("hex");

  const otp = await Otp.create({
    action,
    email,
    code: hashedCode,
    userType,
    user: userId,
    used: false,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  });

  return {
    message: "OTP generated successfully",
    otpId: otp._id,
    otpCode,
  };
}

// Verify OTP
export async function verifyOtp({
  action,
  email,
  code,
  purpose,
  userType,
  userId = null,
}) {
  console.log("🔍 Verifying OTP for:", {
    action,
    email,
    userType,
    codeLength: code?.length,
  });

  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

  const query = {
    action: "generate", // Always look for generated OTPs when verifying
    email,
    code: hashedCode,
    userType,
    used: false,
    expiresAt: { $gt: new Date() },
  };

  if (userId) query.user = userId;

  console.log("🔍 Looking for OTP with query:", { ...query, code: "***" });
  
  // Debug: see all OTPs for this email
  const allOtps = await Otp.find({ email, userType }).select('action used expiresAt createdAt');
  console.log("📊 All OTPs for this email:", allOtps);
  
  const otp = await Otp.findOne(query);
  console.log("🔍 Found OTP:", otp ? "Yes" : "No");

  if (!otp) {
    throw new Error("Invalid or Expired OTP");
  }

  otp.used = true;
  await otp.save();

  return { message: "OTP verified" };
}
