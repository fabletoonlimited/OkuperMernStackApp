export const runtime = "nodejs";

import { sendTypingIndicator } from "../../../controllers/messages.controller.js";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { conversationId } = await params;
    return await sendTypingIndicator(req, conversationId);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
