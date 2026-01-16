import jwt from "jsonwebtoken";
import Tenant from "../models/tenantModel.js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// 1. Authenticate tenant
export const authenticateTenant = async (req) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { error: true, response: NextResponse.json({ message: "No token provided" }, { status: 401 }) };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tenant = await Tenant.findById(decoded.id);

    if (!tenant) {
      return { error: true, response: NextResponse.json({ message: "Tenant not found" }, { status: 401 }) };
    }

    return {
      error: false,
      tenant: {
      _id: tenant._id,
      email: tenant.email,
      admin: tenant.admin || false,
      }
    };
  } catch (err) {
    return { error: true, response: NextResponse.json({ message: "Invalid or expired token" }, { status: 401 }) };
  }
};
