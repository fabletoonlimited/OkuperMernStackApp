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

    utilityBillUrl: {
      type: String,
      default: "",
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    isSubscribed: {
      type: Boolean,
      default: false
    },

    role: {
        type: String, 
        default: "tenant"
    },

    isSelected: {
        type: Boolean,
        default: false
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    otp: { type: mongoose.Schema.Types.ObjectId, ref: "Otp", required: false },
    tenantKyc: { type: mongoose.Schema.Types.ObjectId, ref: "TenantKyc"},
    tenantDashboard: { type: mongoose.Schema.Types.ObjectId, ref: "TenantDashboard"},
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: "Message"}],
    property: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property"}],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment"}],
    disputes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dispute"}],
    homeInterests: [{ type: mongoose.Schema.Types.ObjectId, ref: "HomeInterest"}],
    subscription: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subscription"}]

}, {timestamps: true});

// Password hashing
tenantSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default mongoose.models.Tenant || mongoose.model("Tenant", tenantSchema);
