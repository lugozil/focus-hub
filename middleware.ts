import { NextResponse, type NextRequest } from "next/server";
import { DASHBOARD_COOKIE, dashboardToken, safeEqual } from "@/lib/dashboardAuth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await dashboardToken();
  const cookie = request.cookies.get(DASHBOARD_COOKIE)?.value ?? "";
  if (token && safeEqual(cookie, token)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const login = new URL("/dashboard/login", request.url);
  return NextResponse.redirect(login);
}

export const config = {
  // La vista previa (datos de ejemplo), el login y el logout quedan públicos.
  matcher: ["/dashboard", "/api/dashboard"],
};
