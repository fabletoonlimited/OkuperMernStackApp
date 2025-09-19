// Backend/models/Property.js
import mongoose from 'mongoose';

const propertyCardSchema = new mongoose.Schema({
  previewPix: {
    type: String,
    required: true
  },
  savedHomes: {
    type: String,
    default: false
  },
  unitsAvailable: {
    type: Number,
    default: 0
  },
  price: {
    type: String,
    required: true
  },
  desc: String,
  location: String, 

  category: {
    type: String,
    enum: ["Rent", "Buy", "Sell","Shortlet", "Commercial", "Land", "Other"],
    default: "Rent",
  },
  rating: String,
  numberOfBed: String,
  propertyType: String,
  numberOfBath: String,
}, {
  timestamps: true
});

const PropertyCard = mongoose.model('PropertyCard', propertyCardSchema);

export default PropertyCard;
