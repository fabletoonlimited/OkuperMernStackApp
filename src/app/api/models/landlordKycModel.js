import { mongoose } from "@/app/lib/mongoose";

const landlordKycSchema = new mongoose.Schema(
    {
        previewPic: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        documentType: {
            type: String,
            enum: ["passport", "nin"],
            required: true,
        },


        idNumber: {
            type: String,
            required: true,
        },

        documentImage: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        gender: {
            type: String,
            enum: ["Male", "Female"],
        },

        age: {
            type: String,
            required: true,
        },

        stateOfOrigin: {
            type: String,
            required: true,
        },

        currentAddress: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true,
        },

        state: {
            type: String,
            required: true,
        },

        country: {
            type: String,
            required: true,
        },

        zipCode: {
            type: String,
        },

        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        landlord: {type: mongoose.Schema.Types.ObjectId,ref: "Landlord", required: true},
        landlordAccountDetails: {type: mongoose.Schema.Types.ObjectId,ref: "LandlordAccountDetails"},
    },    
    {timestamps: true,}
);


export default mongoose.models.LandlordKyc || mongoose.model("LandlordKyc", landlordKycSchema);