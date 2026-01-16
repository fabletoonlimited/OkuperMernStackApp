import crypto from "crypto";
import Otp from "../../app/api/models/otpModel.js";

// Generate OTP
export async function generateOtp({action, email, code, userType, userId = null}) {
  // Invalidate previous unused OTPs for same context
  const invalidateQuery = { action, email, userType, used: false };
  if (userId) invalidateQuery.user = userId;

  await Otp.updateMany(invalidateQuery, { used: true });
  const otpCode = crypto.randomInt(100000, 1000000).toString();

  const hashedCode = crypto
    .createHash("sha256")
    .update(otpCode)
    .digest("hex");

  const otp = await Otp.create({ 
    action,
    email,
    otpCode: hashedCode,
    userType,
    user: userId,
    used: false,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  });
  
 return {
  message: "OTP generated successfully",
  otpId: otp._id, 
  otpCode
};
}

// Verify OTP
export async function verifyOtp({action, email, otpCode, userType, userId = null}) {
  const verifyOtp = { action, email, purpose, userType, used: false };
  if (userId) verifyOtp.user = userId;

  const hashedCode = crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");

  const query = {
    action,
    email,
    code: hashedCode,
    userType,
    used: false,
    expiresAt: { $gt: new Date() },
  };

  if (userId) query.user = userId;

  const otp = await Otp.findOne(query);
  
  if (!otp) {
    throw new Error ("Invalid or Expired OTP");
  };

  otp.used = true;
  await otp.save();

  return {message: "OTP verified"};
}
