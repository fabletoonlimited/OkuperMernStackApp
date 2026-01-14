// import mongoose from "mongoose";
import {mongoose} from "@/app/lib/mongoose.js"

const otpSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true
    },

    code: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      required: true,
    },

    userType: {
      type: String,
      enum: ["tenant", "landlord", "admin"],
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },

    used: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    // tenant: { type: mongoose.Schema.Types.ObjectId, ref: "tenant", required: false},
    // landlord: { type: mongoose.Schema.Types.ObjectId, ref: "landlord", required: false},
  },
  { timestamps: true }
);


// ✅ TTL index — MUST be after schema creation
otpSchema.index({ email: 1, purpose: 1, userType: 1, used: 1 }, {partialFilterExpression: {used: false}});
otpSchema.index({ expiresAt: 1 }, { expiresAfterSeconds: 0 });

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);
