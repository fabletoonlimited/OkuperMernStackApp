export const runtime = 'nodejs';

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { initializePayment, verifyPayment } from "@/app/lib/services/xpressPayment";

//POST Payment initialization
export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();
        const res = await initializePayment(body);

        const { email, amount, transactionId } = body;

        if ( !email || !amount || !transactionId) {
        return NextResponse.json(
            { error: "Amount, email, and transactionId are required" },
            { status: 400 }
        );
    }
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
            { status: 500 });
    }
}