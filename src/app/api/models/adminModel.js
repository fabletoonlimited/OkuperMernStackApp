import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
    isAdmin: {  
        type: Boolean,
        default: true,
    },
    isLandlord: {  
        type: Boolean,
        default: false,
    },
}, {timestamps: true} 
);
   
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;