import crypto from "crypto";
import Otp from "../../app/api/models/otpModel";

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
  // const hashedCode = crypto
  // .createHash("sha256")
  // .update(code)
  // .digest("hex")

  const otp = {
    action: "generateOtp",
    email,
    purpose,
    userType,
    user: userId,
    code,
    // code: hashedCode,
    used: false,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  };

  // if (userId) {
  //   otpData.user = userId
  // }

  // const otp = new Otp(otpData);
  // await otp.save();
 
  // return {otp, code};
  
 return {otp, code};
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
    throw new Error ("Invalid or Expired OTP");
  };

  otp.used = true;
  await otp.save();

  return otp;
}
