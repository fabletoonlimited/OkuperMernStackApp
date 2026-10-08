import { NextResponse } from "next/server";
import { markMessagesAsRead } from "../../../controllers/messages.controller.js";

export const runtime = "nodejs";

export async function PATCH(request, { params }) {
  try {
    const { conversationId } = await params;

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    return await markMessagesAsRead(
      request,
      conversationId
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to mark messages as read",
      },
      { status: 500 }
    );
  }
}