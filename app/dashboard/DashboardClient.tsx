"use client";

import { useState } from "react";

type DayPoint = { fecha: string; vistas: number; fase1: number; citas: number };

type SummaryPayload =
  | {
      ok: true;
      variante: string;
      dias: number;
      totales: { vistas: number; fase1: number; citas: number };
      porDia: DayPoint[];
    }
  | { ok: false; error: string };

const SERIES = [
  { key: "vistas" as const, label: "Vistas", color: "#2a78d6" },
  { key: "fase1" as const, label: "Formularios completados", color: "#eb6834" },
  { key: "citas" as const, label: "Citas agendadas", color: "#1baf7a" },
];

const NUMBER_FORMATTER = new Intl.NumberFormat("es-US");

function formatPct(numerator: number, denominator: number) {
  if (denominator <= 0) return "—";
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

function formatShortDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat("es", { day: "numeric", month: "short" }).format(d);
}

function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-silver-200 bg-white p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      {sub && <p className="mt-1 text-[12px] text-ink-muted">{sub}</p>}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {SERIES.map((s) => (
        <div key={s.key} className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded-full" style={{ backgroundColor: s.color }} />
          <span className="text-[12px] text-ink-muted">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function TrendChart({ data }: { data: DayPoint[] }) {
  const width = 760;
  const height = 260;
  const padding = { top: 16, right: 12, bottom: 24, left: 40 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const maxValue = Math.max(1, ...data.flatMap((d) => [d.vistas, d.fase1, d.citas]));
  const yMax = Math.max(1, Math.ceil(maxValue * 1.15));

  const xFor = (i: number) => (data.length <= 1 ? 0 : (i / (data.length - 1)) * innerW);
  const yFor = (v: number) => innerH - (v / yMax) * innerH;

  const linePath = (key: "vistas" | "fase1" | "citas") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${xFor(i).toFixed(1)},${yFor(d[key]).toFixed(1)}`).join(" ");

  const ticks = [0, Math.round(yMax / 2), yMax];

  function handleMove(e: React.MouseEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.min(1, Math.max(0, x / innerW));
    const idx = data.length > 1 ? Math.round(ratio * (data.length - 1)) : 0;
    setHoverIndex(idx);
  }

  const hovered = hoverIndex !== null ? data[hoverIndex] : null;
  const tooltipLeftPct = hovered ? ((padding.left + xFor(hoverIndex!)) / width) * 100 : 0;
  const tooltipAlignEnd = hovered ? hoverIndex! > data.length / 2 : false;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label="Vistas, formularios completados y citas agendadas por día"
      >
        <g transform={`translate(${padding.left},${padding.top})`}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={0} x2={innerW} y1={yFor(t)} y2={yFor(t)} stroke="#E8EAEC" strokeWidth={1} />
              <text x={-8} y={yFor(t)} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="#8A8E94">
                {NUMBER_FORMATTER.format(t)}
              </text>
            </g>
          ))}

          {SERIES.map((s) => (
            <path
              key={s.key}
              d={linePath(s.key)}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {SERIES.map((s) => {
            const last = data[data.length - 1];
            if (!last) return null;
            return (
              <circle
                key={`${s.key}-end`}
                cx={innerW}
                cy={yFor(last[s.key])}
                r={4}
                fill={s.color}
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            );
          })}

          {hovered && (
            <>
              <line x1={xFor(hoverIndex!)} x2={xFor(hoverIndex!)} y1={0} y2={innerH} stroke="#D5D8DC" strokeWidth={1} />
              {SERIES.map((s) => (
                <circle
                  key={`${s.key}-hover`}
                  cx={xFor(hoverIndex!)}
                  cy={yFor(hovered[s.key])}
                  r={4}
                  fill={s.color}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              ))}
            </>
          )}

          <rect
            x={0}
            y={0}
            width={innerW}
            height={innerH}
            fill="transparent"
            onMouseMove={handleMove}
            onMouseLeave={() => setHoverIndex(null)}
          />
        </g>
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-[168px] rounded-lg border border-silver-200 bg-white px-3 py-2 shadow-lg"
          style={{
            left: `${tooltipLeftPct}%`,
            transform: tooltipAlignEnd ? "translateX(-100%)" : "none",
          }}
        >
          <p className="text-[12px] font-semibold text-ink">{formatShortDate(hovered.fecha)}</p>
          {SERIES.map((s) => (
            <p key={s.key} className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-muted">
              <span className="inline-block h-0.5 w-3 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="font-semibold text-ink">{hovered[s.key]}</span> {s.label}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function DailyTable({ data }: { data: DayPoint[] }) {
  return (
    <details className="rounded-2xl border border-silver-200 bg-white">
      <summary className="cursor-pointer select-none px-5 py-3 text-[13px] font-medium text-ink-muted hover:text-ink">
        Ver detalle por día en tabla
      </summary>
      <div className="overflow-x-auto border-t border-silver-200 px-5 py-3">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="text-ink-faint">
              <th className="py-1.5 pr-4 font-semibold uppercase tracking-wide">Fecha</th>
              <th className="py-1.5 pr-4 font-semibold uppercase tracking-wide">Vistas</th>
              <th className="py-1.5 pr-4 font-semibold uppercase tracking-wide">Formularios</th>
              <th className="py-1.5 font-semibold uppercase tracking-wide">Citas</th>
            </tr>
          </thead>
          <tbody>
            {[...data].reverse().map((d) => (
              <tr key={d.fecha} className="border-t border-silver-100 text-ink">
                <td className="py-1.5 pr-4 text-ink-muted">{formatShortDate(d.fecha)}</td>
                <td className="py-1.5 pr-4 tabular-nums">{d.vistas}</td>
                <td className="py-1.5 pr-4 tabular-nums">{d.fase1}</td>
                <td className="py-1.5 tabular-nums">{d.citas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export function DashboardClient({ summary }: { summary: SummaryPayload }) {
  if (!summary.ok) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-silver-200 bg-white p-8 text-center">
          <p className="text-sm font-medium text-ink">No se pudo cargar el resumen de métricas.</p>
          <p className="mt-2 text-[13px] text-ink-muted">
            Error: <span className="font-mono">{summary.error}</span>. Revisa que{" "}
            <span className="font-mono">GOOGLE_SCRIPT_URL</span> y{" "}
            <span className="font-mono">DASHBOARD_SECRET</span> estén configuradas, y que el Apps Script tenga
            desplegada la última versión con el endpoint <span className="font-mono">doGet</span>.
          </p>
        </div>
      </div>
    );
  }

  const { totales, porDia, variante, dias } = summary;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
          Dashboard interno · {variante}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-ink">
          Rendimiento de los últimos {dias} días
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Vistas totales" value={NUMBER_FORMATTER.format(totales.vistas)} />
        <StatTile
          label="Formularios completados"
          value={NUMBER_FORMATTER.format(totales.fase1)}
          sub={`${formatPct(totales.fase1, totales.vistas)} de las vistas`}
        />
        <StatTile
          label="Citas agendadas"
          value={NUMBER_FORMATTER.format(totales.citas)}
          sub={`${formatPct(totales.citas, totales.fase1)} de los formularios`}
        />
        <StatTile label="Tasa vista → cita" value={formatPct(totales.citas, totales.vistas)} />
      </div>

      <div className="mt-8 rounded-2xl border border-silver-200 bg-white p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-ink">Tendencia diaria</h2>
          <Legend />
        </div>
        <div className="mt-4">
          <TrendChart data={porDia} />
        </div>
      </div>

      <div className="mt-4">
        <DailyTable data={porDia} />
      </div>
    </div>
  );
}
