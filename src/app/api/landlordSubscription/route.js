export const runtime = "nodejs";

import Landlord from "@/app/api/models/landlordModel";
import { initializeSubscription, verifySubscription } from "@/app/lib/services/xPressSubscription";
import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        const landlord = await Landlord.findOne({ email });

        if (!landlord) {
            return NextResponse.json(
                { message: "Landlord not found" },
                { status: 404 }
            );
        }

        console.log("LANDLORD:", landlord);
        console.log("LANDLORD USER:", landlord.user);

        const payment = await initializeSubscription(
        {
            email: landlord.email,
            amount: "5000",
            currency: "NGN",
            plan: "basic",
            user: landlord.user.toString(),
        });

        return NextResponse.json(payment);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {message: error.message || "Server Error"},
            {status: 500}
        );
    }
}

// export async function POST(req) {
//   await dbConnect();

//   const { reference } = await req.json();

//   const result = await verifySubscription(reference);

//   return NextResponse.json(result);
// }
