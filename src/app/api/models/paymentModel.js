import {mongoose} from "@/app/lib/mongoose.js"
import crypto from "crypto"

const paymentSchema = new mongoose.Schema(
  {
    reference: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: {
        type: String,
        required: true,
    },
    amount: { 
        type: Number, 
        required: true 
    },
    currency: {
        type: String,
        enum: ["DA", "Kz", "CFA", "P", "FBu", "FCFA", "Esc", "CF", "DF", 
            "E£", "Nfk", "L/E", "Br", "D", "GH₵", "FG", "KSh", "L/M", "L$", "LD", 
            "Ar", "MK", "UM", "Rs", "MAD", "MT", "N$", "NGN", "USD", "GBP", "EUR", 
            "FRw", "Db", "Le", "Sh.So", "R", "SSP", "SDG", "TSh", "DT","USh", "ZK", "ZWL"],
        default: "NGN"
    },
    status: { 
        type: String,
        enum: ["Pending", "Successful", "Failed"],
        default: "Pending"
    },
    isSplitpayment: {
        type: Boolean,
        default: false,
    },
    serviceCharge: {
        type: Number,
        default: 0,
    },
    finalPaidAmount: {
        type: Number,
        default: 0,
    },

    splitPaymentReference: {
        type: String,
        default: null,
        required: false
    },
    transactionId: {
        type: String,
        default: null
    },
    
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", required: false },
    property: [{type: mongoose.Schema.Types.ObjectId, ref: "Property", required: false}]
  
}, { timestamps: true });

// Pre-save hook to deduct 5% automatically
paymentSchema.pre("save", function (next) {
  if (this.isModified("amount")) {
    this.serviceCharge = this.amount * 0.05;
    this.finalPaidAmount = this.amount + this.serviceCharge;
  }

  next();
});

//Pre-save hook for transactionId
paymentSchema.pre("save", function (next) {
  if (!this.transactionId) {
    this.transactionId = `TXN-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
  }

  next();
});

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);