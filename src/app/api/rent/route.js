export const runtime = 'nodejs';

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import Listing from '../controllers/property.controller.js';


//GET PROPERTIES
export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const listedBy = searchParams.get("listedBy");

    if (id) {
      const listing = await Listing
      .findById(id)
    
      if (!listing) {
        return NextResponse.json(
          { message: "Listing not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(listing, { status: 200 });
    } 
  } catch (err) {
    return NextResponse.json(
        { message: err.message },
        { status: 500 }
    );
  }
}
