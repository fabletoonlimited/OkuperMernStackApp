import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    selection1: {
        type: String,
        enum: ["Nigerian Citizen", "Temporary Resident", "Permanent Resident", "Work Permit", "International Student"]
    },
    selection2: {
        type: String,
        enum: ["Myself", "Someone else"]
    },
    role: {
        type: String,
        enum: ["tenant", "landlord"],
        required: true
    },

    user: {
        type: Boolean,
        default: true
    },

    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant"},
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord"},
    otp: { type: mongoose.Schema.Types.ObjectId, ref: "Otp"}

}, {timestamps: true});
   
const User = mongoose.model("User", userSchema);
export default User;