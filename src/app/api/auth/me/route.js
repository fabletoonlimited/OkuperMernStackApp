import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { User } from "lucide-react";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { authenticated: false, 
          message: "No token provided" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json(
      { authenticated: true,
        role: decoded.role,
        id: decoded.id,
        message: "User authenticated"
       },
      { status: 200 }
    );
      
  } catch (error) {
    const res = NextResponse.json(
      { authenticated: false, message: "Invalid or expired token" },
      { status: 401}
    );
    
    res.cookies.delete("token", {
      maxAge: 0,
      path: "/",
    });
    return res;
  }
}
