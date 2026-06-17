import {mongoose} from "@/app/lib/mongoose.js"

const subscriptionSchema = new mongoose.Schema(
    {
        plan: { 
            type: Boolean,
            default: false, 
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
            default: true, 
            required: true
        },
        
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord"},
        // payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", required: true },
        property: { type: mongoose.Schema.Types.ObjectId, ref: "Property"},
    }, { timestamps: true }
);

export default mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);