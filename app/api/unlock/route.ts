import { NextRequest, NextResponse } from "next/server";
import {
  validatePassword,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_VALUE,
  AUTH_COOKIE_MAX_AGE,
} from "@/lib/auth";

export const runtime = "nodejs"; // explicit, default but documented

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const password = typeof body === "object" && body !== null && "password" in body
    ? String((body as Record<string, unknown>).password ?? "")
    : "";

  if (!validatePassword(password)) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true }, { status: 200 });
  res.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: AUTH_COOKIE_VALUE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: "/",
  });
  return res;
}
