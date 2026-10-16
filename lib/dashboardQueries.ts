import { getSql } from "@/lib/db";
import { FORM_FIELDS, LANDING_KEYS, TIMEZONE, type LandingKey } from "@/lib/landingEvents";
import type { DashboardData, DayRow, LeadRow } from "@/app/dashboard/types";

const TZ = TIMEZONE;
const QUARTILES = [25, 50, 75, 100];

function todayInTz() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

function addDays(iso: string, delta: number) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

function emptyDay(fecha: string, landing: LandingKey): DayRow {
  return {
    fecha, landing, visitas: 0, scroll25: 0, scroll50: 0, scroll75: 0, scroll100: 0,
    ctaClicks: 0, formInicio: 0, formCompleto: 0, citas: 0, movil: 0,
  };
}

const LEAD_DATE = new Intl.DateTimeFormat("es", {
  timeZone: TZ, day: "numeric", month: "short", hour: "numeric", minute: "2-digit",
});

function shortName(nombre: string) {
  const [first = "", second = ""] = nombre.trim().split(/\s+/);
  return second ? `${first} ${second[0].toUpperCase()}.` : first;
}

const FIELD_ORDER = new Map(FORM_FIELDS.map((f, i) => [f.label, i]));

/** Todo lo que necesita el dashboard para los últimos `range` días (y el período anterior). */
export async function getDashboardData(range: number): Promise<DashboardData> {
  const sql = getSql();
  if (!sql) throw new Error("db-not-configured");

  const today = todayInTz();
  const dates = Array.from({ length: range }, (_, i) => addDays(today, i - range + 1));
  const prevDates = dates.map((d) => addDays(d, -range));
  const from = prevDates[0];
  const windowFrom = dates[0];

  const [daily, heat, ctas, dropoff, videoPlays, videoProgress, servicios, fuentes, leads] = await Promise.all([
    sql`
      select to_char((ts at time zone ${TZ})::date, 'YYYY-MM-DD') as fecha, landing,
        count(distinct session_id) filter (where type = 'pageview')::int as visitas,
        count(distinct session_id) filter (where type = 'scroll' and value >= 25)::int as scroll25,
        count(distinct session_id) filter (where type = 'scroll' and value >= 50)::int as scroll50,
        count(distinct session_id) filter (where type = 'scroll' and value >= 75)::int as scroll75,
        count(distinct session_id) filter (where type = 'scroll' and value >= 100)::int as scroll100,
        count(distinct session_id) filter (where type = 'cta_click')::int as cta_clicks,
        count(distinct session_id) filter (where type = 'form_start')::int as form_inicio,
        count(distinct session_id) filter (where type = 'form_submit')::int as form_completo,
        count(distinct session_id) filter (where type = 'cita')::int as citas,
        count(distinct session_id) filter (where type = 'pageview' and device = 'movil')::int as movil
      from events
      where ts >= (${from}::date)::timestamp at time zone ${TZ}
      group by 1, 2
    `,
    sql`
      select landing,
        extract(isodow from ts at time zone ${TZ})::int - 1 as dia,
        extract(hour from ts at time zone ${TZ})::int as hora,
        count(*)::int as visitas
      from events
      where type = 'pageview' and ts >= (${windowFrom}::date)::timestamp at time zone ${TZ}
      group by 1, 2, 3
    `,
    sql`
      select landing, name as label, coalesce(detail, '') as ubicacion, count(*)::int as clicks
      from events
      where type = 'cta_click' and name is not null and ts >= (${windowFrom}::date)::timestamp at time zone ${TZ}
      group by 1, 2, 3
    `,
    sql`
      with abandonos as (
        select distinct session_id, landing from events
        where type = 'form_start' and ts >= (${windowFrom}::date)::timestamp at time zone ${TZ}
        except
        select session_id, landing from events where type = 'cita'
      ),
      ultimo as (
        select distinct on (e.session_id) e.landing, e.name
        from events e
        join abandonos a on a.session_id = e.session_id and a.landing = e.landing
        where e.type = 'form_field'
        order by e.session_id, e.ts desc
      )
      select landing, name as campo, count(*)::int as count from ultimo group by 1, 2
    `,
    sql`
      select landing, name as titulo, count(distinct session_id)::int as plays
      from events
      where type = 'video_play' and name is not null and ts >= (${windowFrom}::date)::timestamp at time zone ${TZ}
      group by 1, 2
    `,
    sql`
      select landing, name as titulo, value as cuartil, count(distinct session_id)::int as sesiones
      from events
      where type = 'video_progress' and name is not null and ts >= (${windowFrom}::date)::timestamp at time zone ${TZ}
      group by 1, 2, 3
    `,
    sql`
      select trim(s) as servicio, count(*)::int as count
      from leads, unnest(string_to_array(servicios, ',')) as s
      where landing = 'studio' and servicios is not null
        and created_at >= (${windowFrom}::date)::timestamp at time zone ${TZ}
      group by 1
      order by 2 desc
    `,
    sql`
      select landing, coalesce(source, 'Directo') as fuente, count(distinct session_id)::int as visitas
      from events
      where type = 'pageview' and ts >= (${windowFrom}::date)::timestamp at time zone ${TZ}
      group by 1, 2
    `,
    sql`
      select created_at, landing, nombre, dealership, cargo, servicios, agendado, cita
      from leads
      order by created_at desc
      limit 15
    `,
  ]);

  // Días sin eventos también aparecen, en cero.
  const byKey = new Map<string, DayRow>();
  for (const fecha of [...prevDates, ...dates]) {
    for (const landing of LANDING_KEYS) byKey.set(`${fecha}|${landing}`, emptyDay(fecha, landing));
  }
  for (const r of daily) {
    const row = byKey.get(`${r.fecha}|${r.landing}`);
    if (!row) continue;
    Object.assign(row, {
      visitas: r.visitas, scroll25: r.scroll25, scroll50: r.scroll50, scroll75: r.scroll75,
      scroll100: r.scroll100, ctaClicks: r.cta_clicks, formInicio: r.form_inicio,
      formCompleto: r.form_completo, citas: r.citas, movil: r.movil,
    });
  }

  const heatmap = Object.fromEntries(
    LANDING_KEYS.map((k) => [k, Array.from({ length: 7 }, () => Array<number>(24).fill(0))])
  ) as Record<LandingKey, number[][]>;
  for (const r of heat) {
    if (heatmap[r.landing as LandingKey]) heatmap[r.landing as LandingKey][r.dia][r.hora] = r.visitas;
  }

  const progress = new Map<string, number>();
  for (const r of videoProgress) progress.set(`${r.landing}|${r.titulo}|${r.cuartil}`, r.sesiones);

  const leadRows: LeadRow[] = leads.map((l) => ({
    fecha: LEAD_DATE.format(new Date(l.created_at)),
    nombre: shortName(l.nombre),
    dealership: l.dealership ?? "—",
    cargo: l.cargo ?? "—",
    landing: l.landing,
    servicios: l.servicios ?? undefined,
    estado: l.agendado ? "Cita agendada" : "No agendó",
    cita: l.cita ?? undefined,
  }));

  return {
    dates,
    prevDates,
    days: [...byKey.values()],
    heatmap,
    ctas: ctas.map((r) => ({ landing: r.landing, label: r.label, ubicacion: r.ubicacion, clicks: r.clicks })),
    dropoff: dropoff
      .map((r) => ({ landing: r.landing, campo: r.campo, count: r.count }))
      .sort((a, b) => (FIELD_ORDER.get(a.campo) ?? 99) - (FIELD_ORDER.get(b.campo) ?? 99)),
    videos: videoPlays.map((r) => ({
      landing: r.landing,
      titulo: r.titulo,
      plays: r.plays,
      retencion: QUARTILES.map((q) => (r.plays ? (progress.get(`${r.landing}|${r.titulo}|${q}`) ?? 0) / r.plays : 0)),
    })),
    servicios: servicios.map((r) => ({ servicio: r.servicio, count: r.count })),
    fuentes: fuentes.map((r) => ({ landing: r.landing, fuente: r.fuente, visitas: r.visitas })),
    leads: leadRows,
  };
}
