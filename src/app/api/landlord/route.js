export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { createLandlordController, getLandlordController, getAllLandlordController, updateLandlordController, deleteLandlordController} from "../controllers/landlord.controller.js";

// CREATE LANDLORD
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    
    const {firstName, lastName, email, password, survey, terms, isVerified} = body;

    if (!userId || !firstName || !lastName || !email || !password || !terms) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 401 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    //Check if userId Exists in DB
     const existingUserById = await dbConnect.user.findUnique({
      where: {userId: userId}
    });
    if (existingUserById) {
      return NextResponse.json(
        { message: "User does not belong to this Landlord"}, { status: 401 }
      );
    }
    //Check if landlord Email Exists in DB
    const existingLandlordEmail = await dbConnect.landlord.findUnique({
      where: {email: trimmedEmail}
    });
    if (existingLandlordEmail) {
      return NextResponse.json(
        { message: "Email already exists in Database, Please sign in" }, { status: 401 }
      );
    }

    //create New Landlord
    const newLandlord = await createLandlordController.create({
      data: {
        user: userId, 
        firstName, 
        lastName, 
        email: trimmedEmail, 
        password, 
        terms,
        isVerified: false,
        role: "landlord",
      }
    })

    await newLandlord.save()

    return NextResponse.json(
      {success: true},
      { landlord: newLandlord, message: "Landlord created sucessfully!"}, 
      {status: 201}
  );

  } catch (error) {
    return NextResponse.json(
      { message: "Server error, something went wrong" },
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
