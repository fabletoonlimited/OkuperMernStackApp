import mongoose from "mongoose";
import bcrypt from "bcrypt"

const tenantSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    otp: {type: String, required: true},
    referalCode: {type: String, required: false},
    survey: {type: String},
    terms: {type: Boolean, required: false},
    forgotPasswordToken: {type: String},

    role: {
        type: String, 
        default: "tenant"
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    otp: { type: mongoose.Schema.Types.ObjectId, ref: "Otp", required: true},
    tenantKyc: { type: mongoose.Schema.Types.ObjectId, ref: "TenantKyc", required: false},
    tenantDashboard: { type: mongoose.Schema.Types.ObjectId, ref: "TenantDashboard"},
    properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property"}],
    
}, {timestamps: true});

// Password hashing
tenantSchema.pre("save", async function(next) {
    const hashedPassword = bcrypt.hashSync(this.password, 10)
    this.password = hashedPassword;
    next();
});

const Tenant= mongoose.model("Tenant", tenantSchema);
export default Tenant;