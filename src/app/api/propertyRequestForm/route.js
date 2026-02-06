import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import PropertyRequestForm from "../models/propertyRequestFormModel.js";

// CREATE A PROPERTY REQUEST
export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();

        const { firstName, phone, message, propertyId, tenantId } = body;

        // Validate required fields
        if (!firstName || !phone || !message || !propertyId || !tenantId) 
            {
                return NextResponse.json(
                { message: "Missing required fields" }, 
                { status: 400 });
            }

        const newRequest = await PropertyRequestForm.create({
            firstName,
            phone,
            message,
            propertyId,
            tenantId,
        });

        return NextResponse.json(
            {   message: "Request submitted successfully", 
                request: newRequest 
            }, 
            { status: 201 }
        );

    } catch (error) {
        console.error("Property request creation error:", error);
        return NextResponse.json(
            { message: error.message || "Server error" }, 
            { status: 500 }
        );
    }   
}