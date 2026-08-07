import dbConnect from "@/app/lib/mongoose";
import cloudinary from "@/app/lib/cloudinary";
import { NextResponse } from "next/server";
import Tenant from "@/app/api/models/tenantModel";
import Landlord from "@/app/api/models/landlordModel";
import { getUserFromCookies } from "@/app/lib/auth/getUserFromCookies";
import Property from "@/app/api/models/propertyModel"
import UtilityBill from "@/app/api/models/utilityBillModel";

export async function POST(req) {
    console.log("POST /api/uploads/utilityBill HIT");
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

    const propertyId = formData.get("propertyId");
console.log("Received propertyId:", propertyId);

    // Convert file to Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: "okuper/utilityBills",
      resource_type: "auto",
    });

    // Create a new utility bill document
    const newUtilityBill = await UtilityBill.create({
      fileUrl: result.secure_url,
      property: propertyId,
      uploadedBy: user.id,
      uploadedByModel: user.role === "tenant" ? "Tenant" : "Landlord",
    });

  // Save URL utility bill on the property and verify it
  const updatedProperty = await Property.findByIdAndUpdate(
  propertyId,
  {
    $set: {
      utilityBill: newUtilityBill._id,
      verified:true
    },
  },
  { new: true }
);

if (!updatedProperty) {
  return NextResponse.json(
    { error: "Property not found" },
    { status: 404 }
  );
}

return NextResponse.json({
  message: "File uploaded successfully",
  url: result.secure_url,
  property: updatedProperty,
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: error.message },
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

    if (user.role === "tenant") {
      const tenant = await Tenant.findById(user.id);

      return NextResponse.json({
        uploaded: !!tenant?.utilityBillUrl,
        url: tenant?.utilityBillUrl || null,
      });
    }

    if (user.role === "landlord") {
      const property = await Property.findOne({
        landlord: user.id,
      }).populate("utilityBill");
      
      const hasUtility = property?.utilityBill?.length > 0;

      console.log("UTILITY CHECK PROPERTY:", property);
      console.log("UTILITY BILL VALUE:", property?.utilityBill);

      return NextResponse.json({
        uploaded: hasUtility,
        url: hasUtility ?  property?.utilityBill[0].fileUrl : null,
      });
    }

    return NextResponse.json(
      { error: "Invalid user role" },
      { status: 400 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}