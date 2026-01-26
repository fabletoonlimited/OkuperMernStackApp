import {userRouter} from "next/navigation";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import Property from '../models/propertyModel.js';


//CREATE A PROPERTY
export async function POST(req) {

  try {
    await dbConnect();

    const body = await req.json();

    const {previewPic, Img1, Img2, Img3, Img4, Img5, Img6, title, address, price, category, propertyType, bed, bath, features, listedBy, savedHomes, unitsAvailable, rating} = body;

  if (!Img1 || !Img2 || !Img3 || !title || !address || !price || !category || !propertyType || !bed || !bath || !features || !listedBy) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  } 

  if (!previewPic) {
    return NextResponse.json(
      { message: "At least one preview Picture needs to be added" },
      { status: 400 }
    );
  } 

  if (existingProperty) {
    return NextResponse.json(
      { message: "Property already exists in Database, create another" }, 
      { status: 400 }
      );
    }

    //create New Property
    const newProperty = await Property.create({
      previewPic, 
      Img1, 
      Img2, 
      Img3, 
      Img4, 
      Img5, 
      Img6, 
      title, 
      address, 
      price, 
      category, 
      propertyType, 
      bed, 
      bath, 
      features, 
      listedBy, 
      savedHomes, 
      unitsAvailable, 
      rating
    });

    return NextResponse.json(
      { 
        success: true,
        property: {
          _id: newProperty._id,
          previewPic: newProperty.previewPic,
          title: newProperty.title,
          price: newProperty.price,
          category: newProperty.category,
          listedBy: newProperty.listedBy
        }, 
        message: "Property created successfully!"
      }, 
      {status: 201}
    );

  } catch (error) {
    console.error("Propert creation error:", error);
    return NextResponse.json(
      { message: error.message || "Server error, something went wrong" },
      { status: 500 }
    );
  }
}

//GET PROPERTIES
export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const listedBy = searchParams.get("listedBy");

    if (id) {
      const property = await Property
      .findById(id)
    
      if (!property) {
        return NextResponse.json(
          { message: "Property not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(property, { status: 200 });
    } 
  } catch (err) {
    return NextResponse.json(
        { message: err.message },
        { status: 500 }
    );
  }
}

// UPDATE PROPERTY
export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { listedBy, _id, ...updateData } = body;

    if (!_id && !listedBy) {
      return NextResponse.json(
        { message: "Property ID or listedBy is required" },
        { status: 400 }
      );
    }

    const query = _id ? { _id } : { listedBy };
    
    const updatedProperty = await Property
    .findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!updatedProperty) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        property: updatedProperty,
        message: "Property updated successfully" 
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

// PROPERTY LANDLORD
export async function PROPERTY(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Property ID is required" },
        { status: 400 }
      );
    }

    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Property deleted successfully" }, 
      { status: 200 }
    );

  } catch (err) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
