import {mongoose} from "@/app/lib/mongoose.js"
import crypto from "crypto"

const subscriptionSchema = new mongoose.Schema(
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
            type: String, 
            required: true 
        },
        currency: {
            type: String,
            enum: [
                "DA", "Kz", "CFA", "P", "FBu", "FCFA", "Esc", "CF", "DF", 
                "E£", "Nfk", "L/E", "Br", "D", "GH₵", "FG", "KSh", "L/M", "L$", "LD", 
                "Ar", "MK", "UM", "Rs", "MAD", "MT", "N$", "NGN", "USD", "GBP", "EUR", 
                "FRw", "Db", "Le", "Sh.So", "R", "SSP", "SDG", "TSh", "DT","USh", "ZK", 
                "ZWL"
            ],
            default: "NGN"
        },     
        plan: { 
            type: String,
            enum: ["basic", "premium"],
            required: true 
        },
        startDate: { 
            type: Date, 
            required: true 
        },
        endDate: { 
            type: Date, 
            required: true 
        },
        isActive: { 
            type: Boolean, 
            default: false, 
            required: true
        },
        
        status: {
            type: String,
            enum: ["Pending", "Successful", "Failed"],
            default: "Pending"
        },

        transactionId: {
            type: String,
            unique: true,
            default: null
        },
       
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        property: { type: mongoose.Schema.Types.ObjectId, ref: "Property"},
    }, { timestamps: true });
    
    //Pre-save hook for transactionId
    subscriptionSchema.pre("save", function (next) {
      if (!this.transactionId) {
        this.transactionId = `TXN-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
      }
    
      next();
    });

export default mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);