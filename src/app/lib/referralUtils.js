import crypto from "crypto";
import User from "../api/models/userModel.js";

// Generate a unique referral code with collision handling

/**
 * Generate a unique referral code with collision handling
 * @param {number} maxRetries - Maximum number of retry attempts (default: 5)
 * @returns {Promise<string>} Unique 8-character referral code
 */
export async function generateUniqueReferralCode(maxRetries = 5) {
  let attempts = 0;

  while (attempts < maxRetries) {
    // Generate 6 random bytes and convert to hex, then uppercase and slice to 8 chars
    // Hex encoding gives alphanumeric [0-9a-f], ~4.3 billion combinations for 8 chars
    const code = crypto
      .randomBytes(6)
      .toString("hex")
      .toUpperCase()
      .slice(0, 8);

    // Check if code already exists in database
    const existingUser = await User.findOne({ referralCode: code });

    if (!existingUser) {
      return code; // Unique code found
    }

    attempts++;
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `Referral code collision detected (attempt ${attempts}/${maxRetries}): ${code}`,
      );
    }
  }

  // If all retries failed, throw error
  throw new Error(
    "Failed to generate unique referral code after maximum retries",
  );
}

/**
 * Validate and apply a referral code to a base User
 * - Optional: no-op if code is empty
 * - Prevents self-referral
 * - Applies only when referredBy is currently null
 */
export async function validateAndAssignReferral(userId, referralCode) {
  if (!referralCode) return null;

  const cleanedCode = referralCode.trim().toUpperCase();
  if (!cleanedCode) return null;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found for referral assignment");
  }

  // If already referred, do not re-assign
  if (user.referredBy) return null;

  const referrer = await User.findOne({ referralCode: cleanedCode });
  if (!referrer) {
    throw new Error("Invalid referral code");
  }

  // Prevent self-referral
  if (referrer._id.toString() === user._id.toString()) {
    throw new Error("You cannot use your own referral code");
  }

  user.referredBy = referrer._id;
  await user.save();

  await User.findByIdAndUpdate(referrer._id, { $inc: { referralCount: 1 } });

  return { referrerId: referrer._id };
}
