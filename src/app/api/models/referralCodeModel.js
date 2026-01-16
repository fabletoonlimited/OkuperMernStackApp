// import mongoose from "mongoose";
import {mongoose} from "@/app/lib/mongoose.js"

const referralCodeSchema = new mongoose.Schema(
  {
     action: {
      type: String,
      enum: ["generatereferralCode", "verifyreferralCode"],
      required: true
    },
    email: {
      type: String,
      required: true,
      index: true,
    },

    code: {
      type: String,
      required: true,
    },

    userType: {
      type: String,
      enum: ["tenant", "landlord", "admin"],
      required: true,
    },

    used: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

// ✅ TTL index — MUST be after schema creation
// otpSchema.index({ email: 1, userType: 1, used: 1 }, {partialFilterExpression: {used: false}});

export default mongoose.models.ReferralCode || mongoose.model("ReferralCode", referralCodeSchema);
