"use client";

import { useMemo, useState } from "react";
import {
  BAD,
  BLUE_RAMP,
  BarList,
  ColumnSteps,
  DropoffColumns,
  FlowFunnel,
  GOOD,
  GroupedColumns,
  Heatmap,
  NUM,
  RankedPills,
  SplitBar,
  TrendChart,
  pct,
  type FunnelStage,
  type TrendSeries,
} from "./charts";
import {
  CTA_BUTTONS,
  DAYS,
  FORM_DROPOFF,
  FUENTES,
  HEATMAP,
  LANDINGS,
  LEADS_RECIENTES,
  SERVICIOS_STUDIO,
  VIDEOS,
  type DayRow,
  type LandingFilter,
  type LandingKey,
} from "./mockData";

type Totals = Omit<DayRow, "fecha" | "landing">;
type MetricKey = keyof Totals;

const RANGES = [7, 30, 90] as const;
type Range = (typeof RANGES)[number];

const ALL_DATES = Array.from(new Set(DAYS.map((d) => d.fecha)));

const EMPTY: Totals = {
  visitas: 0, scroll25: 0, scroll50: 0, scroll75: 0, scroll100: 0,
  ctaClicks: 0, formInicio: 0, formCompleto: 0, citas: 0, movil: 0,
};

function landingKeys(filter: LandingFilter): LandingKey[] {
  return filter === "todas" ? ["performance", "studio"] : [filter];
}

function windowDates(range: Range, offset = 0) {
  const end = ALL_DATES.length - offset * range;
  return ALL_DATES.slice(Math.max(0, end - range), end);
}

function sumRows(rows: DayRow[]): Totals {
  return rows.reduce<Totals>((acc, r) => {
    (Object.keys(EMPTY) as MetricKey[]).forEach((k) => (acc[k] += r[k]));
    return acc;
  }, { ...EMPTY });
}

const landingMeta = (key: LandingKey) => LANDINGS.find((l) => l.key === key)!;

/* ------------------------------------------------------------------ */

