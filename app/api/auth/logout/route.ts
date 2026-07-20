import { NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "vikky_admin_key";

export async function GET(request: Request): Promise<Response> {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  return response;
}
