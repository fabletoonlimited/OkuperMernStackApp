export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { createTenant, loginTenant, getTenant, getAllTenant, updateTenant, deleteTenant } from "../controllers/tenant.controller.js";
import { NextResponse } from "next/server";


    // Dispatch based on fields: Signup has firstName, Login does not
    if (body.firstName) {
      return await signupTenant(req, body);
    } else {
      return await loginTenant(req, body);
    }
  } catch (error) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const auth = await authenticateTenant(req);
  if (auth.error) return auth.response;

  if (type === "all") {
    return await getAllTenant(req);
  } else {
    return await getTenant(req, auth.tenant);
  }
}

export async function DELETE(req) {
  await connectDB();
  const auth = await authenticateTenant(req);
  if (auth.error) return auth.response;
  return await deleteTenant(req);
}
