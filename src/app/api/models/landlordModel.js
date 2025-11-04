import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const landlordSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    otp: {type: String, required: true},
    password: {type: String, required: true},

    survey: {type: String},
    agreement: {type: Boolean, required: false},
    forgotPasswordToken: {type: String},
    
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    otp: { type: mongoose.Schema.Types.ObjectId, ref: "Otp", required: true},
    landlordKyc: { type: mongoose.Schema.Types.ObjectId, ref: "LandlordKyc"},
    landlordDashboard: {type: mongoose.Schema.Types.ObjectId, ref: "LandlordDashboard"},
    properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property"}],

}, {timestamps: true});

//Password pre-hashing middleware
landlordSchema.pre("save", async function(next) {
    const hashedPassword = bcrypt.hashSync(this.password, 10)
    this.password = hashedPassword;
    next();
});

const Landlord = mongoose.model("Landlord", landlordSchema);
export default Landlord;