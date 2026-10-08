export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import Tenant from "../models/tenantModel.js";
import { validateAndAssignReferral } from "@/app/lib/referralUtils.js";
import jwt from "jsonwebtoken";

// CREATE TENANT
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const {
      userId,
      firstName,
      lastName,
      email,
      password,
      survey,
      terms,
      referralCode,
    } = body;

    if (
      !userId ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !terms
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if tenant already exists
    const existingTenant = await Tenant.findOne({
      email: trimmedEmail,
    });

    if (existingTenant) {
      return NextResponse.json(
        {
          success: false,
          exists: true,
          redirect: "/signInTenant",
          message:
            "Email already exists in Database, Please sign in",
        },
        { status: 409 }
      );
    }

    // Create new tenant
    const tenant = await Tenant.create({
      user: userId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: trimmedEmail,
      password,
      survey: survey || "",
      terms,
    });

    // Handle referral code if one was supplied
    if (referralCode?.trim()) {
      await validateAndAssignReferral(
        referralCode.trim(),
        tenant._id
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Tenant created successfully",
        tenant: {
          _id: tenant._id,
          user: tenant.user,
          firstName: tenant.firstName,
          lastName: tenant.lastName,
          email: tenant.email,
          isVerified: tenant.isVerified,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error.message ||
          "Server error, something went wrong",
      },
      { status: 500 }
    );
  }
}

// GET TENANT
export async function GET(request) {
  await dbConnect();

  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const tenant = await Tenant.findById(decoded.id)
      .select("-password")
      .populate("property");

    if (!tenant) {
      return NextResponse.json(
        { message: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      tenant,
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message:
          err.message ||
          "Failed to fetch tenant",
      },
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
        {
          message: "Tenant ID or email is required",
        },
        { status: 400 }
      );
    }

    const query = _id
      ? { _id }
      : { email: email.trim().toLowerCase() };

    const updatedTenant =
      await Tenant.findOneAndUpdate(
        query,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
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
        message: "Tenant updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error.message || "Server error",
      },
      { status: 500 }
    );
  }
}

// DELETE TENANT
export async function DELETE(request) {
  await dbConnect();

  try {
    const { searchParams } =
      new URL(request.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const deletedTenant =
      await Tenant.findByIdAndDelete(id);

    if (!deletedTenant) {
      return NextResponse.json(
        { message: "Tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Tenant deleted successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}