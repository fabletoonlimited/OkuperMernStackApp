// import mongoose from "mongoose";
import { mongoose } from "@/app/lib/mongoose.js";

const userSchema = new mongoose.Schema(
  {
    residencyStatus: {
      type: String,
      enum: [
        "Citizen",
        "Permanent Resident",
        "Work Permit",
        "Student Visa",
        "Visitors Visa",
      ],
      required: true,
    },
    whoIsUsingPlatform: {
      type: String,
      enum: ["myself", "someoneElse"],
      required: true,
    },
    role: {
      type: String,
      enum: ["tenant", "landlord", "admin", "superAdmin", "agent", "support"],
      required: true,
    },

    referralCode: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    referralCount: {
      type: Number,
      default: null,
    },

    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord" },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    superAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "SuperAdmin" },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    support: { type: mongoose.Schema.Types.ObjectId, ref: "Support" }
    
  }, { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
