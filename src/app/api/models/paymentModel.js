import {mongoose} from "@/app/lib/mongoose.js"

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
    status: { 
        type: String,
        enum: ["Pending", "Successful", "Failed"],
        default: "Pending"
    },
    isSplitpayment: {
        type: Boolean,
        default: null,
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
paymentSchema.pre('save', function(next) {
  this.deductionAmount = this.amount * 0.05;
  this.finalPaidAmount = this.amount - this.deductionAmount;
  
  next();
});

//Pre-save hook for transactionId
paymentSchema.pre("save", async function (next) {
    if (!this.transactionId) {
        this.transactionId = `TXN-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
    }
    next();
});

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);