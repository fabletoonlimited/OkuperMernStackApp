// Backend/models/Property.js
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  Img: [
    {
      publicId: String,
      url: String
    }
  ],
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
  category: String,
  rating: String,
  numberOfBed: String,
  propertyType: String,
  numberOfBath: String,
}, {
  timestamps: true
});

const Property = mongoose.model('Property', propertySchema);

export default Property;
