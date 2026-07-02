import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose";
import jwt from "jsonwebtoken";
import BankDetails from "../../models/bankDetailsModel";


export async function GET(req) {

  await dbConnect();

  try {

    const token = req.cookies.get("token")?.value;

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


    const bankDetails = await BankDetails.findOne({
      landlord: decoded.id
    });


    return NextResponse.json({
      bankDetails
    });


  } catch(error){

    return NextResponse.json(
      {
        message:error.message
      },
      {
        status:500
      }
    );
  }
}