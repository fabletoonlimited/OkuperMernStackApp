import { NextResponse } from "next/server";
import { getConversationMessages } from "../../controllers/messages.controller.js";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  try {
    const { conversationId } = await params;

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    return await getConversationMessages(
      request,
      conversationId
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to fetch conversation messages",
      },
      { status: 500 }
    );
  }
}