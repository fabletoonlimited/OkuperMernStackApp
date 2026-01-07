import { requestOtp, verifyOtp } from "../controllers/otpController.js"
import { NextResponse } from "next/server";

export async function POST(req) {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action === "requestOtp") {
        return requestOtp(req);
    } else if (action === "verifyOtp") {
        return verifyOtp(req);
    } else {
        return NextResponse.json(
            { message: "Invalid action" }, 
            { status: 400 });
    }
}