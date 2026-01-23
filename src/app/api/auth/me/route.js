import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // ✅ Next.js 15 requires awaiting cookies() before using its methods
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

    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
