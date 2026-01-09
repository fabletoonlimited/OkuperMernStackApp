import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    code: { type: String, required: true }, // the otp code itself
    purpose: {
      type: String,
      enum: ["verifyAccount", "resetPassword"],
      required: true,
    },
    expiresAt: { type: Date, required: true }, 
    
    userType: {
      type: String,
      enum: ["tenant", "landlord"],
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'userType', // dynamically references Tenant or Landlord
    },

    used: {type: Boolean, default: false}, // mark OTP as used after verification
  },
  { timestamps: true }
);

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
 * Purpose handles both verifyOtp and resetOtp
 * Used keeps track of used OTPs
 */