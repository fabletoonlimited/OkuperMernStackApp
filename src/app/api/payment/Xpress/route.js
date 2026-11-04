export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { initializePayment, verifyPayment } from "@/app/lib/services/xpressPayment";
import Tenant from "@/app/api/models/tenantModel.js";
import Property from "@/app/api/models/propertyModel.js";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// POST: Initialize payment
export async function POST(req) {
    try {
        await dbConnect();

        // 1. Verify logged-in tenant
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Please sign in to continue." },
                { status: 401 }
            );
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);

        const tenant = await Tenant.findById(payload.id).populate("user", "email");

        if (!tenant || !tenant.user) {
            return NextResponse.json(
                { error: "Only registered tenants can make this payment." },
                { status: 403 }
            );
        }

        // 2. Get property ID from request
        const body = await req.json();
        const {
            propertyId,
            reference,
            amount,
            currency,
            isSplitpayment,
            legalFee,
            serviceCharge,
            splitPaymentReference,
        } = body;

        if (!propertyId || !reference || !currency || amount == null) {
            return NextResponse.json(
                { error: "Property, reference, amount and currency are required." },
                { status: 400 }
            );
        }

        if (
            typeof amount !== "number" ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            return NextResponse.json(
                { error: "Invalid payment amount." },
                { status: 400 }
            );
        }

        if (typeof isSplitpayment !== "boolean") {
            return NextResponse.json(
                { error: "Invalid split payment value." },
                { status: 400 }
            );
        }

        // 3. Find property
        const property = await Property.findById(propertyId);

        if (!property) {
            return NextResponse.json(
                { error: "Property not found." },
                { status: 404 }
            );
        }

        // 4. Confirm landlord selected this tenant
        const selectedTenantId = property.selectedTenant?.toString();

        if (selectedTenantId !== tenant._id.toString()) {
            return NextResponse.json(
                { error: "You have not been selected for this property." },
                { status: 403 }
            );
        }

        // 5. Prepare trusted payment information
        const paymentData = {
            ...body,
            property: [property._id],
            user: tenant.user._id.toString(),
            email: tenant.user.email,
            status: "Pending",
        };

        // 6. Initialize payment
        const response = await initializePayment(paymentData);

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error("Payment initialization error:", error);

        return NextResponse.json(
            { error: error.message || "Payment initialization failed." },
            { status: 500 }
        );
    }
}

// GET: Payment verification
export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const reference = searchParams.get("reference");

        if (!reference) {
            return NextResponse.json(
                { error: "Payment reference is required." },
                { status: 400 }
            );
        }

        const response = await verifyPayment(reference);

        return NextResponse.json(response);

    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Payment verification failed." },
            { status: 500 }
        );
    }
}