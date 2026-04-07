import {mongoose} from "@/app/lib/mongoose.js"
import bcrypt from "bcryptjs"

const superAdminSchema = new mongoose.Schema(
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
    forgotPasswordToken: {type: String},
    forgotPasswordTokenExpiry: {type: Date},

    isVerified: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        enum: ["superAdmin", "admin", "support", "moderator"],
        default: "admin",
    },

    otp: { type: mongoose.Schema.Types.ObjectId, ref: "Otp", required: false },
    DashboardSuperAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "AdminDashboard"},
    message: [{type: mongoose.Schema.Types.ObjectId, ref: "Message"}],
    property: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property"}],
    tenant: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tenant"}],
    landlord: [{ type: mongoose.Schema.Types.ObjectId, ref: "Landlord"}],
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transactions"}],
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subscribers"}],
    disputes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment"}],
    referals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Referals"}]

}, {timestamps: true});

// Password hashing
superAdminSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

superAdminSchema.index(
    {role: 1},
    {
        unique: true, 
        partialFilterExpression: 
        { role: "superAdmin" }}
)

export default mongoose.models.SuperAdmin || mongoose.model("SuperAdmin", superAdminSchema);
