export const runtime = "nodejs";

import { rejectAfterInspection } from "../../../controllers/messages.controller.js";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { conversationId } = await params;
    return await rejectAfterInspection(req, conversationId);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
