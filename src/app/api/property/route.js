import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import Property from "../models/propertyModel.js";
import UtilityBill from "../models/utilityBillModel.js";
import { createProperty } from "../controllers/property.controller.js";
import mongoose from "mongoose";

// CREATE A PROPERTY Upload
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    let {
      // user,
      landlordId, previewPic, Img1, Img2, Img3, Img4, Img5, Img6, title, address, state, price, 
      legalFee, category, propertyType, bed, bath, savedHomes, unitsAvailable, rating, status, listedBy, 
      buildingAmenities, propertyAmenities, neighbourhoodPostcode, nearbyPlaces,agent, isVerified 
    } = body;
    
    if (!previewPic || !Img1 || !Img2 || !Img3) {
      return NextResponse.json(
      { message: "Please upload at least 3 images and a preview pic" }, 
      { status: 400 });
    }
    if (!title || !address || !state || !price || !category || !unitsAvailable || !bed || !bath || !listedBy || !buildingAmenities || !propertyAmenities || !neighbourhoodPostcode || !nearbyPlaces || !status) {
      return NextResponse.json(
      { message: "Missing required fields" }, 
      { status: 400 });
    }
    

    // Extract **just the URLs** if frontend sent objects
    const getUrl = (img) => (Array.isArray(img) ? img[0]?.url || img[0] : img);

    previewPic = getUrl(previewPic);
    Img1 = getUrl(Img1);
    Img2 = getUrl(Img2);
    Img3 = getUrl(Img3);
    Img4 = getUrl(Img4);
    Img5 = getUrl(Img5);
    Img6 = getUrl(Img6);


    // const formattedAddress = `${address.line1 || ""} ${address.line2 || ""}`.trim();
    const validPropertyType = propertyType === "Appartment" ? "Apartment" : propertyType;

    const newProperty = await createProperty({
      // user,
      landlordId,
      previewPic,
      Img1,
      Img2,
      Img3,
      Img4,
      Img5,
      Img6,
      title,
      address,
      state,
      price,
      legalFee,
      category,
      unitsAvailable,
      propertyType: validPropertyType,
      bed,
      bath,
      rating,
      status,
      listedBy,
      buildingAmenities,
      propertyAmenities,
      neighbourhoodPostcode,
      nearbyPlaces,
      agent,
      savedHomes: savedHomes ?? [],
      isVerified,
      utilityBillUploaded: false,
    });

    return NextResponse.json({
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
    }, { status: 201 });

  } catch (error) {
    console.error("Property creation error:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}

// GET PROPERTIES

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const landlordId = searchParams.get("landlordId");

    // Fetch a single property by ID.
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { message: "Invalid property ID" },
          { status: 400 }
        );
      }

      // Landlord-specific access: this branch should only be used
      // when the server has independently verified ownership.
      if (landlordId) {
        if (!mongoose.Types.ObjectId.isValid(landlordId)) {
          return NextResponse.json(
            { message: "Invalid landlord ID" },
            { status: 400 }
          );
        }

        const property = await Property.findOne({
          _id: id,
          landlord: landlordId,
        })
          .populate("landlord", "name email phone profilePic")
          .populate("utilityBill");

        if (!property) {
          return NextResponse.json(
            { message: "Property not found" },
            { status: 404 }
          );
        }

        return NextResponse.json(property, { status: 200 });
      }

      // Public property details require an uploaded utility bill.
      const property = await Property.findOne({
        _id: id,
        utilityBillUploaded: true,
      })
        .populate("landlord", "name email phone profilePic")
        .populate("utilityBill");

      if (!property) {
        return NextResponse.json(
          { message: "Property not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(property, { status: 200 });
    }

    // Landlord dashboard: show all properties belonging to this landlord.
    if (landlordId) {
      if (!mongoose.Types.ObjectId.isValid(landlordId)) {
        return NextResponse.json(
          { message: "Invalid landlord ID" },
          { status: 400 }
        );
      }

      const properties = await Property.find({
        landlord: landlordId,
      }).sort({ createdAt: -1 });

      return NextResponse.json(properties, { status: 200 });
    }

    // Public Rent, Buy and Shortlet listings:
    // fetch eligible properties from ALL landlords.
    const properties = await Property.find({
      utilityBillUploaded: true,
    })
      .populate("landlord", "name email phone profilePic")
      .sort({ createdAt: -1 });

    return NextResponse.json(properties, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Failed to fetch properties" },
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

    if (!_id && !listedBy) return NextResponse.json({ message: "Property ID or listedBy is required" }, { status: 400 });

    const query = _id ? { _id } : { listedBy };
    const updatedProperty = await Property.findOneAndUpdate(query, { $set: updateData }, { new: true, runValidators: true });

    if (!updatedProperty) return NextResponse.json({ message: "Property not found" }, { status: 404 });

    return NextResponse.json({ success: true, property: updatedProperty, message: "Property updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ API ERROR:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}

// DELETE PROPERTY
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ message: "Property ID is required" }, { status: 400 });

    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) return NextResponse.json({ message: "Property not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Property deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/property error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
