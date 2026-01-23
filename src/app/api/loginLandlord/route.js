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

        // Normalize email (trim and lowercase to match signup)
        const normalizedBody = {
            email: email.trim().toLowerCase(),
            password: password
        };

        const result = await loginLandlord(normalizedBody);

        // Return the response directly (it already has status and cookies)
        return result;
        
    } catch (error) {
        console.error("❌ API ERROR:", error);

        return NextResponse.json(
        { message: error.message || "Server error" },
        { status: 500 }
        ); 
    }
}