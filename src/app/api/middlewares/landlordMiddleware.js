import jwt from "jsonwebtoken";
import Landlord from "../models/landlordModel.js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// 1. Authenticate landlord
export const authenticateLandlord = async (req) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return {
      error: true,
      response: NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      ),
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const landlord = await Landlord.findById(decoded.id);

    if (!landlord) {
      return {
        error: true,
        response: NextResponse.json(
          { message: "Landlord not found" },
          { status: 401 }
        ),
      };
    }

    return {
      error: false,
      landlord: {
        _id: landlord._id,
        email: landlord.email,
        admin: landlord.admin || false,
      },
    };
  } catch (err) {
    return {
      error: true,
      response: NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      ),
    };
  }
};
