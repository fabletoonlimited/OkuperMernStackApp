import crypto from "crypto";
import ReferralCode from "../models/referralCode.js";

export async function generateReferralCode(email, purpose,userType,userId) 
{
  await ReferralCode.updateMany(
    { email, purpose, used: false },
    { used: true }
  );

  const code = crypto.randomInt(100000, 1000000).toString();

  const referralCode = new ReferralCode({
    action: "generateReferralCode",
    code,
    email,
    purpose,
    userType,
    user: userId,
  });

  await referralCode.save();
  return referralCode;
}
