import dbConnect from "@/app/lib/mongoose";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import HomeInterest from "../models/homeInterestModel.js";
import Property from "../models/propertyModel.js";


export async function POST(req) {   
    try {
        await dbConnect();
        const body = await req.json();

        const { propertyId } = req.params;
        const tenantId = body.tenantId; 
        const { firstName, lastName, message } = body;
        const email = body.email.trim().toLowerCase();

        if (!firstName || !lastName || !email || !message) {
            return NextResponse.json(
                { message: "All fields are required" }, 
                { status: 400 }
            );
        }

        //Create new Interest
        const newInterest = new HomeInterest({
            tenant: tenantId,
            property: propertyId,
            firstName,
            lastName,
            email,
            message
        });
        await Property.findByIdAndUpdate(propertyId, { 
            $push: { homeInterest: newInterest._id } 
        });
        await newInterest.save();

        return NextResponse.json({ message: "Interest expressed successfully" }, { status: 201 });
    }
    catch (error) {
        console.error("Error expressing interest:", error);
        return NextResponse.json({ message: "Failed to express interest" }, { status: 500 });
    }
}

// fetch interests for a property
export async function GET(req) {
    try {
        await dbConnect();

        const landlordProperties = await Property
        .find({ landlord: landlordId})
        .select('_id');

        const propertyIds = landlordProperties.map(p => p._id);

        const interests = await HomeInterest
        .find({ property: { $in: propertyIds } })
        .populate('tenant', 'firstName lastName email')
        .populate('property', 'title location price')
        .sort({ createdAt: -1 });

        return NextResponse.json(interests, { status: 200 });

    } catch (error) {
        console.error("Error fetching interests:", error);
        return NextResponse.json({ message: "Failed to fetch interests" }, 
            { status: 500 });
    }
}