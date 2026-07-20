import { NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "vikky_admin_key";

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as { apiKey?: string } | null;
  const apiKey = body?.apiKey?.trim();
  const expectedKey = process.env.ADMIN_API_KEY?.trim();

  if (!expectedKey) {
    return NextResponse.json({ error: "admin_api_key_not_configured" }, { status: 500 });
  }

  if (!apiKey || apiKey !== expectedKey) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: apiKey,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}
