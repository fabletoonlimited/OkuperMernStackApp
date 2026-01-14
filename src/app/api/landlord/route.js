export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { createLandlordController, getLandlordController, getAllLandlordController, updateLandlordController, deleteLandlordController} from "../controllers/landlord.controller.js";
import { NextResponse } from "next/server";

// CREATE LANDLORD
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "terms",
    ];

    const missing = requiredFields.some((f) => !body[f]);
    if (missing) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await createLandlordController(body);
    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error("❌ API ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

// GET LANDLORD(S)
export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const landlord = await getLandlordController({ _id: id });

      if (!landlord) {
        return NextResponse.json(
          { message: "Landlord not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(landlord, { status: 200 });
    }

    const landlords = await getAllLandlordController();
    return NextResponse.json(landlords, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}

// UPDATE LANDLORD
export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body || !body._id) {
      return NextResponse.json(
        { message: "Landlord ID is required" },
        { status: 400 }
      );
    }

    const result = await updateLandlordController(body);
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("❌ API ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

// DELETE LANDLORD
export async function DELETE(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Landlord ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteLandlordController(id);
    return NextResponse.json(result, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
