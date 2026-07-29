import { NextResponse } from "next/server";
import { register } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  try {
    const { jwt, user } = await register(username, email, password);

    const response = NextResponse.json({ user });
    response.cookies.set("vairutya_jwt", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
