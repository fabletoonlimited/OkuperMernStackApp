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


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const property = await propertyModel.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    return res.json(property);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching property', error });
  }
});

router.get('/filter', async (req, res) => {

  const { status, price, bedroom, type } = req.query;

  const filter = {};

  if (status) filter.status = status;
  if (bedroom) filter.bedroom = parseInt(bedroom);
  if (type) filter.type = type;

  if (price) {
    const [min, max] = price.split('-').map(Number);
    filter.price = { $gte: min, $lte: max };
  }

  try {
    const properties = await propertyModel.find(filter).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch properties', error });
  }
});