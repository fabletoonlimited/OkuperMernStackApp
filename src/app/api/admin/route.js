export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import {
  signupAdmin,
  getAdmin,
  getAllAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/admin.controller.js";

// CREATE ADMIN
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const result = await signupAdmin(body);
    return NextResponse.json(result, { status: result.status || 201 });
  } catch (error) {
    console.error("Landlord creation error:", error);
    return NextResponse.json(
      { message: error.message || "Server error, something went wrong" },
      { status: 500 },
    );
  }
}

// GET ADMIN(S)
export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (id || email) {
      const result = await getAdmin({ id, email });
      return NextResponse.json(result, { status: result.status || 200 });
    }

    const result = await getAllAdmin();
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// UPDATE ADMIN
export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const result = await updateAdmin(body);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error) {
    console.error("❌ API ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 },
    );
  }
}

// DELETE ADMIN
export async function DELETE(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const result = await deleteAdmin({ id });
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
