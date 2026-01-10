import mongoose from "mongoose";
import Otp from "./otpModel.js";
import bcrypt from "bcryptjs";

const landlordSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    referalCode: { type: String, required: false },
    survey: { type: String },
    terms: { type: Boolean, required: false },
    // forgotPasswordToken: {type: String},

    role: {
      type: String,
      default: "landlord",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    otp: { type: mongoose.Schema.Types.ObjectId, ref: "Otp", required: false },
    landlordKyc: { type: mongoose.Schema.Types.ObjectId, ref: "LandlordKyc" },
    landlordDashboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LandlordDashboard",
    },
    properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  },
  { timestamps: true }
);

//Password pre-hashing middleware
landlordSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const hashedPassword = bcrypt.hashSync(this.password, 10);
    this.password = hashedPassword;
  }
});

//otp verification middleware can be added here
// landlordSchema.pre("save", async function (next) {
//   const otpRecord = await Otp.findById(this.otp);
//   if (!otpRecord || otpRecord.code !== this.otp) {
//     throw new Error("Invalid OTP");
//   }
//   next();
// });

const Landlord =
  mongoose.models.Landlord || mongoose.model("Landlord", landlordSchema);
export default Landlord;
