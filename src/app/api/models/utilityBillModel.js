import { mongoose } from "@/app/lib/mongoose";

const utilityBillSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: false,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "uploadedByModel",
      required: true,
    },
    uploadedByModel: {
      type: String,
      enum: ["Landlord", "Tenant"],
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.UtilityBill || mongoose.model("UtilityBill", utilityBillSchema);