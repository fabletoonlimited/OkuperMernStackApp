import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { authenticated: false, message: "No token provided" },
        { status: 401 }
      );
    }


    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return NextResponse.json(
      { authenticated: true }, 
      { status: 200 }
    );
      
  } catch (error) {
    console.error("Auth error", error.message);
    
    return NextResponse.json(
      { authenticated: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
