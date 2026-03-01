export const runtime = "nodejs";

import { cancelInspection } from "../../../controllers/messages.controller.js";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { conversationId } = await params;
    return await cancelInspection(req, conversationId);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