function Card({
  title,
  subtitle,
  action,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`min-w-0 rounded-2xl border border-silver-200 bg-white p-4 sm:p-5 md:p-6 ${className}`}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[12px] text-ink-faint">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Segmented<T extends string | number>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string; dot?: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full overflow-x-auto rounded-full border border-silver-200 bg-white p-1 [scrollbar-width:none]">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
              active ? "bg-ink text-white" : "text-ink-muted hover:text-ink"
            }`}
          >
            {o.dot && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: o.dot }} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Un color por paso del recorrido; se repite en las tarjetas y en el embudo. */
const STEP_THEMES = [
  { color: "#2a78d6", tint: "#eaf2fd", icon: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z" },
  { color: "#5b5bd6", tint: "#efeffc", icon: "M12 4v16m0 0l-6-6m6 6l6-6" },
  { color: "#8e4ec6", tint: "#f5eefb", icon: "M9 9l10 4-4 2-2 4-4-10zM5 3v3M3 5h3M5 13H3m10-8V3" },
  { color: "#eb6834", tint: "#fdf0ea", icon: "M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4" },
  { color: "#d4900a", tint: "#fdf6e3", icon: "M9 12l2 2 4-4M5 4h14v16H5z" },
  { color: "#0d8a5a", tint: "#e7f6ef", icon: "M7 3v3m10-3v3M4 8h16M5 5h14v15H5zM9 14l2 2 4-4" },
];

/** Las tarjetas comparten un solo color; el embudo conserva los colores por paso. */
const KPI_COLOR = { color: "#2a78d6", tint: "#eef4fc" };

function Delta({ current, previous, compareLabel }: { current: number; previous: number; compareLabel: string }) {
  if (previous <= 0) return <span className="text-[12px] text-ink-faint">sin período previo</span>;
  const change = (current - previous) / previous;
  const up = change >= 0;
  return (
    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px]">
      <span
        className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-bold shadow-sm"
        style={{ color: up ? GOOD : BAD }}
      >
        <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden="true">
          <path d={up ? "M5 1L9 7H1z" : "M5 9L1 3h8z"} fill="currentColor" />
        </svg>
        {up ? "+" : "−"}
        {Math.abs(change * 100).toFixed(1)}%
      </span>
      <span className="text-ink-muted">{compareLabel}</span>
    </span>
  );
}

function KpiTile({
  label,
  value,
  previous,
  rate,
  theme,
  compareLabel,
}: {
  label: string;
  value: number;
  previous: number;
  rate?: string;
  theme: (typeof STEP_THEMES)[number];
  compareLabel: string;
}) {
  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-2xl border p-4 transition-transform duration-200 hover:-translate-y-0.5 sm:p-5"
      style={{ backgroundColor: theme.tint, borderColor: `${theme.color}33` }}
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: theme.color }} />
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: theme.color }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d={theme.icon} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="line-clamp-2 text-[13px] font-semibold leading-[1.15] text-ink sm:text-[14px]">{label}</p>
      </div>
      <p className="mt-3 text-[34px] font-bold leading-none tracking-[-0.02em] tabular-nums" style={{ color: theme.color }}>
        {NUM.format(value)}
      </p>
      <p className="mt-1.5 min-h-[16px] text-[12px] text-ink-muted">{rate}</p>
      <div className="mt-auto pt-3">
        <Delta current={value} previous={previous} compareLabel={compareLabel} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const TREND_METRICS: { key: MetricKey; label: string }[] = [
  { key: "visitas", label: "Visitas" },
  { key: "ctaClicks", label: "Clics en CTA" },
  { key: "formCompleto", label: "Formularios" },
  { key: "citas", label: "Citas" },
];

export function DashboardPreview() {
  const [landing, setLanding] = useState<LandingFilter>("todas");
  const [range, setRange] = useState<Range>(30);
  const [trendMetric, setTrendMetric] = useState<MetricKey>("visitas");

  const keys = landingKeys(landing);
  const dates = useMemo(() => windowDates(range), [range]);
  const prevDates = useMemo(() => windowDates(range, 1), [range]);

  const data = useMemo(() => {
    const inWindow = (ds: string[]) => {
      const set = new Set(ds);
      return DAYS.filter((r) => set.has(r.fecha) && keys.includes(r.landing));
    };
    const rows = inWindow(dates);
    const prevRows = inWindow(prevDates);
    const totals = sumRows(rows);
    const prev = sumRows(prevRows);

    const perLanding = Object.fromEntries(
      (["performance", "studio"] as const).map((k) => [
        k,
        sumRows(DAYS.filter((r) => r.landing === k && dates.includes(r.fecha))),
      ])
    ) as Record<LandingKey, Totals>;

    const daily = (metric: MetricKey, only?: LandingKey) =>
      dates.map((f) =>
        DAYS.filter((r) => r.fecha === f && (only ? r.landing === only : keys.includes(r.landing))).reduce((a, r) => a + r[metric], 0)
      );

    return { totals, prev, perLanding, daily };
  }, [dates, prevDates, keys.join()]); // eslint-disable-line react-hooks/exhaustive-deps

  const { totals, prev, perLanding, daily } = data;

  const stages: FunnelStage[] = [
    { key: "visitas", label: "Visitan la landing", hint: "Sesiones únicas", value: totals.visitas, color: STEP_THEMES[0].color },
    { key: "scroll50", label: "Bajan a la mitad", hint: "Hacen scroll al 50% o más", value: totals.scroll50, color: STEP_THEMES[1].color },
    { key: "ctaClicks", label: "Pulsan un botón", hint: "Cualquier botón CTA hacia el formulario", value: totals.ctaClicks, color: STEP_THEMES[2].color },
    { key: "formInicio", label: "Empiezan el form", hint: "Tocan al menos un campo", value: totals.formInicio, color: STEP_THEMES[3].color },
    { key: "formCompleto", label: "Envían el form", hint: "Fase 1 enviada", value: totals.formCompleto, color: STEP_THEMES[4].color },
    { key: "citas", label: "Agendan cita", hint: "Fase 2: calendario", value: totals.citas, color: STEP_THEMES[5].color },
  ];

  const kpis: { key: MetricKey; label: string; rate?: string }[] = [
    { key: "visitas", label: "Visitas" },
    { key: "scroll50", label: "Scroll 50%+", rate: `${pct(totals.scroll50, totals.visitas)} de las visitas` },
    { key: "ctaClicks", label: "Clics en CTA", rate: `${pct(totals.ctaClicks, totals.visitas)} de las visitas` },
    { key: "formInicio", label: "Tocan el form", rate: `${pct(totals.formInicio, totals.ctaClicks)} de los clics` },
    { key: "formCompleto", label: "Forms completos", rate: `${pct(totals.formCompleto, totals.formInicio)} de quienes lo tocan` },
    { key: "citas", label: "Citas agendadas", rate: `${pct(totals.citas, totals.formCompleto)} de los forms` },
  ];

  const trendSeries: TrendSeries[] =
    landing === "todas"
      ? LANDINGS.map((l) => ({ key: l.key, label: l.label, color: l.color, values: daily(trendMetric, l.key) }))
      : [{ key: landing, label: landingMeta(landing).label, color: landingMeta(landing).color, values: daily(trendMetric) }];

  const heatGrid = useMemo(() => {
    const scale = range / 30;
    return HEATMAP.performance.map((row, d) =>
      row.map((_, h) => Math.round(keys.reduce((a, k) => a + HEATMAP[k][d][h], 0) * scale))
    );
  }, [range, keys.join()]); // eslint-disable-line react-hooks/exhaustive-deps

  const ctaItems = keys.flatMap((k) =>
    CTA_BUTTONS[k].map((b) => ({
      label: b.label,
      sub: landing === "todas" ? `${landingMeta(k).label} · ${b.ubicacion}` : b.ubicacion,
      value: Math.round(perLanding[k].ctaClicks * b.share),
      color: landing === "todas" ? landingMeta(k).color : undefined,
    }))
  ).sort((a, b) => b.value - a.value);

  const abandonos = totals.formInicio - totals.citas;
  const dropoff = (() => {
    const byField = new Map<string, number>();
    keys.forEach((k) => {
      const lost = perLanding[k].formInicio - perLanding[k].citas;
      FORM_DROPOFF[k].forEach((f) => byField.set(f.campo, (byField.get(f.campo) ?? 0) + Math.round(lost * f.share)));
    });
    // Mantener el orden real de los campos del formulario.
    return FORM_DROPOFF.studio
      .map((f) => f.campo)
      .filter((campo) => byField.has(campo))
      .map((label) => ({ label, value: byField.get(label)! }));
  })();

  const videos = VIDEOS.filter((v) => keys.includes(v.landing)).map((v) => {
    const plays = Math.round(perLanding[v.landing].visitas * v.playRate);
    return { ...v, plays };
  });

  const showStudio = keys.includes("studio");
  const servicios = SERVICIOS_STUDIO.map((s) => ({
    label: s.servicio,
    value: Math.round(perLanding.studio.formCompleto * s.share),
  }));

  const leads = LEADS_RECIENTES.filter((l) => keys.includes(l.landing));

  return (
    <div className="min-h-screen bg-silver-50">
      {/* ---------- Barra superior ---------- */}
      <div className="border-b border-silver-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-semibold tracking-[-0.02em] text-ink">Métricas de landings</h1>
              <span className="rounded-full bg-[#fff4e5] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#a15c00]">
                Datos de ejemplo
              </span>
            </div>
            <p className="mt-0.5 text-[12px] text-ink-faint">
              FOCUS Hub · {dates.length} días · {shortRange(dates)}
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-silver-200 px-3 py-1.5 text-[12px] font-medium text-ink-muted hover:text-ink">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {/* ---------- Filtros ---------- */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Segmented
            label="Landing"
            value={landing}
            onChange={setLanding}
            options={[
              { value: "todas", label: "Todas" },
              ...LANDINGS.map((l) => ({ value: l.key as LandingFilter, label: l.label, dot: l.color })),
            ]}
          />
          <Segmented
            label="Rango de fechas"
            value={range}
            onChange={setRange}
            options={RANGES.map((r) => ({ value: r, label: `${r} días` }))}
          />
        </div>

        {/* ---------- KPIs en secuencia ---------- */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {kpis.map((k, i) => (
            <KpiTile
              key={k.key}
              label={k.label}
              value={totals[k.key]}
              previous={prev[k.key]}
              rate={k.rate}
              theme={{ ...STEP_THEMES[i], ...KPI_COLOR }}
              compareLabel={`vs. ${range} días anteriores`}
            />
          ))}
        </div>

        {/* ---------- Embudo + comparativa ---------- */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Card
            title="Recorrido del visitante"
            subtitle="Cuántas personas avanzan en cada paso y cuántas se pierden"
            action={
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-wide text-ink-faint">Conversión total</p>
                <p className="text-xl font-semibold tabular-nums text-ink">{pct(totals.citas, totals.visitas, 2)}</p>
              </div>
            }
          >
            <FlowFunnel stages={stages} />
          </Card>

          <Card title="Performance vs. Studio" subtitle="% que avanza de cada paso al siguiente">
            <div className="mb-5 grid grid-cols-2 gap-2">
              {LANDINGS.map((l) => (
                <div key={l.key} className="rounded-xl px-3 py-2" style={{ backgroundColor: `${l.color}14` }}>
                  <p className="flex items-center gap-1.5 text-[12px] font-semibold text-ink">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                    {l.label}
                  </p>
                  <p className="mt-0.5 text-[20px] font-bold leading-none tabular-nums" style={{ color: l.color }}>
                    {pct(perLanding[l.key].citas, perLanding[l.key].visitas, 2)}
                  </p>
                  <p className="mt-0.5 text-[10px] text-ink-faint">conversión total a cita</p>
                </div>
              ))}
            </div>
            <GroupedColumns
              series={LANDINGS}
              groups={stages.slice(1).map((s, i) => {
                const from = stages[i].key as MetricKey;
                const to = s.key as MetricKey;
                return {
                  label: s.label,
                  values: LANDINGS.map((l) => {
                    const t = perLanding[l.key];
                    return t[from] ? t[to] / t[from] : 0;
                  }),
                  detail: LANDINGS.map((l) => {
                    const t = perLanding[l.key];
                    return `${NUM.format(t[to])} de ${NUM.format(t[from])}`;
                  }),
                };
              })}
            />
          </Card>
        </div>

        {/* ---------- Tendencia ---------- */}
        <Card
          className="mt-4"
          title="Tendencia diaria"
          subtitle="Pasa el cursor sobre la gráfica para ver cada día"
          action={
            <Segmented
              label="Métrica"
              value={trendMetric}
              onChange={setTrendMetric}
              options={TREND_METRICS.map((m) => ({ value: m.key, label: m.label }))}
            />
          }
        >
          {trendSeries.length > 1 && (
            <div className="-mt-2 mb-3 flex gap-4">
              {trendSeries.map((s) => (
                <div key={s.key} className="flex items-center gap-1.5 text-[12px] text-ink-muted">
                  <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label}
                </div>
              ))}
            </div>
          )}
          <TrendChart dates={dates} series={trendSeries} />
        </Card>

        {/* ---------- Scroll + mapa de calor ---------- */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.6fr]">
          <Card title="Profundidad de scroll" subtitle="Hasta dónde bajan los visitantes">
            <ColumnSteps
              base={totals.visitas}
              items={[
                { label: "25%", value: totals.scroll25 },
                { label: "50%", value: totals.scroll50 },
                { label: "75%", value: totals.scroll75 },
                { label: "100%", value: totals.scroll100 },
              ]}
            />
          </Card>
          <Card title="¿Cuándo llegan las visitas?" subtitle="Día de la semana y hora (hora de Puerto Rico)">
            <Heatmap grid={heatGrid} />
          </Card>
        </div>

        {/* ---------- Botones + abandono ---------- */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card title="Clics por botón" subtitle={`${NUM.format(totals.ctaClicks)} clics en total`}>
            <RankedPills items={ctaItems} color={BLUE_RAMP[4]} total={totals.ctaClicks} />
          </Card>
          <Card
            title="¿Dónde abandonan el formulario?"
            subtitle="Último paso que tocaron antes de irse"
            action={
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-wide text-ink-faint">Abandonos</p>
                <p className="text-xl font-semibold tabular-nums" style={{ color: BAD }}>{NUM.format(abandonos)}</p>
              </div>
            }
          >
            <DropoffColumns items={dropoff} total={abandonos} />
          </Card>
        </div>

        {/* ---------- Videos, servicios, tráfico ---------- */}
        <div className={`mt-4 grid gap-4 ${showStudio ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
          <Card title="Videos" subtitle="Reproducciones y hasta dónde los ven">
            {videos.length === 0 ? (
              <p className="text-[13px] text-ink-muted">Studio todavía no tiene videos.</p>
            ) : (
              <div className="space-y-5">
                {videos.map((v) => (
                  <div key={v.titulo}>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-[13px] font-medium text-ink">{v.titulo}</p>
                      <p className="shrink-0 text-[12px] text-ink-muted">
                        <span className="font-semibold tabular-nums text-ink">{NUM.format(v.plays)}</span> reproducciones
                      </p>
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-1.5">
                      {v.retencion.map((r, i) => (
                        <div key={i}>
                          <div className="h-10 rounded-md bg-silver-100 flex items-end overflow-hidden">
                            <div className="w-full rounded-md transition-[height] duration-700" style={{ height: `${r * 100}%`, backgroundColor: BLUE_RAMP[1 + i * 2] }} />
                          </div>
                          <p className="mt-1 text-center text-[10px] text-ink-faint">
                            {25 * (i + 1)}% · <span className="font-semibold text-ink-soft">{Math.round(r * 100)}%</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {showStudio && (
            <Card title="Servicios más pedidos" subtitle="Studio · selección múltiple">
              <BarList items={servicios} color={LANDINGS[1].color} total={perLanding.studio.formCompleto} valueSuffix="leads" />
              <p className="mt-4 text-[11px] text-ink-faint">El % es sobre los formularios de Studio; cada persona puede elegir varios.</p>
            </Card>
          )}

          <Card title="Origen y dispositivo" subtitle="De dónde vienen y desde qué equipo">
            <SplitBar
              parts={[
                { label: "Móvil", value: totals.movil, color: "#2a78d6" },
                { label: "Escritorio", value: totals.visitas - totals.movil, color: "#1baf7a" },
              ]}
            />
            <div className="mt-6">
              <BarList items={FUENTES.map((f) => ({ label: f.fuente, value: Math.round(totals.visitas * f.share) }))} color={BLUE_RAMP[3]} total={totals.visitas} />
            </div>
          </Card>
        </div>

        {/* ---------- Leads recientes ---------- */}
        <Card className="mt-4" title="Últimos leads" subtitle="Personas que completaron el formulario">
          <div className="-mx-4 overflow-x-auto sm:-mx-5 md:-mx-6">
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-silver-200 text-[11px] uppercase tracking-wide text-ink-faint">
                  <th className="px-4 py-2 font-semibold sm:px-5 md:px-6">Fecha</th>
                  <th className="py-2 pr-4 font-semibold">Nombre</th>
                  <th className="py-2 pr-4 font-semibold">Dealership</th>
                  <th className="py-2 pr-4 font-semibold">Cargo</th>
                  <th className="py-2 pr-4 font-semibold">Landing</th>
                  <th className="py-2 pr-5 font-semibold md:pr-6">Estado</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.fecha + l.nombre} className="border-b border-silver-100 last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-ink-muted sm:px-5 md:px-6">{l.fecha}</td>
                    <td className="py-3 pr-4 font-medium text-ink">{l.nombre}</td>
                    <td className="py-3 pr-4 text-ink-soft">{l.dealership}</td>
                    <td className="py-3 pr-4 text-ink-soft">{l.cargo}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-1.5 text-ink-soft">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: landingMeta(l.landing).color }} />
                        {landingMeta(l.landing).label}
                      </span>
                      {l.servicios && <p className="mt-0.5 text-[11px] text-ink-faint">{l.servicios}</p>}
                    </td>
                    <td className="py-3 pr-5 md:pr-6">
                      {l.estado === "Cita agendada" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f6ef] px-2 py-0.5 text-[11px] font-semibold" style={{ color: GOOD }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Cita · {l.cita}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#fdeeee] px-2 py-0.5 text-[11px] font-semibold" style={{ color: BAD }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                          No agendó
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="mt-6 text-center text-[11px] text-ink-faint">
          Vista previa con datos de ejemplo. Los números reales aparecerán al conectar el backend.
        </p>
      </div>
    </div>
  );
}

function shortRange(dates: string[]) {
  if (!dates.length) return "";
  const f = (iso: string) => new Intl.DateTimeFormat("es", { day: "numeric", month: "short" }).format(new Date(`${iso}T00:00:00`));
  return `${f(dates[0])} – ${f(dates[dates.length - 1])}`;
}
