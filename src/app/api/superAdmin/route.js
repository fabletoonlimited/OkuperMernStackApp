export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import { NextResponse } from "next/server";

import {signupSuperAdmin} from "@/app/api/controllers/superAdmin.controller"

export async function POST (req) {
    try {
        await dbConnect();

        const body = await req.json();

        const { firstName, lastName, password, token} = body;
        if (!firstName || !lastName || !password || !token) {
            return NextResponse.json(
            { message: "missing required fields" },
            { status: 500 },
            );
        }

        const result = await signupSuperAdmin(body);
        return NextResponse.json(result, { status: result.status || 201 });
    } catch (error) {
        console.error("Super Admin creation error:", error);
        return NextResponse.json(
            { message: "Server error, something went wrong" },
            { status: 500 },
        );
    }
}
