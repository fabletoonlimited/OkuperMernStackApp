import { requestOtp, verifyOtp } from "../controllers/otpController.js";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { action } = body;

        if (!action) {
            return NextResponse.json({message: "No actin specified"}, { status: 400});
        }

        if (action === "requestOtp") {
            return requestOtp(req); //Sends the OTP
        } else if (action === "verifyOtp") {
            return verifyOtp(req); // Sends verify OTP
        } else {
            return NextResponse.json({message: "Invalid action"}, { status: 400});
        }
    } catch (error) {
        console.error("OTP route error:", error);
        return NextResponse.json({message: "Server error"}, {status: 500})
    }
}