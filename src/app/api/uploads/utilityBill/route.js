import dbConnect from "@/app/lib/mongoose";
import cloudinary from "@/app/lib/cloudinary";
import { NextResponse } from "next/server";
import Tenant from "@/app/api/models/tenantModel";
import Landlord from "@/app/api/models/landlordModel";
import { getUserFromCookies } from "@/app/lib/auth/getUserFromCookies";

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

    // Convert file to Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: "okuper/utilityBills",
      resource_type: "auto",
    });

    // Save URL
    if (user.role === "tenant") {
      await Tenant.findByIdAndUpdate(user.id, {
        utilityBillUrl: result.secure_url,
      });
    } else if (user.role === "landlord") {
      await Landlord.findByIdAndUpdate(user.landlord, {
        utilityBillUrl: result.secure_url,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid user role" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "File uploaded successfully",
      url: result.secure_url,
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

    console.log("Role:", user.role);

    let utilityBillUrl = null;

    if (user.role === "tenant") {
      const tenant = await Tenant.findById(user.id);

      console.log("Tenant utility bill:", tenant?.utilityBillUrl);

      utilityBillUrl = tenant?.utilityBillUrl;
    } else if (user.role === "landlord") {
      const landlord = await Landlord.findById(user.id);

      console.log("Landlord utility bill:", landlord?.utilityBillUrl);

      utilityBillUrl = landlord?.utilityBillUrl;
    } else {
      return NextResponse.json(
        { error: "Invalid user role" },
        { status: 400 }
      );
    }

    console.log("Final utilityBillUrl:", utilityBillUrl);

    return NextResponse.json({
      uploaded: !!utilityBillUrl,
      url: utilityBillUrl,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}