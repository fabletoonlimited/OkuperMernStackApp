import { proceedWithInspection } from "../../../controllers/messages.controller.js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function PATCH(req, { params }) {
  try {
    const { conversationId } = await params;
    const result = await proceedWithInspection(req, conversationId);
    return result;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
