import dbConnect from "@/app/lib/mongoose";
import cloudinary from "@/app/lib/cloudinary";
import { NextResponse } from "next/server";
import { getUserFromCookies } from "@/app/lib/auth/getUserFromCookies";
import Property from "@/app/api/models/propertyModel";
import UtilityBill from "@/app/api/models/utilityBillModel";
import Tenant from "@/app/api/models/tenantModel";

export async function POST(req) {
  try {
    await dbConnect();

    const user = await getUserFromCookies();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("utilityBill");

    if (!file) {
      return NextResponse.json(
        { error: "Missing File" },
        { status: 400 }
      );
    }

    // =====================================================
    // LANDLORD
    // =====================================================

    if (user.role === "landlord") {
      const propertyId = formData.get("propertyId");

      if (!propertyId) {
        return NextResponse.json(
          { error: "Missing Property ID for Landlord" },
          { status: 400 }
        );
      }

      // IMPORTANT:
      // Make sure this property actually belongs to
      // the currently logged-in landlord.
      const property = await Property.findOne({
        _id: propertyId,
        landlord: user.id,
      });

      if (!property) {
        return NextResponse.json(
          { error: "Property not found or does not belong to this landlord" },
          { status: 404 }
        );
      }

      // Convert file to Base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataUrl, {
        folder: "okuper/utilityBills",
        resource_type: "auto",
      });

      // Create utility bill specifically for this landlord/property
      const newUtilityBill = await UtilityBill.create({
        fileUrl: result.secure_url,
        property: property._id,
        uploadedBy: user.id,
        uploadedByModel: "Landlord",
      });

      // Your Property schema uses utilityBill as an array
      property.utilityBill = [newUtilityBill._id];

      await property.save();

      return NextResponse.json(
        {
          message: "Landlord utility bill uploaded successfully",
          url: result.secure_url,
          utilityBillId: newUtilityBill._id,
          property: property,
        },
        { status: 201 }
      );
    }

    // =====================================================
    // TENANT
    // =====================================================

    if (user.role === "tenant") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(dataUrl, {
        folder: "okuper/utilityBills",
        resource_type: "auto",
      });

      const newUtilityBill = await UtilityBill.create({
        fileUrl: result.secure_url,
        uploadedBy: user.id,
        uploadedByModel: "Tenant",
      });

      return NextResponse.json(
        {
          message: "Tenant utility bill uploaded successfully",
          url: result.secure_url,
          utilityBillId: newUtilityBill._id,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: "Invalid user role" },
      { status: 400 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Utility bill upload failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    const user = await getUserFromCookies();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // =====================================================
    // TENANT
    // =====================================================

    if (user.role === "tenant") {
      const utilityBill = await UtilityBill.findOne({
        uploadedBy: user.id,
        uploadedByModel: "Tenant",
      }).sort({ createdAt: -1 });

      return NextResponse.json({
        uploaded: !!utilityBill,
        url: utilityBill?.fileUrl || null,
      });
    }

    // =====================================================
    // LANDLORD
    // =====================================================

    if (user.role === "landlord") {
      // Get ONLY properties belonging to this landlord
      const properties = await Property.find({
        landlord: user.id,
      }).populate("utilityBill");

      // Find a utility bill belonging to one of this landlord's properties
      const propertyWithUtilityBill = properties.find(
        (property) =>
          Array.isArray(property.utilityBill) &&
          property.utilityBill.length > 0
      );

      const utilityBill =
        propertyWithUtilityBill?.utilityBill?.[
          propertyWithUtilityBill.utilityBill.length - 1
        ];

      return NextResponse.json({
        uploaded: !!utilityBill,
        url: utilityBill?.fileUrl || null,
        propertyId: propertyWithUtilityBill?._id || null,
      });
    }

    return NextResponse.json(
      { error: "Invalid user role" },
      { status: 400 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch utility bill" },
      { status: 500 }
    );
  }
}