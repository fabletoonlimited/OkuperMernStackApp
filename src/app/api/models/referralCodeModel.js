// import mongoose from "mongoose";
import {mongoose} from "@/app/lib/mongoose.js"

const referralCodeSchema = new mongoose.Schema(
  {
     action: {
      type: String,
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

    purpose: {
      type: String,
      required: true,
    },

    userType: {
      type: String,
      enum: ["Tenant", "Landlord"],
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userType",
      required: false,
    },

    used: {
      type: Boolean,
      default: false,
    },

    // tenant: { type: mongoose.Schema.Types.ObjectId, ref: "tenant", required: false},
    // landlord: { type: mongoose.Schema.Types.ObjectId, ref: "landlord", required: false},
  },
  { timestamps: true }
);


export default mongoose.models.ReferralCode || mongoose.model("ReferralCode", referralCodeSchema);
