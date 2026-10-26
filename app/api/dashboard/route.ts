import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/dashboardQueries";

const RANGES = new Set([7, 30, 90]);

export async function GET(request: Request) {
  const days = Number(new URL(request.url).searchParams.get("days") ?? 30);
  if (!RANGES.has(days)) {
    return NextResponse.json({ ok: false, error: "invalid-range" }, { status: 400 });
  }
  try {
    const data = await getDashboardData(days);
    return NextResponse.json({ ok: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Error al consultar el dashboard", error);
    const message = error instanceof Error && error.message === "db-not-configured" ? "db-not-configured" : "db-error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
