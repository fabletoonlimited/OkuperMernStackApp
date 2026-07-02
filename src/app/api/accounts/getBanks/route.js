import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose";
import {banks} from "@/app/data/banks"
import BankDetails from "@/app/api/models/bankDetailsModel.js";


//POST Account detals
export async function POST(req) {
  await dbConnect();

  try {
    const {landlordId, accountNo, bank} = await req.json();

    if (!landlordId) {
      return NextResponse.json(
        { message: "No Landlord Id provided" },
        { status: 400 },
      )
    }

    if (!accountNo) {
      return NextResponse.json(
        { message: "Please input your account Number" },
        { status: 400 },
      )
    }

    if (!bank) {
      return NextResponse.json(
        { message: "Please select your bank details" },
        { status: 400 },
      )
    }

    const result = await BankDetails.create({
      landlordId,
      accountNo,
      bank
    });

    return NextResponse.json(
    { message: "Bank added successfully", 
      bank: result },
    { status: 201 });
    
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Server error, something went wrong" },
      { status: 500 }
    );  
  };
};

// GET BANKS
export async function GET() {
  await dbConnect();

  try {
    return NextResponse.json({
      "responseCode":"00",
      "responseMessage": "successful",
      "data": banks,
    }
  );
  } catch (error) {
    return NextResponse.json(
      {message: error.message || "Server error, something went wrong"},
      { status: 500 }
    );  
  }
};
