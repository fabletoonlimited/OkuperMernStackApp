export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import {createDispute, getTenantDispute, updateDisputeStatus, deleteDispute} from "@/app/api/controllers/disputes.controller.js";

// Create Dispute
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    const result = await createDispute(body);

    return NextResponse.json(
      {
        message: "Dispute created successfully",
        dispute: result,
      },
      { status: 201 }
    );
    } catch (error) {
    return NextResponse.json(
        {message: error.message || "Server error, something went wrong"},
        { status: 500 }
    );
  }
}

// Get Tenant Disputes
export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);

    const tenantId = searchParams.get("tenantId");

    const result = await getTenantDispute(tenantId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Server error, something went wrong",
      },
      { status: 500 }
    );
  }
}

// Update Dispute Status
export async function PUT(req) {
  await dbConnect();

  try {
    const body = await req.json();

    const { disputeId, status } = body;

    const result = await updateDisputeStatus(disputeId, status);

    return NextResponse.json(
      {
        message: "Dispute status updated successfully",
        dispute: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Server error, something went wrong",
      },
      { status: 500 }
    );
  }
}

// Delete Dispute
export async function DELETE(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);

    const disputeId = searchParams.get("disputeId");

    await deleteDispute(disputeId);

    return NextResponse.json(
      {
        message: "Dispute deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Server error, something went wrong",
      },
      { status: 500 }
    );
  }
}   