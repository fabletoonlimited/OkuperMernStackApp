import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import Property from "../models/propertyModel.js";
import mongoose from "mongoose";

// GET PROPERTY RATING
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");

    if (!propertyId) {
      return NextResponse.json(
        { message: "Property ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json(
        { message: "Invalid property ID" },
        { status: 400 }
      );
    }

    const property = await Property
    .findById(propertyId)
    .select("rating");

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        rating: property.rating ?? 0,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch rating" },
      { status: 500 }
    );
  }
}


// UPDATE PROPERTY RATING
export async function PUT(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { propertyId, rating } = body;

    if (!propertyId) {
      return NextResponse.json(
        { message: "Property ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json(
        { message: "Invalid property ID" },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);

    if (
      !Number.isFinite(numericRating) ||
      numericRating < 0 ||
      numericRating > 5
    ) {
      return NextResponse.json(
        { message: "Rating must be between 0 and 5" },
        { status: 400 }
      );
    }

    const property = await Property.findByIdAndUpdate(
      propertyId,
      {
        $set: {
          rating: numericRating,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("rating");

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        rating: property.rating,
        message: "Rating updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to update rating" },
      { status: 500 }
    );
  }
}