import { NextResponse } from "next/server";
import { DASHBOARD_COOKIE } from "@/lib/dashboardAuth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(DASHBOARD_COOKIE);
  return res;
}
