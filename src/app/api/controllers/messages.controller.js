import { Message, Conversation } from "../models/messageModel.js";
import Tenant from "../models/tenantModel.js";
import Landlord from "../models/landlordModel.js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import dbConnect from "@/app/lib/mongoose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Helper to extract user ID from JWT token
async function getUserFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}

// Get all conversations for current user
export const getConversations = async (req) => {
  try {
    await dbConnect();
    const payload = await getUserFromToken();

    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.id;

    // Find all conversations where user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: "property",
        select: "title address price",
      })
      .populate({
        path: "lastMessage",
        select: "content sender createdAt",
      })
      .sort({ updatedAt: -1 })
      .lean();

    // Manually populate participants from both Tenant and Landlord models
    for (let conv of conversations) {
      const populatedParticipants = [];

      for (let participantId of conv.participants) {
        let participant = await Tenant.findById(participantId)
          .select("name email avatar profilePic")
          .lean();

        if (participant) {
          participant.role = "Tenant";
          populatedParticipants.push(participant);
          continue;
        }

        participant = await Landlord.findById(participantId)
          .select("name email avatar profilePic")
          .lean();

        if (participant) {
          participant.role = "Landlord";
          populatedParticipants.push(participant);
        }
      }

      conv.participants = populatedParticipants;
    }

    return NextResponse.json({ success: true, conversations }, { status: 200 });
  } catch (err) {
    console.error("Get conversations error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// Get messages for a specific conversation
export const getConversationMessages = async (req, conversationId) => {
  try {
    await dbConnect();
    const payload = await getUserFromToken();

    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.id;

    // Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.some(p => p.toString() === userId)) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // Get messages with sender details
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    // Manually populate sender for each message
    for (let msg of messages) {
      let sender = await Tenant.findById(msg.sender)
        .select("name avatar profilePic email")
        .lean();

      if (sender) {
        sender.role = "Tenant";
        msg.sender = sender;
        continue;
      }

      sender = await Landlord.findById(msg.sender)
        .select("name avatar profilePic email")
        .lean();

      if (sender) {
        sender.role = "Landlord";
      }

      msg.sender = sender;
    }

    // Get conversation details with participants
    const fullConversation = await Conversation.findById(conversationId)
      .populate({
        path: "property",
        select: "title address price",
      })
      .lean();

    // Manually populate participants
    const populatedParticipants = [];
    for (let participantId of fullConversation.participants) {
      let participant = await Tenant.findById(participantId)
        .select("name email avatar profilePic")
        .lean();

      if (participant) {
        participant.role = "Tenant";
        populatedParticipants.push(participant);
        continue;
      }

      participant = await Landlord.findById(participantId)
        .select("name email avatar profilePic")
        .lean();

      if (participant) {
        participant.role = "Landlord";
        populatedParticipants.push(participant);
      }
    }

    fullConversation.participants = populatedParticipants;

    return NextResponse.json(
      {
        success: true,
        conversation: fullConversation,
        messages,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Get conversation messages error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// sendMessage controller
export const sendMessage = async (req) => {
  try {
    await dbConnect();
    const payload = await getUserFromToken();

    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { receiverId, receiverType, propertyId, content } = body;

    const senderId = payload.id;

    // Determine sender type by checking which model has this user ID
    let senderType;
    const isTenant = await Tenant.findById(senderId);
    const isLandlord = await Landlord.findById(senderId);

    if (isTenant) {
      senderType = "Tenant";
    } else if (isLandlord) {
      senderType = "Landlord";
    } else {
      return NextResponse.json(
        { error: "You are an unauthorized sender" },
        { status: 403 },
      );
    }

    // validate receiver
    let receiver;
    if (receiverType === "Tenant") {
      receiver = await Tenant.findById(receiverId);
    } else if (receiverType === "Landlord") {
      receiver = await Landlord.findById(receiverId);
    }

    if (!receiver) {
      return NextResponse.json({ error: "Invalid receiver" }, { status: 400 });
    }

    // enforce tenant ↔ landlord only
    if (senderType === receiverType) {
      return NextResponse.json(
        { error: "Messages must be between tenant and landlord only" },
        { status: 403 },
      );
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

    return NextResponse.json(
      { conversation, message, success: true },
      { status: 201 },
    );
  } catch (err) {
    console.error("Send message error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// Mark messages as read in a conversation
export const markMessagesAsRead = async (req, conversationId) => {
  try {
    await dbConnect();
    const payload = await getUserFromToken();

    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.some(p => p.toString() === userId)) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    const result = await Message.updateMany(
      { conversationId, receiver: userId, isRead: false },
      { isRead: true },
    );

    return NextResponse.json(
      { success: true, modifiedCount: result.modifiedCount },
      { status: 200 },
    );
  } catch (err) {
    console.error("Mark as read error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
