import { mongoose } from "@/app/lib/mongoose";

//Home interest Schem
const homeInterestSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  message: {type: String, required: true},

  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true},
  
}, { timestamps: true }
);

export default mongoose.models.HomeInterest || mongoose.model("HomeInterest", homeInterestSchema);

