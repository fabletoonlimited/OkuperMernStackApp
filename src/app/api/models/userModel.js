import {mongoose} from "@/app/lib/mongoose";

const userSchema = new mongoose.Schema(
    {
    residencyStatus: {
        type: String,
        enum: ["Citizen", "Permanent Resident", "Work Permit", "Student Visa", "Visitors Visa"],
        required: true
    },
    whoIsUsingPlatform: {
        type: String,
        enum: ["myself", "someoneElse"],
        required: true
    },
    role: {
        type: String,
        enum: ["tenant", "landlord"],
        required: true
    },

    // isActive: {
    //     type: Boolean,
    //     default: true
    // },
    // isVerfied: {
    //     type: Boolean,
    //     default: false
    // },

    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant"},
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord"}

}, {timestamps: true});

// userSchema.pre("save", function (next) {
//   if (this.role === "tenant" && this.landlord) {
//     return next(new Error("Tenant cannot have landlord data"));
//   }
//   if (this.role === "landlord" && this.tenant) {
//     return next(new Error("Landlord cannot have tenant data"));
//   }
//   next();
// });
   
export default mongoose.models.User || mongoose.model("User", userSchema);