import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose";
import jwt from "jsonwebtoken";
import {banks} from "@/app/data/banks"
import BankDetails from "../../models/bankDetailsModel";


export async function GET(req) {

  await dbConnect();

  try {

    const token = req.cookies.get("token")?.value;
console.log("BANKS:", banks);
console.log("TOTAL BANKS:", banks.length);
    if (!token) {
      return NextResponse.json(
        {message:"Unauthorized"},
        {status:401}
      );
    }


    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

console.log("Decoded ID:", decoded.id);

    const bankDetails = await BankDetails.findOne({
      landlord: decoded.id
    });

console.log("Found bank details:", bankDetails);
    return NextResponse.json({
      bankDetails,
      data: banks,
    });


  } catch(error){

    return NextResponse.json(
      {message:error.message},
      {status:500}
    );
  }
}