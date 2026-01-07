import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Number, default: 0 },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: false,
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Landlord",
      required: false,
    },
    
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: false},
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: false},
  },
  { timestamps: true }
);

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
