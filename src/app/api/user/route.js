export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import {createUserController,getUserController,getAllUserController,deleteUserController} from "../controllers/user.controller.js";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req) {
  console.log("➡️ POST /api/user hit");

  try {
    console.log("1️⃣ connecting to DB...");
    await dbConnect();
    console.log("2️⃣ DB connected");
    const body = await req.json();
    console.log("4️⃣ body:", body);

    if (!body.role || !body.residencyStatus || !body.whoIsUsingPlatform) {
      return NextResponse.json({ message: "Invalid user" }, { status: 400 });
    }

    const result = await createUserController(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("❌ API ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const user = await getUserController(id);
      return NextResponse.json(user, { status: 200 });
    }

    const user = await getAllUserController();
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteUserController(id);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}