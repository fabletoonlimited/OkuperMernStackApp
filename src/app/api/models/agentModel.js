import {mongoose} from "@/app/lib/mongoose.js"
import bcrypt from "bcryptjs"

const agentSchema = new mongoose.Schema(
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

    iDUrl: {
      type: String,
      default: "",
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    role: {
        type: String, 
        default: "agent"
    },

    isPaid: {
        type: Boolean,
        default: false
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    otp: { type: mongoose.Schema.Types.ObjectId, ref: "Otp", required: false },
    agentDashboard: { type: mongoose.Schema.Types.ObjectId, ref: "AgentDashboard"},
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: "Message"}],
    property: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property"}],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment"}],
    disputes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dispute"}],

}, {timestamps: true});

// Password hashing
agentSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default mongoose.models.Agent || mongoose.model("Agent", agentSchema);
