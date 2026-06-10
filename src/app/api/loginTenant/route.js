// Login Tenant
export const runtime = 'nodejs';

import dbConnect from "@/app/lib/mongoose";
import { loginTenant } from "../controllers/tenant.controller.js";
import { NextResponse } from "next/server";

export async function POST(req) {
    try{
        await dbConnect();

        const body = await req.json();
        
        const {email, password} = body;
        
        if(!email) {
            return NextResponse.json(
                { message: "Please input your email" },
                { status: 400 }
            );
        }

        if(!password) {
            return NextResponse.json(
                { message: "Please input password" },
                { status: 400 }
            );
        }

        // Normalize email (trim and lowercase to match signup)
        const normalizedBody = {
            email: email.trim().toLowerCase(),
            password: password
        };

           return await loginTenant(normalizedBody);
           
           } catch (error) {
               console.error("❌ API ERROR:", error);
       
               if (error.code === "ERR_JWT_EXPIRED") {
                   return NextResponse.json(
                   { message: error.message || "Token expired" },
                   { status: 401 },
               ); 
            }}
        return NextResponse.json(
        { message: error.message || "Something went wrong" },
        { status: 500 },
    );  
}