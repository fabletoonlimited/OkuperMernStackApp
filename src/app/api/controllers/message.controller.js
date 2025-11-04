import Message from "../models/message.js"
import Conversation from "../models/messageModel.js"
import Tenant from "../models/tenantModel.js";
import Landlord from "../models/landlordModel.js";

// sendMessage controller
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, receiverType, propertyId, content } = req.body;

    // figure out sender from auth middleware
    let senderId, senderType;

    if (req.tenant) {
      senderId = req.tenant._id;
      senderType = "Tenant";
      
    } else if (req.landlord) {
      senderId = req.landlord._id;
      senderType = "Landlord";
    } else {
      return res.status(403).json({ error: "You are an unauthorized sender"});
    }

    // validate receiver
    let receiver;
    if (receiverType === "Tenant") {
      receiver = await Tenant.findById(receiverId);
    } else if (receiverType === "Landlord") {
      receiver = await Landlord.findById(receiverId);
    }

    if (!receiver) {
      return res.status(400).json({ error: "Invalid receiver" });
    }

    // enforce tenant ↔ landlord only
    if (senderType === receiverType) {
      return res
        .status(403)
        .json({ error: "Messages must be between tenant and landlord only" });
    }

    // check for existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
      property: propertyId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        property: propertyId,
      });
    }

    // create message
    const message = await Message.create({
      sender: senderId,
      senderType,
      receiver: receiverId,
      receiverType,
      property: propertyId,
      conversationId: conversation._id,
      content,
    });

    // update conversation with last message
    conversation.lastMessage = message._id;
    await conversation.save();

      res.status(201).json({ conversation, message });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};