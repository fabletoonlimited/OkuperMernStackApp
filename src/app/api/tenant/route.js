export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import Tenant from "../models/tenantModel.js";
import { validateAndAssignReferral } from "@/app/lib/referralUtils.js";
// import Tenant from "../controllers/tenant.controller";

// CREATE TENANT
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    
    const {userId, firstName, lastName, email, password, survey, terms, referralCode} = body;

    if (!userId || !firstName || !lastName || !email || !password || !terms) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    //Check if tenant Email Exists in DB
    const existingTenant = await Tenant.findOne({ email: trimmedEmail });
    
    if (existingTenant) {
      return NextResponse.json(
        { message: "Email already exists in Database, Please sign in" }, 
        { status: 400 }
      );
    }

    // Apply referral (optional; only if valid and not self-referred)
    await validateAndAssignReferral(userId, referralCode);

    //create New Tenant
    const newTenant = await Tenant.create({
      user: userId, 
      firstName, 
      lastName, 
      email: trimmedEmail, 
      password, 
      survey,
      terms,
      isVerified: false,
      role: "tenant",
    });

    return NextResponse.json(
      { 
        success: true,
        tenant: {
          _id: newTenant._id,
          firstName: newTenant.firstName,
          lastName: newTenant.lastName,
          email: newTenant.email,
          isVerified: newTenant.isVerified
        }, 
        message: "Tenant created successfully!"
      }, 
      {status: 201}
    );

  } catch (error) {
    console.error("Tenant creation error:", error);
    return NextResponse.json(
      { message: error.message || "Server error, something went wrong" },
      { status: 500 }
    );
  }
}

// GET TENANT(S)
export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (id) {
      const tenant = await Tenant.findById(id).select("-password");

      if (!tenant) {
        return NextResponse.json(
          { message: "Tenant not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(tenant, { status: 200 });
    }

    if (email) {
      const tenant = await Tenant.findOne({ email }).select("-password");

      if (!tenant) {
        return NextResponse.json(
          { message: "Tenant not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(tenant, { status: 200 });
    }

    const tenants = await Tenant.find().select("-password");
    return NextResponse.json(tenants, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}

// UPDATE TENANT
export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { email, _id, ...updateData } = body;

    if (!_id && !email) {
      return NextResponse.json(
        { message: "Tenant ID or email is required" },
        { status: 400 }
      );
    }

    const query = _id ? { _id } : { email };
    
    const updatedTenant = await Tenant.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedTenant) {
      return NextResponse.json(
        { message: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        tenant: updatedTenant,
        message: "Tenant updated successfully" 
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

// DELETE TENANT
export async function DELETE(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");


    if (!id) {
      return NextResponse.json(
        { message: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const deletedTenant = await Tenant.findByIdAndDelete(id);

    if (!deletedTenant) {
      return NextResponse.json(
        { message: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Tenant deleted successfully" }, 
      { status: 200 }
    );

  } catch (err) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
