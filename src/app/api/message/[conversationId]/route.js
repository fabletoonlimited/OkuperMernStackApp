import { getConversationMessages } from "../../controllers/messages.controller.js";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { conversationId } = await params;
    const result = await getConversationMessages(req, conversationId);
    return result;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
