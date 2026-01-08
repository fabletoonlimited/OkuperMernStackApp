import { NextResponse } from "next/server";
import {connectDB} from "@/app/lib/db";
import {createUserController, getUserController, getAllUserController, deleteUserController} from "../controllers/user.controller";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const user = await createUserController(body);
    return NextResponse.json(user, { status: 201 });
    
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function GET(request) {
  await connectDB();

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
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const result = await deleteUserController(id);
    return NextResponse.json(result, { status: 200 });

  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
