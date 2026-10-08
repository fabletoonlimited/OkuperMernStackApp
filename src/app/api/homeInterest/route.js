export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import dbConnect from "@/app/lib/mongoose";

import HomeInterest from "../models/homeInterestModel.js";
import Property from "../models/propertyModel.js";
import Tenant from "../models/tenantModel.js";


// GET ALL HOME INTERESTS FOR THE LOGGED-IN LANDLORD
export async function GET(request) {
    try {
        await dbConnect();

        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const landlordId = decoded.id;

        const properties = await Property.find({
            landlord: landlordId
        }).select("_id title landlord");

        const propertyIds = properties.map(
            (property) => property._id
        );

        if (propertyIds.length === 0) {
            return NextResponse.json(
                { homeInterests: [] },
                { status: 200 }
            );
        }

        const homeInterests = await HomeInterest.find({
            property: { $in: propertyIds }
        })
        .populate({
            path: "property",
            select:
                "previewPic title address price selectedTenant landlord"
        })
        .populate({
            path: "tenant",
            select: "-password",
            populate: {
                path: "tenantProfile"
            }
        })
        .sort({ createdAt: -1 });

        return NextResponse.json(
            { homeInterests },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                message:
                    error.message ||
                    "Failed to fetch home interests"
            },
            { status: 500 }
        );
    }
}


// SELECT TENANT FOR PROPERTY
export async function PUT(request) {
    try {
        await dbConnect();

        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const landlordId = decoded.id;

        const body = await request.json();

        const { propertyId, tenantId } = body;

        if (!propertyId || !tenantId) {
            return NextResponse.json(
                {
                    message:
                        "propertyId and tenantId are required"
                },
                { status: 400 }
            );
        }

        // Make sure this property belongs to this landlord
        const property = await Property.findOne({
            _id: propertyId,
            landlord: landlordId
        });

        if (!property) {
            return NextResponse.json(
                {
                    message:
                        "Property not found or does not belong to this landlord"
                },
                { status: 404 }
            );
        }

        // Make sure tenant exists
        const tenant = await Tenant.findById(tenantId);

        if (!tenant) {
            return NextResponse.json(
                {
                    message: "Tenant not found"
                },
                { status: 404 }
            );
        }

        // Make sure this tenant actually expressed
        // interest in this property
        const interest = await HomeInterest.findOne({
            property: propertyId,
            tenant: tenantId
        });

        if (!interest) {
            return NextResponse.json(
                {
                    message:
                        "This tenant did not express interest in this property"
                },
                { status: 404 }
            );
        }

        // -----------------------------------------
        // 1. SELECT TENANT ON PROPERTY
        // -----------------------------------------

        property.selectedTenant = tenant._id;
        property.tenant = tenant._id;

        await property.save();


        // -----------------------------------------
        // 2. ADD PROPERTY TO TENANT
        // -----------------------------------------

        const alreadyHasProperty = tenant.property.some(
            (id) => id.toString() === property._id.toString()
        );

        if (!alreadyHasProperty) {
            tenant.property.push(property._id);
        }


        // -----------------------------------------
        // 3. UPDATE propertyApplications
        // -----------------------------------------

        const existingApplication =
            tenant.propertyApplications.find(
                (application) =>
                    application.property.toString() ===
                    property._id.toString()
            );

        if (existingApplication) {
            existingApplication.isSelected = true;
        } else {
            tenant.propertyApplications.push({
                property: property._id,
                isSelected: true
            });
        }

        await tenant.save();


        // -----------------------------------------
        // 4. ACCEPT THIS HOME INTEREST
        // -----------------------------------------

        interest.status = "accepted";

        await interest.save();


        // -----------------------------------------
        // 5. REJECT OTHER INTERESTS FOR THIS PROPERTY
        // -----------------------------------------

        await HomeInterest.updateMany(
            {
                property: property._id,
                _id: { $ne: interest._id }
            },
            {
                $set: {
                    status: "rejected"
                }
            }
        );


        return NextResponse.json(
            {
                success: true,
                message: "Tenant selected successfully",
                propertyId: property._id,
                tenantId: tenant._id
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(
            "PUT /api/homeInterest error:",
            error
        );

        return NextResponse.json(
            {
                message:
                    error.message ||
                    "Failed to select tenant"
            },
            { status: 500 }
        );
    }
}