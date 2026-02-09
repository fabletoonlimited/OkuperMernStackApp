import {mongoose} from "@/app/lib/mongoose.js"

const propertyRequestFormSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.models.PropertyRequestForm || mongoose.model("PropertyRequestForm", propertyRequestFormSchema);