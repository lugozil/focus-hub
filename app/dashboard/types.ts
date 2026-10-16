// Forma de los datos que consume el dashboard, venga de la base de datos
// (/api/dashboard) o de los datos de ejemplo (/dashboard/preview).

import type { LandingKey } from "@/lib/landingEvents";

export type { LandingKey };
export type LandingFilter = LandingKey | "todas";

export type DayRow = {
  fecha: string;
  landing: LandingKey;
  visitas: number;
  scroll25: number;
  scroll50: number;
  scroll75: number;
  scroll100: number;
  ctaClicks: number;
  formInicio: number;
  formCompleto: number;
  citas: number;
  movil: number;
};

export type LeadRow = {
  fecha: string;
  nombre: string;
  dealership: string;
  cargo: string;
  landing: LandingKey;
  servicios?: string;
  estado: "Cita agendada" | "No agendó";
  cita?: string;
};

export type DashboardData = {
  /** Días del período seleccionado (YYYY-MM-DD, hora de Puerto Rico). */
  dates: string[];
  /** Días del período anterior, del mismo largo, para la comparación. */
  prevDates: string[];
  /** Una fila por día y landing que cubre ambos períodos. */
  days: DayRow[];
  /** Visitas por día de la semana (lun..dom) × hora (0..23). */
  heatmap: Record<LandingKey, number[][]>;
  ctas: { landing: LandingKey; label: string; ubicacion: string; clicks: number }[];
  /** Último campo tocado por quienes empezaron el formulario y no agendaron. */
  dropoff: { landing: LandingKey; campo: string; count: number }[];
  /** retencion: proporción de reproducciones que llega al 25/50/75/100%. */
  videos: { landing: LandingKey; titulo: string; plays: number; retencion: number[] }[];
  /** Leads de Studio por servicio (cada lead puede elegir varios). */
  servicios: { servicio: string; count: number }[];
  fuentes: { landing: LandingKey; fuente: string; visitas: number }[];
  leads: LeadRow[];
};
