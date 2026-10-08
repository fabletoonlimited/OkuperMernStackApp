// Login Landlord
export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import Landlord from "../models/landlordModel.js";
import { loginLandlord } from "../controllers/landlord.controller.js";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();

        const { email, password } = body;

        if (!email) {
            return NextResponse.json(
                { message: "Please input your email" },
                { status: 400 }
            );
        }

        if (!password) {
            return NextResponse.json(
                { message: "Please input password" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        const landlord = await Landlord.findOne({
            email: normalizedEmail,
        });

        // Landlord does not exist
        if (!landlord) {
            return NextResponse.json(
                {
                    success: false,
                    code: "LANDLORD_NOT_FOUND",
                    redirect: "/signUpLanding",
                    message: "This email does not exist. Please sign up.",
                },
                { status: 404 }
            );
        }

        // Landlord exists — continue with login
        return await loginLandlord({
            email: normalizedEmail,
            password,
        });

    } catch (error) {
        console.error("❌ API ERROR:", error);

        if (error.code === "ERR_JWT_EXPIRED") {
            return NextResponse.json(
                {
                    message: error.message || "Token expired",
                },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                message: error.message || "Something went wrong",
            },
            { status: 500 }
        );
    }
}