export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getProfileByActorId } from "@/app/lib/profileData";
import Landlord from "../models/landlordModel.js";
import Tenant from "../models/tenantModel.js";
import LandlordKyc from "../models/landlordKycModel.js";
import TenantKyc from "../models/tenantKycModel.js";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const actorIdParam = searchParams.get("actorId");

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET),
    );

    const actorId = actorIdParam || payload?.id;
    if (!actorId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const result = await getProfileByActorId(actorId);
    if (!result) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        role: result.role,
        profile: result.profile,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

const buildKycUpdate = (payload, role, actor) => {
  const documentImage =
    payload.documentImage || payload.profilePic || payload.avatar;
  const companyAddress = Array.isArray(payload.companyAddress)
    ? payload.companyAddress
    : payload.companyAddress
      ? payload.companyAddress
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : undefined;
  const numberOfChildren =
    payload.numberOfChildren !== undefined && payload.numberOfChildren !== ""
      ? Number(payload.numberOfChildren)
      : undefined;

  const base = {
    previewPic: documentImage,
    phone: payload.phone,
    documentType: payload.documentType,
    idNumber: payload.idNumber,
    gender: payload.gender,
    age: payload.age,
    occupation: payload.occupation,
    maritalStatus: payload.maritalStatus,
    spouseName: payload.spouseName,
    noOfChildren: numberOfChildren,
    religion: payload.religion,
    companyName: payload.companyName,
    companyAddress,
    companyPhone: payload.companyPhone,
    companyEmail: payload.companyEmail,
    city: payload.city,
    state: payload.state,
    country: payload.country,
    zipCode: payload.zipCode,
  };

  if (role === "landlord") {
    base.currentHomeAddress = payload.currentAddress;
    base.user = actor.user;
    base.landlord = actor._id;
    base.landlordDashboard = actor.landlordDashboard;
  } else {
    base.currentAddress = payload.currentAddress;
    base.user = actor.user;
    base.tenant = actor._id;
    base.tenantDashboard = actor.tenantDashboard;
  }

  Object.keys(base).forEach((key) => {
    if (base[key] === undefined) {
      delete base[key];
    }
  });

  return base;
};

export async function PUT(request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET),
    );

    const actorId = payload?.id;
    if (!actorId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, email } = body;

    const landlord = await Landlord.findById(actorId);
    const tenant = landlord ? null : await Tenant.findById(actorId);
    const role = landlord ? "landlord" : tenant ? "tenant" : null;

    if (!role) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 },
      );
    }

    const actor = landlord || tenant;
    const coreUpdate = {};
    if (firstName !== undefined) coreUpdate.firstName = firstName;
    if (lastName !== undefined) coreUpdate.lastName = lastName;
    if (email !== undefined) coreUpdate.email = email;

    if (Object.keys(coreUpdate).length > 0) {
      if (role === "landlord") {
        await Landlord.findByIdAndUpdate(actorId, coreUpdate, {
          new: true,
          runValidators: true,
        });
      } else {
        await Tenant.findByIdAndUpdate(actorId, coreUpdate, {
          new: true,
          runValidators: true,
        });
      }
    }

    const kycUpdate = buildKycUpdate(body, role, actor);
    if (Object.keys(kycUpdate).length > 0) {
      if (role === "landlord") {
        await LandlordKyc.findOneAndUpdate(
          { landlord: actorId },
          { $set: kycUpdate },
          {
            new: true,
            upsert: true,
            runValidators: false,
            setDefaultsOnInsert: false,
          },
        );
      } else {
        await TenantKyc.findOneAndUpdate(
          { tenant: actorId },
          { $set: kycUpdate },
          {
            new: true,
            upsert: true,
            runValidators: false,
            setDefaultsOnInsert: false,
          },
        );
      }
    }

    const updated = await getProfileByActorId(actorId);
    return NextResponse.json(
      { success: true, role: updated?.role, profile: updated?.profile },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
