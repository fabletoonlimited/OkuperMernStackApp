export const runtime = "nodejs";

import Landlord from "../controllers/landlord.controller"
import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();

        const {action, email, cardNo, cvv2, expDate} = body;

        if(!action || !email || !cardNo || !cvv2 || !expDate ) {
            return NextResponse.json(
            { message: "Missing required fields" },
            { status: 400 }
            );
        }
        const landlord = await Landlord.findOne({ email });

        return NextResponse.json({
        subscribed: landlord?.isSubscribed || false,
        });
        } catch (error) {
            console.error("Landlord subscription error:", error);
            return NextResponse.json(
              { message: error.message || "Server error, something went wrong" },
              { status: 500 }
            );
        }
    };
   