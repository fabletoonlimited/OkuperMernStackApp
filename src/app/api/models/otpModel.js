import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },

    otp: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false},
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: false},
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: false},

}, {timestamps: true} 
);
   
const Otp = mongoose.model("Otp", otpSchema);
export default Otp;