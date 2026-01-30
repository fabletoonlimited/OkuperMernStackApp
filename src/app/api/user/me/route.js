export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import Landlord from "../../models/landlordModel.js";
import Tenant from "../../models/tenantModel.js";
import User from "../../models/userModel.js";

export async function GET() {
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

    // Try landlord first, then tenant
    let userId = null;
    let role = null;

    const landlord = await Landlord.findById(actorId).select("user");
    if (landlord) {
      userId = landlord.user;
      role = "landlord";
    } else {
      const tenant = await Tenant.findById(actorId).select("user");
      if (tenant) {
        userId = tenant.user;
        role = "tenant";
      }
    }

    // Strict validation: userId is required
    if (!userId) {
      return NextResponse.json(
        { message: "User link not found for authenticated actor" },
        { status: 500 }
      );
    }

    // Fetch user profile data
    const user = await User.findById(userId).select("referralCode referredBy");
    if (!user) {
      return NextResponse.json(
        { message: "User record not found" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        role,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("User /me fetch error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
