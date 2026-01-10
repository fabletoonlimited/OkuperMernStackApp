import {
  createUser,
  getUser,
  getAllUsers,
  deleteUser,
} from "../controllers/user.controller.js";
import { NextResponse } from "next/server";
import { connectDB } from "../lib/db.js";

export async function POST(req) {
  await connectDB();
  return createUser(req);
}

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (type === "getUser") {
    return getUser(req);
  } else if (type === "getAllUsers") {
    return getAllUsers(req);
  } else {
    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }
}

export async function DELETE(req) {
  await connectDB();
  return deleteUser(req);
}
