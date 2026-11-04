
import dbConnect from "@/app/lib/mongoose";
import cloudinary from "@/app/lib/cloudinary";
import { NextResponse } from "next/server";
import { getUserFromCookies } from "@/app/lib/auth/getUserFromCookies";
import Property from "@/app/api/models/propertyModel";
import UtilityBill from "@/app/api/models/utilityBillModel";
import mongoose from "mongoose";

export async function POST(req) {
  let uploadResult;
  let newUtilityBill;

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

    if (!file || typeof file === "string" || !file.size) {
      return NextResponse.json(
        { error: "Please select a valid utility bill file." },
        { status: 400 }
      );
    }

    if (!["landlord", "tenant"].includes(user.role)) {
      return NextResponse.json(
        { error: "Invalid user role." },
        { status: 400 }
      );
    }

    let property = null;

    if (user.role === "landlord") {
      const propertyId = formData.get("propertyId");

      if (!propertyId || !mongoose.isValidObjectId(propertyId)) {
        return NextResponse.json(
          { error: "A valid Property ID is required." },
          { status: 400 }
        );
      }

      property = await Property.findOne({
        _id: propertyId,
        landlord: user.id,
      });

      if (!property) {
        return NextResponse.json(
          { error: "Property not found or does not belong to this landlord." },
          { status: 404 }
        );
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dataUrl = `data:${file.type || "application/octet-stream"};base64,${buffer.toString("base64")}`;

    uploadResult = await cloudinary.uploader.upload(dataUrl, {
      folder: "okuper/utilityBills",
      resource_type: "auto",
    });

    newUtilityBill = await UtilityBill.create({
      fileUrl: uploadResult.secure_url,
      ...(property ? { property: property._id } : {}),
      uploadedBy: user.id,
      uploadedByModel: user.role === "landlord" ? "Landlord" : "Tenant",
    });

    if (property) {
      const updatedProperty = await Property.findOneAndUpdate(
        {
          _id: property._id,
          landlord: user.id,
        },
        {
          $set: {
            utilityBill: [newUtilityBill._id],
            utilityBillUploaded: true,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedProperty || updatedProperty.utilityBillUploaded !== true) {
        throw new Error(
          "The utility bill was uploaded, but the property status could not be updated."
        );
      }

      return NextResponse.json(
        {
          message: "Landlord utility bill uploaded successfully.",
          url: uploadResult.secure_url,
          utilityBillId: newUtilityBill._id,
          property: {
            _id: updatedProperty._id,
            category: updatedProperty.category,
            utilityBillUploaded: updatedProperty.utilityBillUploaded,
          },
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        message: "Tenant utility bill uploaded successfully.",
        url: uploadResult.secure_url,
        utilityBillId: newUtilityBill._id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (newUtilityBill?._id) {
      await UtilityBill.findByIdAndDelete(newUtilityBill._id).catch(() => {});
    }

    if (uploadResult?.public_id) {
      await cloudinary.uploader
        .destroy(uploadResult.public_id, {
          resource_type: uploadResult.resource_type || "raw",
        })
        .catch(() => {});
    }

    return NextResponse.json(
      { error: error.message || "Utility bill upload failed." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
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
      const utilityBill = await UtilityBill.findOne({
        uploadedBy: user.id,
        uploadedByModel: "Tenant",
      }).sort({ createdAt: -1 });

      return NextResponse.json({
        uploaded: !!utilityBill,
        url: utilityBill?.fileUrl || null,
      });
    }

    if (user.role === "landlord") {
      const { searchParams } = new URL(req.url);
      const propertyId = searchParams.get("propertyId");

      if (propertyId) {
        if (!mongoose.isValidObjectId(propertyId)) {
          return NextResponse.json(
            { error: "Invalid Property ID." },
            { status: 400 }
          );
        }

        const property = await Property.findOne({
          _id: propertyId,
          landlord: user.id,
        }).populate("utilityBill");

        if (!property) {
          return NextResponse.json(
            { error: "Property not found or does not belong to this landlord." },
            { status: 404 }
          );
        }

        const bills = property.utilityBill || [];
        const utilityBill = bills[bills.length - 1];

        return NextResponse.json({
          uploaded: property.utilityBillUploaded === true,
          url: utilityBill?.fileUrl || null,
          propertyId: property._id,
          utilityBillUploaded: property.utilityBillUploaded,
        });
      }

      const properties = await Property.find({
        landlord: user.id,
      })
        .populate("utilityBill")
        .sort({ updatedAt: -1 });

      const propertyWithUtilityBill = properties.find(
        (item) => item.utilityBillUploaded === true
      );

      const bills = propertyWithUtilityBill?.utilityBill || [];
      const utilityBill = bills[bills.length - 1];

      return NextResponse.json({
        uploaded: !!propertyWithUtilityBill,
        url: utilityBill?.fileUrl || null,
        propertyId: propertyWithUtilityBill?._id || null,
        utilityBillUploaded:
          propertyWithUtilityBill?.utilityBillUploaded === true,
      });
    }

    return NextResponse.json(
      { error: "Invalid user role." },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch utility bill." },
      { status: 500 }
    );
  }
}
