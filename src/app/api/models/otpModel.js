import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    code: { type: String, required: true }, // the otp code itself

    email: { type: String, required: true },

    purpose: {
      type: String,
      enum: ["verifyAccount", "resetPassword"],
      required: true,
    },

    userType: {
      type: String,
      enum: ["Tenant", "Landlord"],
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userType", // dynamically references Tenant or Landlord
      required: false, // Set to false so that OTP can be exist before the user is created
    },

    used: { type: Boolean, default: false }, // mark OTP as used after verification

    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Prevent multiple active OTPs per user/purpose/email
otpSchema.index(
  { email: 1, purpose: 1, used: 1 },
  { unique: true, partialFilterExpression: { used: false } }
);
// Auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema);
export default Otp;

// This is a one otp per purpose. It will work for both tenants and landlords. Easier to generate & verify.

/**
 * The Flow
 * User signs up - Creates inactive landlord/tenant
 * Generate OTP - Save it in the modal/database
 * Send OTP via Resend email
 * User submits OTP - Verify it using OTP model
 * Mark OTP as 'used: true' and activate user
 *
 * Purpose handles both verifyAccount Otp and resePassword otp
 * Used keeps track of used OTPs - Osita said it good for auditing and security
 *
 * The indexes prevent creating multiple active OTPs for the same user.
 * The expireAfterSeconds: 0 automatically deletes expired OTPs
 */
