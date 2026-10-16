// Contrato compartido entre el rastreo de las landings (navegador),
// /api/event (servidor) y las consultas del dashboard.

export const LANDING_KEYS = ["performance", "studio"] as const;
export type LandingKey = (typeof LANDING_KEYS)[number];

/** Variante del formulario/pageview → landing del dashboard. */
export const VARIANTE_TO_LANDING: Record<string, LandingKey> = {
  "contacto-b": "performance",
  studio: "studio",
};

export const EVENT_TYPES = [
  "pageview",
  "scroll",
  "cta_click",
  "form_start",
  "form_field",
  "form_submit",
  "cita",
  "video_play",
  "video_progress",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export type TrackedEvent = {
  landing: LandingKey;
  session: string;
  type: EventType;
  name?: string;
  detail?: string;
  value?: number;
  device?: "movil" | "escritorio";
  source?: string;
};

/** id del campo en el formulario → nombre que se muestra en el dashboard, en orden. */
export const FORM_FIELDS: { id: string; label: string }[] = [
  { id: "nombre", label: "Nombre y apellido" },
  { id: "telefono", label: "Teléfono" },
  { id: "email", label: "Correo electrónico" },
  { id: "dealership", label: "Nombre del dealership" },
  { id: "cargo", label: "Cargo" },
  { id: "carrosPorMes", label: "Carros al mes" },
  { id: "servicios", label: "Servicios de interés" },
  { id: "calendario", label: "Calendario (fase 2)" },
];

export const TIMEZONE = "America/Puerto_Rico";
