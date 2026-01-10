import { NextResponse } from "next/server";
import { connectDB } from "../lib/db.js";
import {
  signupLandlord,
  loginLandlord,
  getLandlord,
  getAllLandlord,
  updateLandlord,
  deleteLandlord,
} from "../controllers/landlord.controller.js";
import { authenticateLandlord } from "../middlewares/landlordMiddleware.js";

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();

    // Dispatch based on fields: Signup has firstName, Login does not
    if (body.firstName) {
      return await signupLandlord(req, body);
    } else {
      return await loginLandlord(req, body);
    }
  } catch (error) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const auth = await authenticateLandlord(req);
  if (auth.error) return auth.response;

  if (type === "all") {
    return await getAllLandlord(req);
  } else {
    return await getLandlord(req, auth.landlord);
  }
}

export async function DELETE(req) {
  await connectDB();
  const auth = await authenticateLandlord(req);
  if (auth.error) return auth.response;
  return await deleteLandlord(req);
}
