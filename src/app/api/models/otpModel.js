// import mongoose from "mongoose";
import {mongoose} from "@/app/lib/mongoose.js"

const otpSchema = new mongoose.Schema(
  {
    action: {type: String, enum:["generate", "verify", "passwordReset"], required: true},
    email: {type: String, required: true, index: true, lowercase: true, trim: true},
    code: {type: String, required: true},
    
    userType: {
      type: String,
      enum: ["tenant", "landlord", "admin"],
      required: true,
    },
    
    used: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  }, { timestamps: true }
);


// ✅ TTL index — MUST be after schema creation
otpSchema.index(
  { email: 1, userType: 1, used: 1 }, 
  {
    name: "otp_active_email_userType",
    partialFilterExpression: { used: false },
  }
);
otpSchema.index({ expiresAt: 1 }, { expiresAfterSeconds: 0 });

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);
