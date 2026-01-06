import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    residencyStatus: {
        type: String,
        enum: ["Citizen", "Permanent Resident", "Work Permit", "Student Visa", "Visitors Visa"]
    },
    whoIsUsingPlatform: {
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