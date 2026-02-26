import mongoose from "mongoose";
import { Message, Conversation } from "../models/messageModel.js";
import Tenant from "../models/tenantModel.js";
import Landlord from "../models/landlordModel.js";
import Property from "../models/propertyModel.js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import dbConnect from "@/app/lib/mongoose";
import { emitToConversation, emitReadReceipt, emitTyping } from "@/app/lib/sseStore.js";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Batch-fetch users from both Tenant and Landlord models in parallel.
// Returns a map of { [id string]: populated user object }
async function batchPopulateUsers(ids) {
  const uniqueIds = [...new Set(ids.map((id) => id.toString()))];

  const [tenants, landlords] = await Promise.all([
    Tenant.find({ _id: { $in: uniqueIds } })
      .select("firstName lastName email avatar profilePic")
      .lean(),
    Landlord.find({ _id: { $in: uniqueIds } })
      .select("firstName lastName email avatar profilePic")
      .lean(),
  ]);

  const map = {};
  for (const t of tenants) {
    map[t._id.toString()] = {
      ...t,
      role: "Tenant",
      name: `${t.firstName || ""} ${t.lastName || ""}`.trim(),
    };
  }
  for (const l of landlords) {
    map[l._id.toString()] = {
      ...l,
      role: "Landlord",
      name: `${l.firstName || ""} ${l.lastName || ""}`.trim(),
    };
  }

  return map;
}

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

    const conversationIds = conversations.map((c) => c._id);

    // Run participant population and unread count aggregation in parallel
    const [userMap, unreadAgg] = await Promise.all([
      batchPopulateUsers(conversations.flatMap((c) => c.participants)),
      Message.aggregate([
        {
          $match: {
            receiver: new mongoose.Types.ObjectId(userId),
            isRead: false,
            conversationId: { $in: conversationIds },
          },
        },
        {
          $group: {
            _id: "$conversationId",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Build unread map: { conversationId -> count }
    const unreadMap = {};
    for (const { _id, count } of unreadAgg) {
      unreadMap[_id.toString()] = count;
    }

    for (let conv of conversations) {
      conv.participants = conv.participants
        .map((id) => userMap[id.toString()] || null)
        .filter(Boolean);
      if (!conv.status) conv.status = "active";
      conv.unreadCount = unreadMap[conv._id.toString()] || 0;
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

    // Fetch conversation (with populate) and messages in one parallel round
    const [fullConversation, messages] = await Promise.all([
      Conversation.findById(conversationId)
        .populate({ path: "property", select: "title address price" })
        .lean(),
      Message.find({ conversationId })
        .sort({ createdAt: 1 })
        .lean(),
    ]);

    if (!fullConversation || !fullConversation.participants.some(p => p.toString() === userId)) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // Batch-populate all users (senders + participants) in one call — batchPopulateUsers deduplicates
    const allIds = [
      ...messages.map((m) => m.sender),
      ...fullConversation.participants,
    ];
    const userMap = await batchPopulateUsers(allIds);

    for (let msg of messages) {
      msg.sender = userMap[msg.sender.toString()] || null;
    }

    fullConversation.participants = fullConversation.participants
      .map((id) => userMap[id.toString()] || null)
      .filter(Boolean);
    if (!fullConversation.status) fullConversation.status = "active";

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
    const { receiverId, receiverType, propertyId, content, fileUrl, fileType } = body;

    if (!content?.trim() && !fileUrl) {
      return NextResponse.json({ error: "Message must have content or a file" }, { status: 400 });
    }
    if (content && content.trim().length > 1000) {
      return NextResponse.json({ error: "Message cannot exceed 1000 characters" }, { status: 400 });
    }

    const senderId = payload.id;

    // Run all lookups in parallel — sender detection, receiver validation, property check, conversation check
    const [isTenant, isLandlord, receiver, property, existingConversation] = await Promise.all([
      Tenant.findById(senderId),
      Landlord.findById(senderId),
      receiverType === "Tenant" ? Tenant.findById(receiverId) : Landlord.findById(receiverId),
      Property.findById(propertyId).lean(),
      Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
        property: propertyId,
      }),
    ]);

    // Determine sender type
    let senderType;
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

    if (!receiver) {
      return NextResponse.json({ error: "Invalid receiver" }, { status: 400 });
    }

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Verify the landlord participant actually owns the property
    const landlordParticipantId = receiverType === "Landlord" ? receiverId : senderId;
    if (property.landlord.toString() !== landlordParticipantId) {
      return NextResponse.json({ error: "Receiver is not the property owner" }, { status: 403 });
    }

    // enforce tenant ↔ landlord only
    if (senderType === receiverType) {
      return NextResponse.json(
        { error: "Messages must be between tenant and landlord only" },
        { status: 403 },
      );
    }

    const conversation = existingConversation ?? await Conversation.create({
      participants: [senderId, receiverId],
      property: propertyId,
      status: "active",
    });


    // create message
    const message = await Message.create({
      sender: senderId,
      senderType,
      receiver: receiverId,
      receiverType,
      property: propertyId,
      conversationId: conversation._id,
      content: content?.trim() || "",
      ...(fileUrl && { fileUrl }),
      ...(fileType && { fileType }),
    });

    // update conversation with last message
    conversation.lastMessage = message._id;
    await conversation.save();

    // Build a plain message object with populated sender for SSE emission
    const senderDoc = isTenant || isLandlord;
    const messageForEmit = {
      ...message.toObject(),
      sender: {
        _id: senderDoc._id,
        name: `${senderDoc.firstName || ""} ${senderDoc.lastName || ""}`.trim(),
        email: senderDoc.email,
        role: senderType,
        avatar: senderDoc.avatar || senderDoc.profilePic || null,
      },
    };

    // Push to any open SSE connections for this conversation
    emitToConversation(conversation._id, messageForEmit);

    return NextResponse.json(
      { conversation, message, success: true },
      { status: 201 },
    );
  } catch (err) {
    console.error("Send message error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// Proceed with tenant for inspection
export const proceedWithInspection = async (req, conversationId) => {
  try {
    await dbConnect();
    const payload = await getUserFromToken();

    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.id;

    // Only landlords can trigger this
    const isLandlord = await Landlord.findById(userId);
    if (!isLandlord) {
      return NextResponse.json({ error: "Only landlords can proceed with inspection" }, { status: 403 });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.some(p => p.toString() === userId)) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (conversation.status === "inspection") {
      return NextResponse.json({ error: "Inspection already initiated" }, { status: 400 });
    }

    // Find the tenant participant
    const tenantId = conversation.participants.find(p => p.toString() !== userId);
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant not found in conversation" }, { status: 400 });
    }

    // Update conversation status
    conversation.status = "inspection";

    // Send automated message
    const automatedMessage = await Message.create({
      sender: userId,
      senderType: "Landlord",
      receiver: tenantId,
      receiverType: "Tenant",
      property: conversation.property,
      conversationId: conversation._id,
      content: "The landlord has selected you to proceed with a property inspection. Please await further contact regarding scheduling.",
    });

    conversation.lastMessage = automatedMessage._id;
    await conversation.save();

    // Emit automated message to tenant's open SSE connection
    const messageForEmit = {
      ...automatedMessage.toObject(),
      sender: {
        _id: isLandlord._id,
        name: `${isLandlord.firstName || ""} ${isLandlord.lastName || ""}`.trim(),
        email: isLandlord.email,
        role: "Landlord",
        avatar: isLandlord.avatar || isLandlord.profilePic || null,
      },
    };
    emitToConversation(conversation._id, messageForEmit);

    return NextResponse.json(
      { success: true, message: automatedMessage, conversation },
      { status: 200 },
    );
  } catch (err) {
    console.error("Proceed with inspection error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// Helper: update conversation status + send automated message + emit SSE
const updateConversationStatus = async (conversationId, newStatus, actorDoc, actorType, content) => {
  const conversation = await Conversation.findById(conversationId);
  conversation.status = newStatus;

  const tenantId = conversation.participants.find(p => p.toString() !== actorDoc._id.toString());
  const receiverId = actorType === "Landlord" ? tenantId : conversation.participants.find(p => p.toString() !== tenantId.toString());
  const receiverType = actorType === "Landlord" ? "Tenant" : "Landlord";

  const automatedMessage = await Message.create({
    sender: actorDoc._id,
    senderType: actorType,
    receiver: receiverId,
    receiverType,
    property: conversation.property,
    conversationId: conversation._id,
    content,
  });

  conversation.lastMessage = automatedMessage._id;
  await conversation.save();

  const messageForEmit = {
    ...automatedMessage.toObject(),
    sender: {
      _id: actorDoc._id,
      name: `${actorDoc.firstName || ""} ${actorDoc.lastName || ""}`.trim(),
      email: actorDoc.email,
      role: actorType,
      avatar: actorDoc.avatar || actorDoc.profilePic || null,
    },
  };
  emitToConversation(conversation._id, messageForEmit);

  return { automatedMessage, conversation };
};

// Accept tenant after inspection (Landlord only)
export const acceptTenant = async (req, conversationId) => {
  try {
    await dbConnect();
    const payload = await getUserFromToken();
    if (!payload?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const landlord = await Landlord.findById(payload.id);
    if (!landlord) return NextResponse.json({ error: "Only landlords can accept a tenant" }, { status: 403 });

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.some(p => p.toString() === payload.id))
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

    if (conversation.status !== "inspection")
      return NextResponse.json({ error: "Conversation is not in inspection stage" }, { status: 400 });

    const { automatedMessage, conversation: updated } = await updateConversationStatus(
      conversationId, "accepted", landlord, "Landlord",
      "The landlord has accepted you as a tenant. Congratulations! Further details will follow shortly."
    );

    return NextResponse.json({ success: true, message: automatedMessage, conversation: updated }, { status: 200 });
  } catch (err) {
    console.error("Accept tenant error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// Reject after inspection (either party)
export const rejectAfterInspection = async (req, conversationId) => {
  try {
    await dbConnect();
    const payload = await getUserFromToken();
    if (!payload?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const landlord = await Landlord.findById(payload.id);
    const tenant = await Tenant.findById(payload.id);
    const actor = landlord || tenant;
    const actorType = landlord ? "Landlord" : "Tenant";

    if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.some(p => p.toString() === payload.id))
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

    if (conversation.status !== "inspection")
      return NextResponse.json({ error: "Conversation is not in inspection stage" }, { status: 400 });

    const content = landlord
      ? "The landlord has decided not to proceed with this tenant after inspection."
      : "The tenant has decided not to proceed with this property after inspection.";

    const { automatedMessage, conversation: updated } = await updateConversationStatus(
      conversationId, "rejected", actor, actorType, content
    );

    return NextResponse.json({ success: true, message: automatedMessage, conversation: updated }, { status: 200 });
  } catch (err) {
    console.error("Reject after inspection error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// Cancel inspection (either party, before inspection happens)
export const cancelInspection = async (req, conversationId) => {
  try {
    await dbConnect();
    const payload = await getUserFromToken();
    if (!payload?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const landlord = await Landlord.findById(payload.id);
    const tenant = await Tenant.findById(payload.id);
    const actor = landlord || tenant;
    const actorType = landlord ? "Landlord" : "Tenant";

    if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.some(p => p.toString() === payload.id))
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

    if (conversation.status !== "inspection")
      return NextResponse.json({ error: "No active inspection to cancel" }, { status: 400 });

    const content = landlord
      ? "The landlord has cancelled the inspection."
      : "The tenant has cancelled the inspection.";

    const { automatedMessage, conversation: updated } = await updateConversationStatus(
      conversationId, "cancelled", actor, actorType, content
    );

    return NextResponse.json({ success: true, message: automatedMessage, conversation: updated }, { status: 200 });
  } catch (err) {
    console.error("Cancel inspection error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// Mark as completed (Landlord only, after accepted)
export const completeRental = async (req, conversationId) => {
  try {
    await dbConnect();
    const payload = await getUserFromToken();
    if (!payload?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const landlord = await Landlord.findById(payload.id);
    if (!landlord) return NextResponse.json({ error: "Only landlords can mark as completed" }, { status: 403 });

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.some(p => p.toString() === payload.id))
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

    if (conversation.status !== "accepted")
      return NextResponse.json({ error: "Conversation must be in accepted stage to complete" }, { status: 400 });

    const { automatedMessage, conversation: updated } = await updateConversationStatus(
      conversationId, "completed", landlord, "Landlord",
      "The rental process has been completed. Welcome to your new home!"
    );

    return NextResponse.json({ success: true, message: automatedMessage, conversation: updated }, { status: 200 });
  } catch (err) {
    console.error("Complete rental error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

// Broadcast a typing indicator to the other participant via SSE (no DB write)
export const sendTypingIndicator = async (req, conversationId) => {
  try {
    await dbConnect();
    const payload = await getUserFromToken();
    if (!payload?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.id;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.some(p => p.toString() === userId)) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const actor = await Tenant.findById(userId).lean() || await Landlord.findById(userId).lean();
    const senderName = actor
      ? `${actor.firstName || ""} ${actor.lastName || ""}`.trim()
      : "Someone";

    emitTyping(conversationId, senderName);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Typing indicator error:", err);
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

    // Notify the sender that their messages have been read
    if (result.modifiedCount > 0) {
      emitReadReceipt(conversationId, userId);
    }

    return NextResponse.json(
      { success: true, modifiedCount: result.modifiedCount },
      { status: 200 },
    );
  } catch (err) {
    console.error("Mark as read error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
