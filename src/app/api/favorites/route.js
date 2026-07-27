import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import Property from "../models/propertyModel.js";

import Favorite from "../models/favoriteModel.js";
import Tenant from "../models/tenantModel.js";

export async function POST(req) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const actorId = payload.id;

    const tenant = await Tenant.findById(actorId);

    if (!tenant) {
      return NextResponse.json(
        { message: "Only tenants can save favorites. Please sign in or register." },
        { status: 403 }
      );
    }

    const { propertyId } = await req.json();

    if (!propertyId) {
      return NextResponse.json(
        { message: "propertyId is required" },
        { status: 400 }
      );
    }

    const existing = await Favorite.findOne({
      userId: tenant.user,
      propertyId,
    });

    if (existing) {
      return NextResponse.json(
        { message: "Property already saved." },
        { status: 409 }
      );
    }

    const favorite = await Favorite.create({
      userId: tenant.user,
      propertyId,
    });

    return NextResponse.json(favorite, { status: 201 });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Property id is required" },
        { status: 400 }
      );
    }

    const property = await Property.findById(id)
      .populate("landlord", "name email phone profilePic")
      .populate("utilityBill");

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(property, { status: 200 });

  } catch (error) {
    console.error("GET /api/favorites error:", error);

    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}