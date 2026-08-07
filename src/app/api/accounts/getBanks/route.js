import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose";
import {banks} from "@/app/data/banks"
import BankDetails from "@/app/api/models/bankDetailsModel.js";


//POST Account detals
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose";
import { banks } from "@/app/data/banks";
import BankDetails from "@/app/api/models/bankDetailsModel.js";

export async function POST(req) {
  try {
    await dbConnect();

    const { landlord, accountNo, bank } = await req.json();

    if (!landlord) {
      return NextResponse.json(
        { message: "No landlord ID provided" },
        { status: 400 }
      );
    }

    if (!accountNo) {
      return NextResponse.json(
        { message: "Please enter your account number" },
        { status: 400 }
      );
    }

    if (!bank) {
      return NextResponse.json(
        { message: "Please select a bank" },
        { status: 400 }
      );
    }

    console.log("Saving bank details...");
console.log("Landlord:", landlord);
console.log("Account:", accountNo);
console.log("Bank:", bank);

    const bankDetails = await BankDetails.findOneAndUpdate(
      { landlord },
      {
        accountNo,
        bank,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Bank details saved successfully",
        bankDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Bank save error:", error);

    return NextResponse.json(
      {
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}

// GET BANKS
export async function GET() {
  try {
    await dbConnect();

    return NextResponse.json(
      {
        responseCode: "00",
        responseMessage: "successful",
        data: banks,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}

// GET BANKS
export async function GET() {

  try {
    await dbConnect();
    
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
