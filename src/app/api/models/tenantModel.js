import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const tenantSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    referalCode: { type: String, required: false },
    survey: { type: String },
    terms: { type: Boolean, required: false },
    forgotPasswordToken: { type: String },

    role: {
      type: String,
      default: "tenant",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    otp: { type: mongoose.Schema.Types.ObjectId, ref: "Otp", required: true },
    tenantKyc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TenantKyc",
      required: false,
    },
    tenantDashboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TenantDashboard",
    },
    properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  },
  { timestamps: true }
);

// Password hashing
tenantSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const hashedPassword = bcrypt.hashSync(this.password, 10);
    this.password = hashedPassword;
  }
});

const Tenant = mongoose.models.Tenant || mongoose.model("Tenant", tenantSchema);
export default Tenant;
