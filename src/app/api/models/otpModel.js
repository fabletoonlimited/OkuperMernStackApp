import {mongoose} from "@/app/lib/mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },

    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant"},
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord"},
  },
  
  { timestamps: true }, otpSchema.index({expiresAt: 1}, { expiresAfterSeconds: 0})
);

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);
