import mongoose from "mongoose";

const propertyInterestSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    message: {
        type: String,
        required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true},
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true},
})
const PropertyInterest = mongoose.model("PropertyInterest", propertyInterestSchema);
export default PropertyInterest;