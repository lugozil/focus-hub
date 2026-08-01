import { NextResponse, after } from "next/server";

type LeadPayload = {
  variante: string;
  nombre: string;
  telefono: string;
  email: string;
  cargo: string;
  inversion?: string;
  dealership?: string;
  carrosPorMes?: string;
  fechaCita?: string;
  horaCita?: string;
};

function isValidPayload(body: unknown): body is LeadPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;

  const hasBaseFields =
    typeof b.variante === "string" &&
    typeof b.nombre === "string" &&
    b.nombre.trim().length > 0 &&
    typeof b.telefono === "string" &&
    b.telefono.trim().length > 0 &&
    typeof b.email === "string" &&
    b.email.trim().length > 0 &&
    typeof b.cargo === "string" &&
    b.cargo.trim().length > 0;

  if (!hasBaseFields) return false;

  if (b.variante === "contacto-b") {
    return (
      typeof b.dealership === "string" &&
      b.dealership.trim().length > 0 &&
      typeof b.carrosPorMes === "string" &&
      b.carrosPorMes.trim().length > 0 &&
      typeof b.fechaCita === "string" &&
      b.fechaCita.trim().length > 0 &&
      typeof b.horaCita === "string" &&
      b.horaCita.trim().length > 0
    );
  }

  return typeof b.inversion === "string" && b.inversion.trim().length > 0;
}

function splitNombre(nombre: string) {
  const parts = nombre.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

async function sendToSheets(scriptUrl: string, body: LeadPayload) {
  const start = Date.now();

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      redirect: "follow",
    });

    if (!res.ok) throw new Error(`apps-script-status-${res.status}`);
    console.log(`Apps Script respondió en ${Date.now() - start}ms (status ${res.status})`);
  } catch (error) {
    console.error(`Error al guardar el lead vía Apps Script (${Date.now() - start}ms)`, error);
  }
}

async function sendToGHL(body: LeadPayload) {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) return;

  const { firstName, lastName } = splitNombre(body.nombre);
  const start = Date.now();

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        phone: body.telefono,
        email: body.email,
        cargo: body.cargo,
        variante: body.variante,
        dealership: body.dealership ?? "",
        carrosPorMes: body.carrosPorMes ?? "",
        inversion: body.inversion ?? "",
        fechaCita: body.fechaCita ?? "",
        horaCita: body.horaCita ?? "",
        source: `focushub.one/${body.variante}`,
      }),
    });
    if (!res.ok) throw new Error(`ghl-status-${res.status}`);
    console.log(`GHL respondió en ${Date.now() - start}ms (status ${res.status})`);
  } catch (error) {
    console.error(`Error al enviar el lead a GHL (${Date.now() - start}ms)`, error);
  }
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

  // Sheets y GHL corren en segundo plano después de responder: no deben
  // sumar latencia a lo que espera la persona en el formulario.
  after(() => sendToSheets(scriptUrl, body));
  after(() => sendToGHL(body));

  return NextResponse.json({ ok: true });
}
