export const runtime = 'nodejs';

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { initializePayment, verifyPayment } from "@/app/lib/services/xpressPayment";

//POST Payment initialization
export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();

        const 
        { reference, email, amount, currency, status, 
            isSplitpayment, splitPaymentReference, user 
        } = body;

        if ( !reference || !email || !amount || !currency || !status || !user) {
        return NextResponse.json(
            { error: "Reference, Email, Amount, Currency and Status are required" },
            { status: 400 }
        );
    }
        const res = await initializePayment(body);

        return NextResponse.json(res);
    } catch (error) {
    return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
    );
  }
}

//GET Payment verification  
export async function GET(request) {
    try {   
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const reference = searchParams.get('reference');
      
        const response = await verifyPayment(reference);

        return NextResponse.json(response);

    } catch (error) {
        return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
    )};
};