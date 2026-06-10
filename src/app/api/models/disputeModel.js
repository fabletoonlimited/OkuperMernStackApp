import { mongoose } from "@/app/lib/mongoose";
import { nanoid } from "nanoid";

const disputeSchema = new mongoose.Schema ({

    disputeNo: {
        type: String,
        required: true,
        unique: true    
    },

    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
        required: true
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },
    complaint: {
        type: String,
        required: true
    },
    rating: { type: Number, min: 1, max: 5, default: 0 },

    status: {
        type: String,
        enum: ["open", "in_progress", "resolved", "rejected"],
        default: "open"
    }
}, { timestamps: true });

    disputeSchema.pre("save", async function (next) {
        if (!this.disputeNo) {
            this.disputeNo = `OKTenCom-${nanoid(6).toUpperCase()}`;
        }
        next();
    });

export default mongoose.models.Dispute || mongoose.model("Dispute", disputeSchema);