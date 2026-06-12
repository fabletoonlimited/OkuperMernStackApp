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
  status: {
    type: String, 
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {type: Date, default: Date.now},

  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true},
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant"}
  
}, { timestamps: true }
);

export default mongoose.models.HomeInterest || mongoose.model("HomeInterest", homeInterestSchema);

