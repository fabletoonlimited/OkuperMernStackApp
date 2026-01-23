import { NextResponse } from "next/server";
import { logoutLandlord } from "../../controllers/landlord.controller.js";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });

  res.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return res;
}
