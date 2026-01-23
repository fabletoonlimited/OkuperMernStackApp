import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
  const token = cookies().get("token")?.value;
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );

  return Response.json({ authenticated: true });
}
