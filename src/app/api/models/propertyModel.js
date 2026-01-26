import { mongoose } from "@/app/lib/mongoose";

//PropertySchema 
const imageSchema = new mongoose.Schema({
  publicId: String,
  url: String
},
{_id: false}
);

const propertySchema = new mongoose.Schema({
    previewPic: {type: String, required: true},

    Img1: [imageSchema],
    Img2: [imageSchema],
    Img3: [imageSchema],
    Img4: [imageSchema],
    Img5: [imageSchema],

    title: {type: String, required: true},
    address: {type: String,required: true},
    price: {type: String, required: true},
    category: {
        type: String,
        enum: ["Rent", "Buy", "Sell", "Shortlet"],
        default: "Rent",
    },
    propertyType: {
        type: String,
        enum: [
            "Apartment", 
            "Bungalow", 
            "House", 
            "Condo", 
            "Townhouse", 
            "Duplex", 
            "Studio", 
            "Villa", 
            "BQ", 
            "Other"
        ],
        default: "Apartment",
    },
    bed: {
        type: String,
        enum: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "More than 10"],
        default: "0",
    },
    bath: {
        type: String,
        enum: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "More than 10"],
        default: "0",
    },
    features: {
        buildingAmenities: [String],
        propertyAmenities: [String],
        neighbourhoodPostcode: {
        type: String,
        required: true,
        default: "00000",
        },
        nearbyPlaces:[String]
    },

    listedBy: {
        fullName: {
        type: String,
        required: true,
        },
    },

    //From property Card
    savedHomes: {
        type: Boolean,
        default: false,
        icon: String
    },
    unitsAvailable: {
        type: Number,
        default: 0
    },

    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },

    // isVerified: {
    //   type: Boolean,
    //   default: true,
    // },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },
    homeInterest: [{ type: mongoose.Schema.Types.ObjectId, ref: "HomeInterest" }],

}, {timestamps: true}
);


export default mongoose.models.Property || mongoose.model('Property', propertySchema);

