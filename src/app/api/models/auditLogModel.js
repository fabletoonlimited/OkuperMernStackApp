import {mongoose} from "@/app/lib/mongoose.js"

const auditSchema = new mongoose.Schema({
  action: String,
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SuperAdmin",
  },
  targetId: mongoose.Schema.Types.ObjectId,
  metadata: Object,
}, { timestamps: true });

export default mongoose.model("AuditLog", auditSchema);