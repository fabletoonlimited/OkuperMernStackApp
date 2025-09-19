import mongoose from "mongoose";
import okHi from "okhi";
import dotenv from "dotenv";

dotenv.config();

const addressVerificationSchema = new mongoose.Schema({
    street: {type: String, required: true},
    city: {type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true},
    zipCode: {type: String},

    isVerified: {type: Boolean, default: false},
    verificationDetails: {
        billType: { type: String, enum: ['Light', 'Lawma', "Water", "Other"]},
        billUrl: { type: String},
        matchedByOkHi: { type: Boolean, default: false },
        okHiResponse: { type: Object },
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true},
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true},

}, {timestamps: true});  

addressVerificationSchema.pre('save', async function(next) {    
    if (this.isVerified) {
        return next();
    }    
    try {
        const okhiClient = okHi({
            apiKey: process.env.OKHI_API_KEY,
            apiSecret: process.env.OKHI_API_SECRET,
            environment: process.env.OKHI_ENVIRONMENT || 'sandbox',
        });
        const address = {
            street: this.street,
            city: this.city,
            state: this.state,
            country: this.country,
            zipCode: this.zipCode,
        };
        const response = await okhiClient.verifyAddress(address);

        if (response && response.status === 'verified') {
            this.isVerified = true;
            this.verificationDetails = response;
        } else {
            this.isVerified = false;
            this.verificationDetails = response;
        }
        next();
    } catch (error) {
        next(error);
    }
});
const AddressVerification = mongoose.model('AddressVerification', addressVerificationSchema);
export default AddressVerification; 