export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import cloudinary from "@/app/lib/cloudinary";
import streamifier from "streamifier";
import TenantKyc from "@/app/api/models/tenantKycModel.js";

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "Bills_and_id", resource_type: "auto" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { message: "File is required" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadToCloudinary(buffer);

    return NextResponse.json(
      { success: true, url: result.secure_url, publicId: result.public_id },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile upload error:", error);
    return NextResponse.json(
      { message: error.message || "Upload failed" },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const tenantId = decoded.payload.id;

    const tenantKyc = await TenantKyc.findOne({ tenant: tenantId });

    if (!tenantKyc) {
      return NextResponse.json({ message: "Tenant KYC not found" }, { status: 404 });
    }

    return NextResponse.json(tenantKyc, { status: 200 });
  } catch (error) {
    console.error("KYC fetch error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch KYC" },
      { status: 500 },
    );
  }
}
