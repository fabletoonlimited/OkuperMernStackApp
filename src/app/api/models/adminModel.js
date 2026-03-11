import {mongoose} from "@/app/lib/mongoose.js"
import bcrypt from "bcryptjs"

const tenantSchema = new mongoose.Schema(
  {
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true
    },
    password: {type: String, required: true},
    survey: {type: String},
    terms: {type: Boolean, required: true},
    forgotPasswordToken: {type: String},
    forgotPasswordTokenExpiry: {type: Date},

    isVerified: {
        type: Boolean,
        default: false
    },

    role: {
        type: String, 
        default: "admin"
    },

    otp: { type: mongoose.Schema.Types.ObjectId, ref: "Otp", required: false },
    adminDashboard: { type: mongoose.Schema.Types.ObjectId, ref: "AdminDashboard"},
    message: [{type: mongoose.Schema.Types.ObjectId, ref: "Message"}],
    property: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property"}],
    tenant: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tenant"}],
    landlord: [{ type: mongoose.Schema.Types.ObjectId, ref: "Landlord"}]

}, {timestamps: true});

// Password hashing
adminSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
