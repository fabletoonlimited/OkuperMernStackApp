import mongoose from "mongoose";

// Conversation Schema
const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // tenant and landlord both live in User model
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
  }, { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);

// Message Schema
const messageSchema = new mongoose.Schema(
  {
    senderType: {
      type: String,
      enum: ["tenant", "landlord"],
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderType", // <-- dynamic reference
    },
    receiverType: {
      type: String,
      enum: ["tenant", "landlord"],  // <-- dynamic reference
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverType",  // <-- dynamic reference
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
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
