// Datos FALSOS para visualizar el dashboard antes de conectar el backend.
// Se generan con una semilla fija para que el servidor y el navegador
// produzcan exactamente los mismos números (sin errores de hidratación).

import type { DashboardData, DayRow, LandingKey, LeadRow } from "../types";

export type { DayRow, LandingFilter, LandingKey, LeadRow } from "../types";



function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TODAY = new Date(2026, 9, 14);
export const TOTAL_DAYS = 180;

function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildDays(): DayRow[] {
  const rand = mulberry32(20261014);
  const jitter = (spread: number) => 1 + (rand() - 0.5) * spread;
  const rows: DayRow[] = [];

  for (let i = TOTAL_DAYS - 1; i >= 0; i--) {
    const d = new Date(TODAY);
    d.setDate(d.getDate() - i);
    const weekday = d.getDay();
    const weekFactor = weekday === 0 ? 0.62 : weekday === 6 ? 0.74 : weekday === 2 || weekday === 3 ? 1.12 : 1;
    const growth = 1 + ((TOTAL_DAYS - i) / TOTAL_DAYS) * 0.45;

    for (const landing of ["performance", "studio"] as const) {
      const base = landing === "performance" ? 165 : 78;
      const visitas = Math.round(base * weekFactor * growth * jitter(0.5));
      const r = landing === "performance"
        ? { s25: 0.84, s50: 0.63, s75: 0.44, s100: 0.28, cta: 0.21, ini: 0.15, comp: 0.09, cita: 0.058 }
        : { s25: 0.8, s50: 0.58, s75: 0.39, s100: 0.24, cta: 0.17, ini: 0.12, comp: 0.072, cita: 0.041 };

      const scroll25 = Math.round(visitas * r.s25 * jitter(0.08));
      const scroll50 = Math.min(scroll25, Math.round(visitas * r.s50 * jitter(0.12)));
      const scroll75 = Math.min(scroll50, Math.round(visitas * r.s75 * jitter(0.15)));
      const scroll100 = Math.min(scroll75, Math.round(visitas * r.s100 * jitter(0.2)));
      const ctaClicks = Math.min(scroll50, Math.round(visitas * r.cta * jitter(0.25)));
      const formInicio = Math.min(ctaClicks, Math.round(visitas * r.ini * jitter(0.3)));
      const formCompleto = Math.min(formInicio, Math.round(visitas * r.comp * jitter(0.4)));
      const citas = Math.min(formCompleto, Math.round(visitas * r.cita * jitter(0.5)));

      rows.push({
        fecha: isoDate(d),
        landing,
        visitas,
        scroll25,
        scroll50,
        scroll75,
        scroll100,
        ctaClicks,
        formInicio,
        formCompleto,
        citas,
        movil: Math.round(visitas * (landing === "performance" ? 0.78 : 0.71) * jitter(0.1)),
      });
    }
  }
  return rows;
}

export const DAYS = buildDays();

/** Visitas por día de la semana (lun..dom) y hora (0..23), por landing. */
function buildHeatmap(landing: LandingKey) {
  const rand = mulberry32(landing === "performance" ? 77 : 91);
  const grid: number[][] = [];
  for (let day = 0; day < 7; day++) {
    const row: number[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const dayFactor = day >= 5 ? 0.6 : 1;
      const morning = Math.exp(-((hour - 10) ** 2) / 8);
      const lunch = 0.7 * Math.exp(-((hour - 13) ** 2) / 3);
      const evening = 1.25 * Math.exp(-((hour - 20) ** 2) / 6);
      const night = hour < 6 ? 0.05 : 0;
      const base = (morning + lunch + evening + night) * dayFactor;
      row.push(Math.round(base * (landing === "performance" ? 60 : 28) * (0.8 + rand() * 0.4)));
    }
    grid.push(row);
  }
  return grid;
}

export const HEATMAP: Record<LandingKey, number[][]> = {
  performance: buildHeatmap("performance"),
  studio: buildHeatmap("studio"),
};

/** Reparto por landing para métricas que no se desglosan por día (proporción del período). */
export const CTA_BUTTONS: Record<LandingKey, { label: string; ubicacion: string; share: number }[]> = {
  performance: [
    { label: "Quiero mi auditoría gratuita", ubicacion: "Hero, bajo el VSL", share: 0.61 },
    { label: "Agendar mi auditoría gratuita", ubicacion: "Bajo los testimonios", share: 0.39 },
  ],
  studio: [
    { label: "Quiero destacar mi marca", ubicacion: "Hero", share: 0.68 },
    { label: "Quiero destacar mi marca", ubicacion: "Bajo los servicios", share: 0.32 },
  ],
};

/** Último campo tocado antes de abandonar el formulario (proporción de abandonos). */
export const FORM_DROPOFF: Record<LandingKey, { campo: string; share: number }[]> = {
  performance: [
    { campo: "Nombre y apellido", share: 0.12 },
    { campo: "Teléfono", share: 0.24 },
    { campo: "Correo electrónico", share: 0.14 },
    { campo: "Nombre del dealership", share: 0.08 },
    { campo: "Cargo", share: 0.06 },
    { campo: "Carros al mes", share: 0.05 },
    { campo: "Calendario (fase 2)", share: 0.31 },
  ],
  studio: [
    { campo: "Nombre y apellido", share: 0.11 },
    { campo: "Teléfono", share: 0.21 },
    { campo: "Correo electrónico", share: 0.12 },
    { campo: "Nombre del dealership", share: 0.07 },
    { campo: "Cargo", share: 0.05 },
    { campo: "Carros al mes", share: 0.04 },
    { campo: "Servicios de interés", share: 0.09 },
    { campo: "Calendario (fase 2)", share: 0.31 },
  ],
};

