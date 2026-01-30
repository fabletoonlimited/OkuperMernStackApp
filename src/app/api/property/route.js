import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import {createProperty} from '../controllers/property.controller.js';


//CREATE A PROPERTY
export async function POST(req) {

  try {
    await dbConnect();

    const body = await req.json();

    const {landlord, user, previewPic, Img1, Img2, Img3, Img4, Img5, Img6, title, address, price, category, propertyType, bed, bath, features, listedBy, savedHomes, unitsAvailable, rating, isVerified} = body;

    if (!previewPic) {
      return NextResponse.json(
        { message: "At least one preview picture needs to be added" },
        { status: 400 }
      );
    } 

    if (!Img1 || !Img2 || !Img3) {
      return NextResponse.json(
        { message: "Upload at least three images" },
        { status: 400 }
      );
    } 

    if (!title) {
      return NextResponse.json(
        { message: "Please add a title to your property." },
        { status: 400 }
      );
    } 

    if (!address) {
      return NextResponse.json(
        { message: "Kindly add an address to your property." },
        { status: 400 }
      );
    }

    if (!price) {
      return NextResponse.json(
        { message: "Kindly add an price to your property." },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { message: "Kindly add your property to a category." },
        { status: 400 }
      );
    }

    if (!unitsAvailable) {
      return NextResponse.json(
        { message: "Please input how many of this property is available." },
        { status: 400 }
      );
    } 

    if (!bed) {
      return NextResponse.json(
        { message: "Kindly add number of bed to your property." },
        { status: 400 }
      );
    }

    if (!bath) {
      return NextResponse.json(
        { message: "Kindly add number of bath to your property." },
        { status: 400 }
      );
    }

    if (!features) {
      return NextResponse.json(
        { message: "Kindly add property features." },
        { status: 400 }
      );
    }

    if (!listedBy) {
      return NextResponse.json(
        { message: "Kindly add name of who is listing this property" },
        { status: 400 }
      );
    } 

    // if (existingProperty) {
    //   return NextResponse.json(
    //     { message: "This property already exists in Database, create another." }, 
    //     { status: 400 }
    //   );
    // }

    //create New Property
    const newProperty = await createProperty({
      user,
      landlord,
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
      unitsAvailable, 
      propertyType, 
      bed, 
      bath,
      rating,
      listedBy, 
      features: //"buildingAmenities", "propertyAmenities", "neighbourhoodPostcode", "nearbyPlaces", 
      savedHomes, 
      rating,
      isVerified
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

    if (id || listedBy) {
      const property = await Property
      .findById(id)
    
    if (!property || !listedBy) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }
      return NextResponse.json(property, listedBy, { status: 200 });
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

// DELETE Prperty
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
