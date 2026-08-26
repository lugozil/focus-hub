import type { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard interno — FOCUS Hub",
  robots: { index: false, follow: false },
};

type SummaryPayload =
  | {
      ok: true;
      variante: string;
      dias: number;
      totales: { vistas: number; fase1: number; citas: number };
      porDia: { fecha: string; vistas: number; fase1: number; citas: number }[];
    }
  | { ok: false; error: string };

async function getSummary(variante: string, days = 30): Promise<SummaryPayload> {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  const secret = process.env.DASHBOARD_SECRET;
  if (!scriptUrl || !secret) return { ok: false, error: "server-misconfigured" };

  const url = new URL(scriptUrl);
  url.searchParams.set("action", "summary");
  url.searchParams.set("variante", variante);
  url.searchParams.set("days", String(days));
  url.searchParams.set("key", secret);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    return (await res.json()) as SummaryPayload;
  } catch (error) {
    console.error("Error al obtener el resumen del dashboard", error);
    return { ok: false, error: "fetch-failed" };
  }
}

export default async function DashboardPage() {
  const summary = await getSummary("contacto-b", 30);
  return (
    <>
      <LandingHeader />
      <main>
        <DashboardClient summary={summary} />
      </main>
    </>
  );
}
