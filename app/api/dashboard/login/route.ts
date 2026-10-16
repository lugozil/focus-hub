import { NextResponse } from "next/server";
import {
  DASHBOARD_COOKIE,
  DASHBOARD_COOKIE_MAX_AGE,
  dashboardToken,
  safeEqual,
} from "@/lib/dashboardAuth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  const expected = process.env.DASHBOARD_PASSWORD;
  const token = await dashboardToken();

  if (!expected || !token) {
    return NextResponse.json({ ok: false, error: "server-misconfigured" }, { status: 500 });
  }
  if (!safeEqual(password, expected)) {
    // Pequeña pausa para frenar intentos por fuerza bruta.
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ ok: false, error: "invalid-password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(DASHBOARD_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DASHBOARD_COOKIE_MAX_AGE,
  });
  return res;
}
