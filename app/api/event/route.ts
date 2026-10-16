import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { EVENT_TYPES, LANDING_KEYS, type TrackedEvent } from "@/lib/landingEvents";

const TYPES = new Set<string>(EVENT_TYPES);
const LANDINGS = new Set<string>(LANDING_KEYS);

const text = (v: unknown, max: number) =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;

function parse(body: unknown): TrackedEvent | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.landing !== "string" || !LANDINGS.has(b.landing)) return null;
  if (typeof b.type !== "string" || !TYPES.has(b.type)) return null;
  if (typeof b.session !== "string" || !/^[\w-]{8,64}$/.test(b.session)) return null;
  return {
    landing: b.landing as TrackedEvent["landing"],
    session: b.session,
    type: b.type as TrackedEvent["type"],
    name: text(b.name, 120) ?? undefined,
    detail: text(b.detail, 120) ?? undefined,
    value: Number.isInteger(b.value) ? Math.max(0, Math.min(100, b.value as number)) : undefined,
    device: b.device === "movil" || b.device === "escritorio" ? b.device : undefined,
    source: text(b.source, 60) ?? undefined,
  };
}

export async function POST(request: Request) {
  // sendBeacon manda el cuerpo como Blob; request.json() lo lee igual.
  const event = parse(await request.json().catch(() => null));
  if (!event) return NextResponse.json({ ok: false, error: "invalid-event" }, { status: 400 });

  const sql = getSql();
  if (!sql) return NextResponse.json({ ok: false, error: "db-not-configured" }, { status: 503 });

  try {
    await sql`
      insert into events (landing, session_id, type, name, detail, value, device, source)
      values (${event.landing}, ${event.session}, ${event.type}, ${event.name ?? null},
              ${event.detail ?? null}, ${event.value ?? null}, ${event.device ?? null}, ${event.source ?? null})
    `;
  } catch (error) {
    console.error("Error al guardar el evento", error);
    return NextResponse.json({ ok: false, error: "db-error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
