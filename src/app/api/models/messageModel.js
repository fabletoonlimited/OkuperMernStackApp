import { mongoose } from "@/app/lib/mongoose";

// Conversation Schema
const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    status: {
      type: String,
      enum: ["active", "inspection", "accepted", "rejected", "cancelled", "completed"],
      default: "active",
    },
  },
  { timestamps: true },
);

// Conversation indexes
conversationSchema.index({ participants: 1, updatedAt: -1 }); // inbox list query + sort
conversationSchema.index({ participants: 1, property: 1 });   // duplicate conversation check in sendMessage

export const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

// Message Schema
const messageSchema = new mongoose.Schema(
  {
    senderType: {
      type: String,
      enum: ["Tenant", "Landlord"],
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderType", // <-- dynamic reference
    },
    receiverType: {
      type: String,
      enum: ["Tenant", "Landlord"], // <-- dynamic reference
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverType", // <-- dynamic reference
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Message indexes
messageSchema.index({ conversationId: 1, createdAt: 1 });          // fetch messages in order
messageSchema.index({ conversationId: 1, receiver: 1, isRead: 1 }); // markMessagesAsRead query

export const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
