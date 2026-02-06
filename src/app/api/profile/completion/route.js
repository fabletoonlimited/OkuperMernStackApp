export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getProfileByActorId } from "@/app/lib/profileData";
import { computeProfileCompletion } from "@/app/lib/profileCompletion";

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

    const completion = computeProfileCompletion(result.profile, result.role);

    return NextResponse.json(
      {
        success: true,
        role: result.role,
        percent: completion.percent,
        missingFields: completion.missingFields,
        profile: result.profile,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile completion error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
