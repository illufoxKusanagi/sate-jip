import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
export async function verifyApiToken(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return { authenticated: false, user: null };
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      authenticated: true,
      user: payload as { userId: string; username: string; role: string },
    };
  } catch {
    return { authenticated: false, user: null };
  }
}
