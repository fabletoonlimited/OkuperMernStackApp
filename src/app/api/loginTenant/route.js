// Login Tenant
export const runtime = "nodejs";

import dbConnect from "@/app/lib/mongoose";
import Tenant from "../models/tenantModel.js";
import { loginTenant } from "../controllers/tenant.controller.js";
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

        const tenant = await Tenant.findOne({
            email: normalizedEmail,
        });

        // Tenant does not exist
        if (!tenant) {
            return NextResponse.json(
                {
                    success: false,
                    code: "TENANT_NOT_FOUND",
                    redirect: "/signUpLanding",
                    message: "This email does not exist. Please sign up.",
                },
                { status: 404 }
            );
        }

        // Tenant exists — continue with login
        return await loginTenant({
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