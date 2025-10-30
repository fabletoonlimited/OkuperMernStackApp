import { icon } from '@fortawesome/fontawesome-svg-core';
import mongoose from 'mongoose';

//Home interest Schem
const homeInterestSchema = new mongoose.Schema({
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

  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property"},

}, { timestamps: true }
)

export const HomeInterest = mongoose.model("HomeInterest", homeInterestSchema);

//PropertySchema 
const imageSchema = new mongoose.Schema({
  publicId: String,
  url: String
})

const propertySchema = new mongoose.Schema({
  previewPix: {
    type: String,
    required: true
  },
  Img1: [imageSchema],
  Img2: [imageSchema],
  Img3: [imageSchema],
  Img4: [imageSchema],
  Img5: [imageSchema],

  savedHomes: {
    type: String,
    default: false,
    icon: String
  },
    unitsAvailable: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["Rent", "Buy", "Sell", "Shortlet"],
    default: "Rent",
  },

  rating: String,
  
  type: {
    type: String,
    enum: ["Apartment", "Bungalow", "House", "Condo", "Townhouse", "Duplex", "Studio", "Villa", "Other"],
    default: "Apartment",
  },
  Bed: {
    type: String,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "More than 10"],
    default: "1",
  },
  Bath: {
    type: String,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "More than 10"],
    default: "1",
  },
  listedBy: {
    type: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  features: {
    buildingAmenities: {
      type: [String]
    },
    propertyAmenities: {
      type: [String]
    },
    neighbourhoodPostcode: {
      // Img6: [imageSchema],
      type: String,
      required: true,
      default: "00000",
    },
    nearbyPlaces: {
      type: [String]
    }
  },
  
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant"},
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },
  propertyInterests: [{ type: mongoose.Schema.Types.ObjectId, ref: "PropertyInterest", required: false }],

}, {timestamps: true}
);

const Property = mongoose.model('Property', propertySchema);

export default Property;
