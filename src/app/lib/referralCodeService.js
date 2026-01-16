import crypto from "crypto";
import ReferralCode from "../api/models/referralCodeModel.js";
import { verifyOtp } from "./otpService.js";

export async function generateReferralCode(action, email, userType, userId=null) {
  // Invalidate previous unused OTPs for same context
  const invalidateQuery = { action, email, userType, used: false };
  if (userId) invalidateQuery.user = userId;

  await ReferralCode.updateMany(invalidateQuery, { used: true });

  const code = crypto.randomInt(100000, 1000000).toString();

  const referralCode = new ReferralCode.create({
    action,
    email,
    code,
    userType,
    user: userId,
    used: false,
  });

    await referralCode.save(); 

  return {
    message: "Referral Code generated successfully",
    referralCodeId: referralCode._id,
    referralCode
  };
}

//VErify Referral Code
export async function verifyReferralCode(action, email, code, userType, userId=null) {
  const verifyReferralCode = {action, email, userType, used: false};
  if (userId) verifyOtp.user = userId;

  const query = {
    action,
    email,
    code,
    used:false,
  }

  if (userId) query.user = userId;

  const referralCode = await ReferralCode.findOne(query);
 
  if (!referralCode) {
    throw new Error ("Invalid Referral Code")
  };

  referralCode.used = true;
  await referralCode.save()

  return {message: "Referral Code verified"}
}
