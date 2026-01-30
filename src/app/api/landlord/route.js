export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import Landlord from "../models/landlordModel.js";
import { validateAndAssignReferral } from "@/app/lib/referralUtils.js";
// import {signupLandlord, getLandlord, getAllLandlord, updateLandlord, deleteLandlord} from "../controllers/landlord.controller.js"

// CREATE LANDLORD
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    
    const {userId, firstName, lastName, email, password, survey, terms, referralCode} = body;

    if (!userId || !firstName || !lastName || !email || !password || !terms) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    //Check if landlord Email Exists in DB
    const existingLandlord = await Landlord.findOne({ email: trimmedEmail });
    
    if (existingLandlord) {
      return NextResponse.json(
        { message: "Email already exists in Database, Please sign in" }, 
        { status: 400 }
      );
    }

    // Apply referral (optional; only if valid and not self-referred)
    await validateAndAssignReferral(userId, referralCode);

    //create New Landlord
    const newLandlord = await Landlord.create({
      user: userId, 
      firstName, 
      lastName, 
      email: trimmedEmail, 
      password, 
      survey,
      terms,
      isVerified: false,
      role: "landlord",
    });

    return NextResponse.json(
      { 
        success: true,
        landlord: {
          _id: newLandlord._id,
          firstName: newLandlord.firstName,
          lastName: newLandlord.lastName,
          email: newLandlord.email,
          isVerified: newLandlord.isVerified
        }, 
        message: "Landlord created successfully!"
      }, 
      {status: 201}
    );

  } catch (error) {
    console.error("Landlord creation error:", error);
    return NextResponse.json(
      { message: error.message || "Server error, something went wrong" },
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
    const email = searchParams.get("email");

    if (id) {
      const landlord = await Landlord
      .findById(id)
      .select("-password");

      if (!landlord) {
        return NextResponse.json(
          { message: "Landlord not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(landlord, { status: 200 });
    }

    if (email) {
      const landlord = await Landlord
      .findOne({ email })
      .select("-password");

      if (!landlord) {
        return NextResponse.json(
          { message: "Landlord not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(landlord, { status: 200 });
    }

    const landlords = await Landlord.find().select("-password");
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

    const { email, _id, ...updateData } = body;

    if (!_id && !email) {
      return NextResponse.json(
        { message: "Landlord ID or email is required" },
        { status: 400 }
      );
    }

    const query = _id ? { _id } : { email };
    
    const updatedLandlord = await Landlord.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedLandlord) {
      return NextResponse.json(
        { message: "Landlord not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        landlord: updatedLandlord,
        message: "Landlord updated successfully" 
      }, 
      { status: 200 }
    );

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

    const deletedLandlord = await Landlord.findByIdAndDelete(id);

    if (!deletedLandlord) {
      return NextResponse.json(
        { message: "Landlord not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Landlord deleted successfully" }, 
      { status: 200 }
    );

  } catch (err) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
