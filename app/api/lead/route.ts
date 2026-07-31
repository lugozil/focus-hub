import { NextResponse } from "next/server";

type LeadPayload = {
  variante: string;
  nombre: string;
  telefono: string;
  email: string;
  cargo: string;
  inversion: string;
};

function isValidPayload(body: unknown): body is LeadPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.variante === "string" &&
    typeof b.nombre === "string" &&
    b.nombre.trim().length > 0 &&
    typeof b.telefono === "string" &&
    b.telefono.trim().length > 0 &&
    typeof b.email === "string" &&
    b.email.trim().length > 0 &&
    typeof b.cargo === "string" &&
    b.cargo.trim().length > 0 &&
    typeof b.inversion === "string" &&
    b.inversion.trim().length > 0
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!isValidPayload(body)) {
    return NextResponse.json({ ok: false, error: "invalid-payload" }, { status: 400 });
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    console.error("Falta la variable de entorno GOOGLE_SCRIPT_URL");
    return NextResponse.json({ ok: false, error: "server-misconfigured" }, { status: 500 });
  }

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      redirect: "follow",
    });

    if (!res.ok) throw new Error(`apps-script-status-${res.status}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al guardar el lead vía Apps Script", error);
    return NextResponse.json({ ok: false, error: "sheets-append-failed" }, { status: 502 });
  }
}
