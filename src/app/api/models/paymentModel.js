import {mongoose} from "@/app/lib/mongoose.js"

const paymentSchema = new mongoose.Schema(
  {
    reference: { 
        type: String, 
        required: true, 
        unique: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        required: 
        true 
    },
    paymentMethod: { 
        type: String, 
        required: true 
    },
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", required: false },
    dispute: { type: mongoose.Schema.Types.ObjectId, ref: "Dispute", required: false }
  }, { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);