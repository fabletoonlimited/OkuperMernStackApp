import {mongoose} from "@/app/lib/mongoose.js"
import bcrypt from "bcryptjs"

const landlordSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true}, 
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
      default: "landlord",
    },
    
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    otp: { type: mongoose.Schema.Types.ObjectId, ref: "Otp", required: false },
    landlordKyc: { type: mongoose.Schema.Types.ObjectId, ref: "LandlordKyc"},
    landlordDashboard: {type: mongoose.Schema.Types.ObjectId, ref: "LandlordDashboard"},
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: "Message"}],
    properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property"}],
    
  }, { timestamps: true }
);

//Password pre-hashing middleware
landlordSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default mongoose.models.Landlord || mongoose.model("Landlord", landlordSchema);
