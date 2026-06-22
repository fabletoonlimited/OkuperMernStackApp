export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { validateAndAssignReferral } from "@/app/lib/referralUtils.js";
import {
  signupLandlord,
  getLandlord,
  getAllLandlord,
  updateLandlord,
  deleteLandlord,
} from "../controllers/landlord.controller.js";
import Landlord from "@/app/api/models/landlordModel.js"

// CREATE LANDLORD
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const { userId, referralCode } = body;

    // Apply referral (optional; only if valid and not self-referred)
    await validateAndAssignReferral(userId, referralCode);

    const result = await signupLandlord(body);
    
    return NextResponse.json(result, 
      { status: result.status || 201 }
    );
  } catch (error) {
    console.error("Landlord creation error:", error);
    return NextResponse.json(
      { message: error.message || "Server error, something went wrong" },
      { status: 500 },
    );
  }
}

// GET LANDLORD(S)
export async function GET(request) {
  await dbConnect();

  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const landlord = await Landlord.findById(decoded.id).select("-password");

    if (!landlord) {
      return NextResponse.json({ message: "Landlord not found" }, { status: 404 });
    }

    return NextResponse.json(landlord, { status: 200 });

  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// UPDATE LANDLORD
export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const result = await updateLandlord(body);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error) {
    console.error("❌ API ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 },
    );
  }
}

// DELETE LANDLORD
export async function DELETE(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const result = await deleteLandlord({ id });
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

