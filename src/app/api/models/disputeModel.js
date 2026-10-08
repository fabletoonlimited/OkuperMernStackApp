import { mongoose } from "@/app/lib/mongoose";
import { nanoid } from "nanoid";

const disputeSchema = new mongoose.Schema(
    {
        disputeNo: {
            type: String,
            unique: true,
        },

        // Filled when TENANT submits
        tenant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tenant",
            default: null,
        },

        // Filled when AGENT submits
        agent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agent",
            default: null,
        },

        // The landlord who receives the dispute
        landlord: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Landlord",
            required: true,
        },

        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true,
        },

        complaint: {
            type: String,
            required: true,
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 0,
        },

        status: {
            type: String,
            enum: ["open", "in_progress", "resolved", "rejected"],
            default: "open",
        },
    },
    {
        timestamps: true,
    }
);

disputeSchema.pre("save", function (next) {
    if (!this.disputeNo) {
        this.disputeNo = `OkDisCom-${nanoid(6).toUpperCase()}`;
    }

    next();
});

export default mongoose.models.Dispute || mongoose.model("Dispute", disputeSchema);