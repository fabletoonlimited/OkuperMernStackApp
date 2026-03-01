export const runtime = "nodejs";

import { completeRental } from "../../../controllers/messages.controller.js";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { conversationId } = await params;
    return await completeRental(req, conversationId);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
