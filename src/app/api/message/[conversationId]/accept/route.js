export const runtime = "nodejs";

import { acceptTenant } from "../../../controllers/messages.controller.js";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { conversationId } = await params;
    return await acceptTenant(req, conversationId);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
