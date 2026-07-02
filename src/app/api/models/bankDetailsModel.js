import { mongoose } from "@/app/lib/mongoose";

const bankDetailsSchema = new mongoose.Schema ({
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "landlord",
    required: true
  },
  accountNo: {
    type: String,
    required: true
  },

  bank: {
    type: String,
    required: true
  },
}, { timestamps: true } );

export default mongoose.models.BankDetails || mongoose.model("BankDetails", bankDetailsSchema);