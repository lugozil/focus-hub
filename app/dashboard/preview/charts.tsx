"use client";

import { useEffect, useRef, useState } from "react";

export const NUM = new Intl.NumberFormat("es-US");

export function pct(n: number, d: number, digits = 1) {
  if (d <= 0) return "—";
  return `${((n / d) * 100).toFixed(digits)}%`;
}

/** Rampa azul ordinal (oscuro → claro), todos los pasos ≥ 2:1 sobre blanco. */
export const BLUE_RAMP = ["#104281", "#184f95", "#1c5cab", "#256abf", "#2a78d6", "#3987e5", "#5598e7", "#6da7ec"];
/** Rampa secuencial para el mapa de calor (claro → oscuro). */
const HEAT_RAMP = ["#f2f6fc", "#cde2fb", "#b7d3f6", "#9ec5f4", "#86b6ef", "#6da7ec", "#5598e7", "#3987e5", "#2a78d6", "#256abf", "#1c5cab", "#184f95", "#104281"];

export const GOOD = "#0d8a5a";
export const BAD = "#c93b3a";
export const GRID = "#E8EAEC";
export const AXIS_TEXT = "#8A8E94";

/* ------------------------------------------------------------------ */
/* Tooltip                                                             */
/* ------------------------------------------------------------------ */

