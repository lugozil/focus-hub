import { NextResponse, after } from "next/server";
import { getSql } from "@/lib/db";
import { VARIANTE_TO_LANDING } from "@/lib/landingEvents";

// La espera de la fase 1 corre dentro de after(): la función debe vivir lo suficiente.
export const maxDuration = 300;

// Cuánto se espera antes de mandar a GHL un lead que aún no agendó. Si agenda
// dentro de esta ventana, solo llega a GHL el envío con la cita (uno solo).
const GHL_DELAY_SIN_CITA_MS = Number(process.env.GHL_DELAY_SIN_CITA_MS) || 3 * 60 * 1000;

type LeadPayload = {
  variante: string;
  nombre: string;
  firstName?: string;
  lastName?: string;
  ubicacion?: string;
  telefono: string;
  email: string;
  cargo: string;
  inversion?: string;
  dealership?: string;
  carrosPorMes?: string;
  servicios?: string;
  fechaCita?: string;
  horaCita?: string;
  fechaHoraCita?: string;
  agendado?: boolean;
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

  if (b.variante === "contacto-b" || b.variante === "studio") {
    const hasServicios =
      b.variante !== "studio" || (typeof b.servicios === "string" && b.servicios.trim().length > 0);
    return (
      hasServicios &&
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

  const split = splitNombre(body.nombre);
  const firstName = typeof body.firstName === "string" && body.firstName.trim() ? body.firstName.trim() : split.firstName;
  const lastName = typeof body.lastName === "string" && body.lastName.trim() ? body.lastName.trim() : split.lastName;
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
        ...(body.variante === "contacto-b" && typeof body.ubicacion === "string" ? { ubicacion: body.ubicacion.trim() } : {}),
        carrosPorMes: body.carrosPorMes ?? "",
        servicios: body.servicios ?? "",
        inversion: body.inversion ?? "",
        fechaCita: body.fechaCita ?? "",
        horaCita: body.horaCita ?? "",
        fechaHoraCita: body.fechaHoraCita ?? "",
        citaAgendada: body.agendado ? "sí" : "no",
        source: `focushub.one/${body.variante}`,
      }),
    });
    if (!res.ok) throw new Error(`ghl-status-${res.status}`);
    console.log(`GHL respondió en ${Date.now() - start}ms (status ${res.status})`);
  } catch (error) {
    console.error(`Error al enviar el lead a GHL (${Date.now() - start}ms)`, error);
  }
}

/**
 * Guarda el lead y devuelve su `updated_at` exacto (como texto, para no perder
 * microsegundos), o null si no se pudo guardar.
 */
async function saveToDb(body: LeadPayload): Promise<string | null> {
  const landing = VARIANTE_TO_LANDING[body.variante];
  const sql = getSql();
  if (!landing || !sql) return null;

  const agendado = Boolean(body.agendado);
  const cita = agendado ? `${body.fechaCita ?? ""} · ${body.horaCita ?? ""}` : null;
  try {
    // Fase 1 crea el lead; fase 2 (agendado) actualiza el mismo registro.
    const rows = await sql`
      insert into leads (landing, nombre, email, telefono, dealership, cargo, carros, servicios, agendado, cita)
      values (${landing}, ${body.nombre.trim()}, ${body.email.trim().toLowerCase()}, ${body.telefono.trim()},
              ${body.dealership ?? null}, ${body.cargo}, ${body.carrosPorMes ?? null}, ${body.servicios ?? null},
              ${agendado}, ${cita})
      on conflict (landing, email, telefono) do update set
        nombre = excluded.nombre,
        dealership = excluded.dealership,
        cargo = excluded.cargo,
        carros = excluded.carros,
        servicios = excluded.servicios,
        agendado = leads.agendado or excluded.agendado,
        cita = coalesce(excluded.cita, leads.cita),
        updated_at = now()
      returning updated_at::text as updated_at
    `;
    return (rows[0]?.updated_at as string | undefined) ?? null;
  } catch (error) {
    console.error("Error al guardar el lead en la base de datos", error);
    return null;
  }
}

/**
 * true si el registro sigue tal como lo dejó la fase 1. Si cambió, es porque
 * llegó la fase 2 (que ya envió la cita a GHL) o un reenvío más nuevo de la
 * fase 1 (que hará su propio envío): en ambos casos este envío sobra.
 */
async function sinCambiosDesde(body: LeadPayload, updatedAt: string) {
  const landing = VARIANTE_TO_LANDING[body.variante];
  const sql = getSql();
  if (!landing || !sql) return true;
  try {
    const rows = await sql`
      select 1 from leads
      where landing = ${landing}
        and email = ${body.email.trim().toLowerCase()}
        and telefono = ${body.telefono.trim()}
        and updated_at = ${updatedAt}::timestamptz
    `;
    return rows.length > 0;
  } catch (error) {
    // Ante la duda, se envía: es peor perder el lead que duplicarlo.
    console.error("No se pudo verificar el envío pendiente a GHL; se envía igual", error);
    return true;
  }
}

/**
 * Formularios de dos fases (Performance y Studio): la fase 1 se envía a GHL
 * solo si la persona no agenda dentro de GHL_DELAY_SIN_CITA_MS; la fase 2
 * (con cita) se envía de inmediato. Así a GHL entra una sola vez por lead.
 */
async function saveAndSendToGHL(body: LeadPayload) {
  const dosFases = Boolean(VARIANTE_TO_LANDING[body.variante]);
  if (!dosFases || body.agendado) {
    await saveToDb(body);
    await sendToGHL(body);
    return;
  }

  const updatedAt = await saveToDb(body);
  await new Promise((resolve) => setTimeout(resolve, GHL_DELAY_SIN_CITA_MS));

  if (updatedAt && !(await sinCambiosDesde(body, updatedAt))) {
    console.log(`GHL: envío sin cita cancelado (${body.variante}); el lead agendó o se volvió a enviar`);
    return;
  }
  await sendToGHL(body);
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
  after(() => saveAndSendToGHL(body));

  return NextResponse.json({ ok: true });
}
