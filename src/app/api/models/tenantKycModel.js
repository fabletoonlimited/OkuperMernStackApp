import { mongoose } from "@/app/lib/mongoose";

const tenantKycSchema = new mongoose.Schema(
  {
    previewPic: { type: String, required: true },

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
    },

    phone: {
      type: String,
      required: true,
    },
    documentType: {
      type: String,
      enum: ["passport", "nin"],
      required: true,
    },
    idNumber: {
      type: String,
      required: true,
    },
    documentImage: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    age: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      enum: [
        "selfEmployed",
        "employed",
        "govtWorker",
        "student",
        "expatriate",
        "politician",
        "clergyman",
        "imam",
        "business",
        "other",
      ],
      required: true,
    },
    specifyOccupation: {
      type: [String],
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      required: true,
    },
    spouseName: {
      type: String,
    },
    noOfChildren: {
      type: Number,
      default: 0,
    },
    religion: {
      type: String,
      enum: ["Christianity", "Islam", "Traditionalist", "Other"],
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyAddress: {
      type: [String],
      required: true,
    },
    companyPhone: {
      type: String,
      required: true,
    },
    companyEmail: {
      type: String,
    },
    currentAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
    },
    stateOfOrigin: {
      type: String,
      required: true,
      enum: [
        "Abia",
        "Adamawa",
        "Akwa Ibom",
        "Anambra",
        "Bauchi",
        "Bayelsa",
        "Benue",
        "Borno",
        "Cross River",
        "Delta",          
        "Ebonyi",
        "Edo",
        "Ekiti",
        "Enugu",
        "Gombe",
        "Imo",
        "Jigawa",
        "Kaduna",
        "Kano",
        "Katsina",
        "Kebbi",
        "Kogi",
        "Kwara",
        "Lagos",
        "Nasarawa",
        "Niger",
        "Ogun", 
        "Ondo",
        "Osun",
        "Oyo",
        "Plateau",
        "Rivers",
        "Sokoto",
        "Taraba",
        "Yobe",
        "Zamfara",
        "FCT Abuja",
      ],
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    tenantDashboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TenantDashboard",
      required: true,
    },
    addressVerification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AddressVerification",
      required: false,
    },

    
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord" },
    
  },{ timestamps: true },
);

export default mongoose.models.TenantKyc || mongoose.model("TenantKyc", tenantKycSchema);

