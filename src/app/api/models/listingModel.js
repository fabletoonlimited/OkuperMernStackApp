import { icon } from '@fortawesome/fontawesome-svg-core';
import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  publicId: String,
  url: String
})

const listingSchema = new mongoose.Schema({
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
    enum: ["Rent", "Buy", "Sell", "Shortlet", "Commercial", "Land", "Other"],
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

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