/** Videos: reproducciones como proporción de visitas y retención por cuartil. */
export const VIDEOS: { landing: LandingKey; titulo: string; playRate: number; retencion: [number, number, number, number] }[] = [
  { landing: "performance", titulo: "VSL principal", playRate: 0.46, retencion: [0.78, 0.55, 0.38, 0.24] },
  { landing: "performance", titulo: "Testimonio · Voices", playRate: 0.19, retencion: [0.71, 0.49, 0.33, 0.21] },
  { landing: "performance", titulo: "Testimonio · H. Delgado", playRate: 0.11, retencion: [0.74, 0.52, 0.36, 0.27] },
];

export const SERVICIOS_STUDIO: { servicio: string; share: number }[] = [
  { servicio: "Producciones audiovisuales", share: 0.64 },
  { servicio: "Creación completa de contenido", share: 0.52 },
  { servicio: "Planificación de contenido", share: 0.41 },
];

export const FUENTES: { fuente: string; share: number }[] = [
  { fuente: "Facebook Ads", share: 0.46 },
  { fuente: "Instagram", share: 0.27 },
  { fuente: "Google", share: 0.12 },
  { fuente: "Directo / WhatsApp", share: 0.1 },
  { fuente: "Otros", share: 0.05 },
];


export const LEADS_RECIENTES: LeadRow[] = [
  { fecha: "14 oct · 9:42 a.m.", nombre: "Carlos M.", dealership: "Auto Group Norte", cargo: "Dueño / CEO", landing: "performance", estado: "Cita agendada", cita: "16 oct · 10:00 a.m." },
  { fecha: "14 oct · 8:15 a.m.", nombre: "Lourdes R.", dealership: "Bayamón Motors", cargo: "Gerente General", landing: "studio", servicios: "Audiovisuales, Creación completa", estado: "Cita agendada", cita: "15 oct · 2:30 p.m." },
  { fecha: "13 oct · 7:58 p.m.", nombre: "José A.", dealership: "Caguas Auto Plaza", cargo: "Director de Ventas", landing: "performance", estado: "No agendó" },
  { fecha: "13 oct · 4:20 p.m.", nombre: "Ana V.", dealership: "Ponce Car Center", cargo: "Gerente General", landing: "performance", estado: "Cita agendada", cita: "15 oct · 9:30 a.m." },
  { fecha: "13 oct · 11:05 a.m.", nombre: "Ricardo P.", dealership: "Mayagüez Autos", cargo: "Dueño / CEO", landing: "studio", servicios: "Planificación", estado: "No agendó" },
  { fecha: "12 oct · 6:47 p.m.", nombre: "Marisol T.", dealership: "Arecibo Motors", cargo: "Directora de Marketing", landing: "studio", servicios: "Planificación, Audiovisuales", estado: "Cita agendada", cita: "14 oct · 3:00 p.m." },
  { fecha: "12 oct · 10:31 a.m.", nombre: "Héctor L.", dealership: "Carolina Auto Mall", cargo: "Gerente General", landing: "performance", estado: "Cita agendada", cita: "14 oct · 11:30 a.m." },
];

/* ------------------------------------------------------------------ */
/* Adaptador: datos de ejemplo con la misma forma que /api/dashboard   */
/* ------------------------------------------------------------------ */

const ALL_DATES = Array.from(new Set(DAYS.map((d) => d.fecha)));

export function mockDashboardData(range: number): DashboardData {
  const dates = ALL_DATES.slice(-range);
  const prevDates = ALL_DATES.slice(-2 * range, -range);
  const inWindow = new Set(dates);
  const keys = ["performance", "studio"] as const;
  const sum = (k: LandingKey, metric: Exclude<keyof DayRow, "fecha" | "landing">) =>
    DAYS.filter((r) => r.landing === k && inWindow.has(r.fecha)).reduce((a, r) => a + r[metric], 0);

  const scale = range / 30;
  return {
    dates,
    prevDates,
    days: DAYS.filter((r) => inWindow.has(r.fecha) || prevDates.includes(r.fecha)),
    heatmap: {
      performance: HEATMAP.performance.map((row) => row.map((v) => Math.round(v * scale))),
      studio: HEATMAP.studio.map((row) => row.map((v) => Math.round(v * scale))),
    },
    ctas: keys.flatMap((k) =>
      CTA_BUTTONS[k].map((b) => ({ landing: k, label: b.label, ubicacion: b.ubicacion, clicks: Math.round(sum(k, "ctaClicks") * b.share) }))
    ),
    dropoff: keys.flatMap((k) => {
      const lost = sum(k, "formInicio") - sum(k, "citas");
      return FORM_DROPOFF[k].map((f) => ({ landing: k, campo: f.campo, count: Math.round(lost * f.share) }));
    }),
    videos: VIDEOS.map((v) => ({
      landing: v.landing,
      titulo: v.titulo,
      plays: Math.round(sum(v.landing, "visitas") * v.playRate),
      retencion: v.retencion,
    })),
    servicios: SERVICIOS_STUDIO.map((s) => ({ servicio: s.servicio, count: Math.round(sum("studio", "formCompleto") * s.share) })),
    fuentes: keys.flatMap((k) => FUENTES.map((f) => ({ landing: k, fuente: f.fuente, visitas: Math.round(sum(k, "visitas") * f.share) }))),
    leads: LEADS_RECIENTES,
  };
}
