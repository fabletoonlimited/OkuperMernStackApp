export const runtime = 'nodejs';

import dbConnect from "@/app/lib/mongoose";
import {loginLandlord} from "../controllers/landlord.controller.js";
import { NextResponse } from "next/server";

//Login Landlord
export async function POST(req) {
    try{
        await dbConnect();

        const body = await req.json();
        
        const {email, password} = body;
        
        if(!email || !password) {
            return NextResponse.json(
                { message: "Please input credentials" },
                { status: 400 }
            );
        }

        const result = await loginLandlord(body);

        return NextResponse.json(result, { status: 201 });
        
    } catch (error) {
        console.error("❌ API ERROR:", error);

        return NextResponse.json(
        { message: error.message || "Server error" },
        { status: 500 }
        ); 
    }
}