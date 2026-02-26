export const runtime = "nodejs";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose";
import { Conversation } from "../../../models/messageModel.js";
import cloudinary from "@/app/lib/cloudinary.js";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req, { params }) {
  try {
    // Auth
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userId;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      userId = payload.id;
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await params;

    await dbConnect();
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.some((p) => p.toString() === userId)) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only images (JPEG, PNG, WebP) and PDFs are allowed" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.byteLength > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "File must be 10MB or smaller" }, { status: 400 });
    }

    // Upload to Cloudinary using base64 data URI
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "messages",
      resource_type: "auto",
    });

    return NextResponse.json(
      { fileUrl: result.secure_url, fileType: file.type },
      { status: 200 }
    );
  } catch (err) {
    console.error("File upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
