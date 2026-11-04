import {mongoose} from "@/app/lib/mongoose.js"
import bcrypt from "bcryptjs"

const landlordAccountDetailsSchema = new mongoose.Schema(
  {
    accountNo: { 
        type: String, 
        required: true 
    },
    bank: {
        type: String, 
        required: true
    },

    landlord: [{ type: mongoose.Schema.Types.ObjectId, ref: "Landlord"}],
    landlordKyc: {type: mongoose.Schema.Types.ObjectId,ref: "LandlordKyc", required: true},
    payment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment"}],
    subscription: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subscription"}],
 

}, {timestamps: true})

export default mongoose.models.LandlordAccountDetails || mongoose.model("LandlordAccountDetails", landlordAccountDetailsSchema);
