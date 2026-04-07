// /api/admin/invite/route.js

import crypto from "crypto";
import Invite from "@/app/api/models/inviteModel";
import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  // if (req.headers.get("x-admin-secret") !== process.env.JWT_SECRET) {
  //   return NextResponse.json(
  //     { message: "Unauthorized" }, 
  //     { status: 401 }
  //   );
  // }

  const { email, role } = await req.json();

   if (!email) {
    return NextResponse.json(
      { message: "Email and role required" },
      { status: 400 }
    );
  }
  
  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  await Invite.create({
    token: hashedToken,
    email: email.toLowerCase(),
    role,
    expiresAt: new Date(Date.now() + 1000 * 60 * 30), // 30 mins
  });

  return NextResponse.json({
    inviteLink: `${process.env.BASE_URL}/signUpAdmin?token=${rawToken}`,
  });
}