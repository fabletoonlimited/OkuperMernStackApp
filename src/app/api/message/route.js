import { sendMessage } from "../controllers/messages.controller.js";
import { getConversations } from "../controllers/messages.controller.js";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const result = await getConversations(req);
    return result;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const result = await sendMessage(req);
    return result;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}