export const runtime = 'nodejs';

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { 
  initializePayment, 
  verifyPayment 
} from "@/app/lib/services/payment.service";

//POST Payment initialization
export async function POST(req) {
  try {
    const body = await req.json();

    await dbConnect();

    const res = await initializePayment(body);

    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//GET Payment verification  
export async function GET(request) {
    try {   
        const { searchParams } = new URL(request.url);
        const reference = searchParams.get('reference');
        await dbConnect();
        const response = await verifyPayment(reference);
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
  
}