export const runtime = "nodejs";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import dbConnect from "@/app/lib/mongoose";
import { Conversation } from "../../models/messageModel.js";
import {
  registerConnection,
  removeConnection,
} from "@/app/lib/sseStore.js";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return new Response(JSON.stringify({ error: "conversationId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Verify auth
  let userId;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const { payload } = await jwtVerify(token, JWT_SECRET);
    userId = payload.id;
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Verify user is a participant
  try {
    await dbConnect();
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.some((p) => p.toString() === userId)) {
      return new Response(JSON.stringify({ error: "Conversation not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Open SSE stream
  let controller;
  const stream = new ReadableStream({
    start(c) {
      controller = c;
      registerConnection(conversationId, controller);

      // Send an initial keep-alive comment so the browser confirms connection
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(": connected\n\n"));
    },
    cancel() {
      removeConnection(conversationId, controller);
    },
  });

  // Clean up when client disconnects
  req.signal.addEventListener("abort", () => {
    removeConnection(conversationId, controller);
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // disable Nginx buffering if behind a proxy
    },
  });
}
