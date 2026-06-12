import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

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

// const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// export async function getUserFromRequest() {
//   const cookieStore = cookies();
//   const token = cookieStore.get("token")?.value;

//   if (!token) return null;

//   try {
//     const { payload } = await jwt(token, secret);
//     return payload; // contains userId, role, etc.
//   } catch (err) {
//     return null;
//   }
// }
