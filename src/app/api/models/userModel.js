// import mongoose from "mongoose";
import {mongoose} from "@/app/lib/mongoose.js"

const userSchema = new mongoose.Schema({
    residencyStatus: {
        type: String,
        enum: ["Citizen", "Permanent Resident", "Work Permit", "Student Visa", "Visitors Visa"],
        required: true
    },
    whoIsUsingPlatform: {
        type: String,
        enum: ["myself", "someoneElse"],
        required: true
    },
    role: {
        type: String,
        enum: ["Tenant", "Landlord"],
        required: true
    },

}, {timestamps: true});

export default mongoose.models.User || 
mongoose.model("User", userSchema);