import { mongoose } from "@/app/lib/mongoose";

// Property image schema
const imageSchema = new mongoose.Schema(
  {
    publicId: String,
    url: String, 
  },
  { _id: false }
);

// Property schema
const propertySchema = new mongoose.Schema(
  {
    previewPic: { type: String, required: true },

    // Store images as simple strings for simplicity
    Img1: { type: String, required: true },
    Img2: { type: String, required: true },
    Img3: { type: String, required: true },
    Img4: { type: String },
    Img5: { type: String },

    title: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, 
    enum: ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta",
      "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
      "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
    ],
    // lowercase: true,
    required: true 
    },

    price: { type: String, required: true },

    category: {
      type: String,
      enum: ["Rent", "Buy", "Sell", "Shortlet"],
      default: "Rent",
    },

    unitsAvailable: { type: Number, default: 0 },

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
        "Other",
      ],
      default: "Apartment",
    },

    bed: {
      type: String,
      enum: ["1Bdr","2Bdr","3Bdr","4Bdr","5Bdr","6Bdr","7Bdr","8Bdr"],
      required: true,
    },

    bath: {
      type: String,
      enum: ["1Bath","2Bath","3Bath","4Bath","5Bath","6Bath","7Bath","8Bath"],
      required: true,
    },

    features: {
      buildingAmenities: { type: [String], default: [] },
      propertyAmenities: { type: [String], default: [] },
      neighbourhoodPostcode: { type: String, default: "00000" },
      nearbyPlaces: { type: [String], default: [] },
    },

    listedBy: { type: String, required: true },



    savedHomes: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    isVerified: { type: Boolean, default: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: false}, 
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: false },
    homeInterest: [{ type: mongoose.Schema.Types.ObjectId, ref: "HomeInterest" }],
  },
  { timestamps: true }
);

export default mongoose.models.Property || mongoose.model("Property", propertySchema);
