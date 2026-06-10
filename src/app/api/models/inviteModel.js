import { mongoose } from "@/app/lib/mongoose";

const inviteSchema = new mongoose.Schema({
  token: { 
    type: String, 
    required: true, 
    unique: true 
  }, // hashed

  email: { 
    type: String, 
    required: true, 
    trim: true
  },

  role: {
    type: String,
    enum: ["superAdmin","admin", "support", "agent"],
    default: "admin"
  },

  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "SuperAdmin"},

  isActive: {
    type: Boolean,
    default: true
  },

  expiresAt: { type: Date, required: true },

  used: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Invite || mongoose.model("Invite", inviteSchema);