export function Tooltip({
  x,
  y,
  alignEnd,
  children,
}: {
  x: number | string;
  y: number | string;
  alignEnd?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="pointer-events-none absolute z-20 min-w-[150px] rounded-lg border border-silver-200 bg-white px-3 py-2 text-[12px] shadow-lg"
      style={{ left: x, top: y, transform: `translate(${alignEnd ? "calc(-100% - 12px)" : "12px"}, -50%)` }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sparkline                                                           */
/* ------------------------------------------------------------------ */

export function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 120;
  const h = 32;
  const max = Math.max(1, ...values);
  const min = Math.min(...values);
  const span = Math.max(1, max - min);
  const pts = values.map((v, i) => [
    values.length <= 1 ? 0 : (i / (values.length - 1)) * w,
    h - 3 - ((v - min) / span) * (h - 6),
  ]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-full" preserveAspectRatio="none" aria-hidden="true">
      <path d={area} fill={color} opacity={0.1} />
      <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {last && <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Embudo                                                              */
/* ------------------------------------------------------------------ */

export type FunnelStage = { key: string; label: string; hint: string; value: number };

export function Funnel({ stages }: { stages: FunnelStage[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const top = Math.max(1, stages[0]?.value ?? 1);

  return (
    <ol className="space-y-1">
      {stages.map((stage, i) => {
        const width = Math.max(3, (stage.value / top) * 100);
        const prev = stages[i - 1];
        const lost = prev ? prev.value - stage.value : 0;
        const dim = hover !== null && hover !== i;
        return (
          <li key={stage.key}>
            {prev && (
              <div className="flex items-center gap-2 py-1 pl-1 text-[11px] md:text-[12px] text-ink-faint">
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                  <path d="M5 1v8m0 0L2 6m3 3l3-3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                </svg>
                <span>
                  <span className="font-semibold text-ink-soft">{pct(stage.value, prev.value)}</span> continúa
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  se pierden <span className="font-semibold" style={{ color: BAD }}>{NUM.format(lost)}</span> ({pct(lost, prev.value)})
                </span>
              </div>
            )}
            <div
              className="group grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-1 py-1 transition-opacity"
              style={{ opacity: dim ? 0.45 : 1 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <div className="min-w-0">
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-silver-100 text-[10px] font-semibold text-ink-soft">
                    {i + 1}
                  </span>
                  <span className="truncate text-[13px] font-medium text-ink">{stage.label}</span>
                  <span className="hidden sm:inline truncate text-[11px] text-ink-faint">{stage.hint}</span>
                </div>
                <div className="h-7 w-full rounded-md bg-silver-50">
                  <div
                    className="h-full rounded-md transition-[width] duration-700 ease-out"
                    style={{ width: `${width}%`, backgroundColor: BLUE_RAMP[Math.min(i, BLUE_RAMP.length - 1)] }}
                  />
                </div>
              </div>
              <div className="w-[64px] text-right">
                <p className="text-[15px] font-semibold tabular-nums text-ink">{NUM.format(stage.value)}</p>
                <p className="text-[11px] tabular-nums text-ink-faint">{pct(stage.value, top, stage.value === top ? 0 : 1)}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Tendencia (líneas con crosshair)                                    */
/* ------------------------------------------------------------------ */

export type TrendSeries = { key: string; label: string; color: string; values: number[] };

function useWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(Math.max(280, Math.round(el.getBoundingClientRect().width)));
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

export function TrendChart({ dates, series }: { dates: string[]; series: TrendSeries[] }) {
  const [wrapRef, width] = useWidth<HTMLDivElement>(760);
  const height = width < 500 ? 220 : 280;
  const pad = { top: 14, right: 14, bottom: 26, left: 40 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const [hover, setHover] = useState<number | null>(null);

  const maxValue = Math.max(1, ...series.flatMap((s) => s.values));
  const step = niceStep(maxValue);
  const yMax = Math.ceil((maxValue * 1.08) / step) * step;
  const ticks = Array.from({ length: Math.floor(yMax / step) + 1 }, (_, i) => i * step);

  const n = dates.length;
  const xFor = (i: number) => (n <= 1 ? 0 : (i / (n - 1)) * innerW);
  const yFor = (v: number) => innerH - (v / yMax) * innerH;

  const labelEvery = Math.max(1, Math.ceil(n / (width < 500 ? 4 : 7)));
  const single = series.length === 1;

  function onMove(e: React.MouseEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setHover(Math.round(ratio * (n - 1)));
  }

  return (
    <div ref={wrapRef} className="relative">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block" role="img" aria-label="Tendencia diaria">
        <g transform={`translate(${pad.left},${pad.top})`}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={0} x2={innerW} y1={yFor(t)} y2={yFor(t)} stroke={GRID} />
              <text x={-8} y={yFor(t)} textAnchor="end" dominantBaseline="middle" fontSize={11} fill={AXIS_TEXT}>
                {NUM.format(t)}
              </text>
            </g>
          ))}
          {dates.map((d, i) =>
            i === n - 1 || (i % labelEvery === 0 && n - 1 - i >= labelEvery * 0.7) ? (
              <text key={d} x={xFor(i)} y={innerH + 17} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fontSize={11} fill={AXIS_TEXT}>
                {shortDate(d)}
              </text>
            ) : null
          )}

          {series.map((s) => {
            const line = s.values.map((v, i) => `${i ? "L" : "M"}${xFor(i).toFixed(1)},${yFor(v).toFixed(1)}`).join(" ");
            return (
              <g key={s.key}>
                {single && <path d={`${line} L${innerW},${innerH} L0,${innerH} Z`} fill={s.color} opacity={0.08} />}
                <path d={line} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              </g>
            );
          })}

          {hover !== null && (
            <g>
              <line x1={xFor(hover)} x2={xFor(hover)} y1={0} y2={innerH} stroke="#C0C4C9" strokeDasharray="3 3" />
              {series.map((s) => (
                <circle key={s.key} cx={xFor(hover)} cy={yFor(s.values[hover] ?? 0)} r={4.5} fill={s.color} stroke="#fff" strokeWidth={2} />
              ))}
            </g>
          )}

          <rect x={0} y={0} width={innerW} height={innerH} fill="transparent" onMouseMove={onMove} onMouseLeave={() => setHover(null)} />
        </g>
      </svg>

      {hover !== null && (
        <Tooltip
          x={`${((pad.left + xFor(hover)) / width) * 100}%`}
          y="35%"
          alignEnd={hover > n / 2}
        >
          <p className="font-semibold text-ink">{longDate(dates[hover])}</p>
          {series.map((s) => (
            <p key={s.key} className="mt-1 flex items-center gap-1.5 text-ink-muted">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="font-semibold tabular-nums text-ink">{NUM.format(s.values[hover] ?? 0)}</span>
              {s.label}
            </p>
          ))}
        </Tooltip>
      )}
    </div>
  );
}

function niceStep(max: number) {
  const raw = max / 4;
  const mag = 10 ** Math.floor(Math.log10(Math.max(1, raw)));
  const norm = raw / mag;
  return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
}

export function shortDate(iso: string) {
  return new Intl.DateTimeFormat("es", { day: "numeric", month: "short" }).format(new Date(`${iso}T00:00:00`));
}

function longDate(iso: string) {
  return new Intl.DateTimeFormat("es", { weekday: "short", day: "numeric", month: "long" }).format(new Date(`${iso}T00:00:00`));
}

/* ------------------------------------------------------------------ */
/* Lista de barras horizontales                                        */
/* ------------------------------------------------------------------ */

export function BarList({
  items,
  color,
  total,
  valueSuffix,
}: {
  items: { label: string; sub?: string; value: number; color?: string }[];
  color: string;
  /** Si se pasa, muestra el % sobre este total. */
  total?: number;
  valueSuffix?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const [hover, setHover] = useState<number | null>(null);
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li
          key={`${item.label}-${item.sub ?? i}`}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          className="transition-opacity"
          style={{ opacity: hover !== null && hover !== i ? 0.5 : 1 }}
        >
          <div className="flex items-baseline justify-between gap-3">
            <p className="min-w-0 truncate text-[13px] text-ink">
              {item.label}
              {item.sub && <span className="ml-1.5 text-[11px] text-ink-faint">{item.sub}</span>}
            </p>
            <p className="shrink-0 text-[13px] tabular-nums text-ink">
              <span className="font-semibold">{NUM.format(item.value)}</span>
              {valueSuffix && <span className="text-ink-faint"> {valueSuffix}</span>}
              {total !== undefined && <span className="ml-1.5 text-[11px] text-ink-faint">{pct(item.value, total, 0)}</span>}
            </p>
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-silver-100">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{ width: `${Math.max(2, (item.value / max) * 100)}%`, backgroundColor: item.color ?? color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Columnas (profundidad de scroll)                                    */
/* ------------------------------------------------------------------ */

export function ColumnSteps({ items, base }: { items: { label: string; value: number }[]; base: number }) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="flex h-48 items-end gap-2 sm:gap-4">
      {items.map((item, i) => {
        const h = Math.max(4, (item.value / Math.max(1, base)) * 100);
        return (
          <div
            key={item.label}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ opacity: hover !== null && hover !== i ? 0.5 : 1 }}
          >
            <p className="text-[13px] font-semibold tabular-nums text-ink">{pct(item.value, base, 0)}</p>
            <p className="-mt-1 text-[10px] tabular-nums text-ink-faint">{NUM.format(item.value)}</p>
            <div className="w-full max-w-[64px] rounded-t-md transition-[height] duration-700 ease-out" style={{ height: `${h}%`, backgroundColor: BLUE_RAMP[2 + i * 2] ?? BLUE_RAMP[7] }} />
            <p className="text-[11px] font-medium text-ink-muted">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mapa de calor (día × hora)                                          */
/* ------------------------------------------------------------------ */

const DAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function Heatmap({ grid }: { grid: number[][] }) {
  const max = Math.max(1, ...grid.flat());
  const [hover, setHover] = useState<{ d: number; h: number } | null>(null);

  const hourLabel = (h: number) => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? "a" : "p"}`;

  return (
    <div className="relative">
      <div>
        <div>
          <div className="grid grid-cols-[28px_repeat(24,minmax(0,1fr))] gap-[2px] sm:grid-cols-[36px_repeat(24,minmax(0,1fr))]">
            {grid.map((row, d) => (
              <div key={d} className="contents">
                <span className="pr-1 text-right text-[10px] leading-[18px] text-ink-faint">{DAY_LABELS[d]}</span>
                {row.map((v, h) => {
                  const idx = Math.min(HEAT_RAMP.length - 1, Math.round((v / max) * (HEAT_RAMP.length - 1)));
                  const active = hover?.d === d && hover?.h === h;
                  return (
                    <div
                      key={h}
                      className="h-[16px] sm:h-[18px] rounded-[2px] sm:rounded-[3px]"
                      style={{ backgroundColor: HEAT_RAMP[idx], outline: active ? "2px solid #2A2A2A" : undefined, outlineOffset: -1 }}
                      onMouseEnter={() => setHover({ d, h })}
                      onMouseLeave={() => setHover(null)}
                    />
                  );
                })}
              </div>
            ))}
            <span />
            {Array.from({ length: 24 }, (_, h) => (
              <span key={h} className="whitespace-nowrap text-center text-[9px] text-ink-faint">
                <span className="sm:hidden">{h % 6 === 0 ? hourLabel(h) : ""}</span>
                <span className="hidden sm:inline">{h % 3 === 0 ? hourLabel(h) : ""}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] text-ink-faint">
          Menos
          <div className="flex gap-[2px]">
            {HEAT_RAMP.filter((_, i) => i % 2 === 0).map((c) => (
              <span key={c} className="h-2.5 w-4 rounded-[2px]" style={{ backgroundColor: c }} />
            ))}
          </div>
          Más
        </div>
        <p className="min-h-[18px] text-[12px] text-ink-muted">
          {hover ? (
            <>
              <span className="font-semibold text-ink">{DAY_LABELS[hover.d]} · {hourLabel(hover.h)}m</span> —{" "}
              <span className="font-semibold tabular-nums text-ink">{NUM.format(grid[hover.d][hover.h])}</span> visitas
            </>
          ) : (
            "Pasa el cursor por una celda"
          )}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Barra dividida (dispositivos)                                       */
/* ------------------------------------------------------------------ */

export function SplitBar({ parts }: { parts: { label: string; value: number; color: string }[] }) {
  const total = Math.max(1, parts.reduce((a, p) => a + p.value, 0));
  return (
    <div>
      <div className="flex h-4 w-full gap-[2px] overflow-hidden rounded-full">
        {parts.map((p) => (
          <div key={p.label} className="h-full transition-[width] duration-700" style={{ width: `${(p.value / total) * 100}%`, backgroundColor: p.color }} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {parts.map((p) => (
          <div key={p.label} className="flex items-center gap-2 text-[13px]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-ink-muted">{p.label}</span>
            <span className="font-semibold tabular-nums text-ink">{pct(p.value, total, 0)}</span>
            <span className="text-[11px] tabular-nums text-ink-faint">{NUM.format(p.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
