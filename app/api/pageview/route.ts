import { NextResponse, after } from "next/server";

const ALLOWED_VARIANTES = new Set(["contacto", "contacto-a", "contacto-b", "contacto-c", "studio"]);

async function sendPageview(scriptUrl: string, secret: string, variante: string) {
  const url = new URL(scriptUrl);
  url.searchParams.set("action", "pageview");
  url.searchParams.set("variante", variante);
  url.searchParams.set("key", secret);

  try {
    const res = await fetch(url.toString(), { redirect: "follow" });
    const data = await res.json().catch(() => null);
    if (!data?.ok) throw new Error(`apps-script-pageview-failed: ${JSON.stringify(data)}`);
  } catch (error) {
    console.error("Error al registrar pageview vía Apps Script", error);
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const variante = typeof body?.variante === "string" ? body.variante : "";

  if (!ALLOWED_VARIANTES.has(variante)) {
    return NextResponse.json({ ok: false, error: "invalid-variante" }, { status: 400 });
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  const secret = process.env.DASHBOARD_SECRET;

  if (!scriptUrl || !secret) {
    console.error("Falta GOOGLE_SCRIPT_URL o DASHBOARD_SECRET");
    return NextResponse.json({ ok: false, error: "server-misconfigured" }, { status: 500 });
  }

  after(() => sendPageview(scriptUrl, secret, variante));
  return NextResponse.json({ ok: true });
}
