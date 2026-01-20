// import mongoose from "mongoose";
import {mongoose} from "@/app/lib/mongoose.js"
import bcrypt from "bcryptjs"

const tenantSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    survey: {type: String},
    terms: {type: Boolean, required: true},
    // forgotPasswordToken: {type: String},

    isVerified: {
        type: Boolean,
        default: false
    },

    role: {
        type: String, 
        default: "Tenant"
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    tenantKyc: { type: mongoose.Schema.Types.ObjectId, ref: "TenantKyc"},
    tenantDashboard: { type: mongoose.Schema.Types.ObjectId, ref: "TenantDashboard"},
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: "Message"}],
    properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property"}],

    user: { 
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: false,
    },
    otp: { type: mongoose.Schema.Types.ObjectId, ref: "Otp", required: false },
    tenantKyc: { type: mongoose.Schema.Types.ObjectId, ref: "TenantKyc" },
    tenantDashboard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TenantDashboard",
    },
    properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
}, {timestamps: true});

// Password hashing
tenantSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


export default mongoose.models.Tenant || mongoose.model("Tenant", tenantSchema);
