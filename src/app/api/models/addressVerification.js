import mongoose from "mongoose";
import okHi from "okhi";
import dotenv from "dotenv";

dotenv.config();

const addressVerificationSchema = new mongoose.Schema({
    street: {
        type: String, 
        required: true
    },
    city: {
        type: String, 
        required: true 
    },
    state: { 
        type: String, 
        required: true 
    },
    country: { 
        type: String, 
        required: true
    },
    zipCode: {type: String},

    verificationDetails: {
        billType: { type: String, 
        enum: ['Light', 'Lawma', "Water", "Image", "Document"]
        },
        billUrl: { type: String},
        matchedByOkHi: { type: Boolean, default: false },
        okHiResponse: { type: Object },
    },
    isVerified: {
        type: Boolean, 
        default: false
    },

    // user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true},
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true},

}, {timestamps: true});  

addressVerificationSchema.pre('save', async function(next) {    
  if (this.isVerified || this.verificationDetails?.matchedByOkHi) {
        return next();
    }    
    try {
        const okhiClient = okHi({
            apiKey: process.env.OKHI_API_KEY,
            apiSecret: process.env.OKHI_API_SECRET,
            environment: process.env.OKHI_ENVIRONMENT || 'sandbox',
        });

        const addressString = `${this.street}, ${this.city}, ${this.state}, ${this.country}`;

        const response = await okhiClient.verifyAddress({
            address: addressString,
            country: this.country
        });
        
        if (!this.verificationDetails) {
        this.verificationDetails = {};
        }

        this.verificationDetails.matchedByOkHi = response?.status === 'verified';
        this.verificationDetails.okHiResponse = response;
        this.isVerified = response?.status === 'verified';

        next();
    } catch (error) {
        console.error("OkHi verification failed:", error);
        next();
    }
});
const AddressVerification = mongoose.model('AddressVerification', addressVerificationSchema);
export default AddressVerification; 