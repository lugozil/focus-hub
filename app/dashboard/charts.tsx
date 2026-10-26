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
/* Embudo de flujo (recorrido del visitante)                           */
/* ------------------------------------------------------------------ */

export type FunnelStage = { key: string; label: string; hint: string; value: number; color: string };

/**
 * Embudo horizontal: cada paso es una columna centrada cuya altura es
 * proporcional a las personas que llegan a él; la banda entre columnas
 * muestra cuántos avanzan y cuántos se pierden.
 */
export function FlowFunnel({ stages }: { stages: FunnelStage[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const top = Math.max(1, stages[0]?.value ?? 1);
  const n = stages.length;
  const W = 600;
  const H = 180;
  const col = W / n;
  const barW = col * 0.5;
  const bars = stages.map((s, i) => {
    const h = Math.max(8, (s.value / top) * H);
    return { x: i * col + (col - barW) / 2, y: (H - h) / 2, h };
  });
  const dim = (i: number) => (hover !== null && hover !== i ? 0.4 : 1);

  return (
    <>
      {/* Móvil: embudo vertical con barras centradas */}
      <ol className="sm:hidden">
        {stages.map((s, i) => {
          const prev = stages[i - 1];
          return (
            <li key={s.key}>
              {prev && (
                <p className="py-1.5 text-center text-[11px] text-ink-faint">
                  ↓ <span className="font-bold text-ink-soft">{pct(s.value, prev.value, 0)}</span> avanza ·{" "}
                  <span className="font-semibold" style={{ color: BAD }}>−{NUM.format(prev.value - s.value)}</span>
                </p>
              )}
              <div className="flex items-baseline justify-between gap-2">
                <p className="flex items-center gap-1.5 text-[13px] font-medium text-ink">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: s.color }}>
                    {i + 1}
                  </span>
                  {s.label}
                </p>
                <p className="text-[15px] font-bold tabular-nums text-ink">
                  {NUM.format(s.value)}{" "}
                  <span className="text-[11px] font-semibold" style={{ color: s.color }}>{pct(s.value, top, s.value === top ? 0 : 1)}</span>
                </p>
              </div>
              <div className="mt-1.5 flex justify-center">
                <div className="h-6 rounded-md" style={{ width: `${Math.max(4, (s.value / top) * 100)}%`, backgroundColor: s.color }} />
              </div>
            </li>
          );
        })}
      </ol>

    <div className="-mx-1 hidden overflow-x-auto px-1 [scrollbar-width:thin] sm:block">
      <div className="min-w-[600px]">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {stages.map((s, i) => (
            <div
              key={s.key}
              className="px-1 text-center transition-opacity"
              style={{ opacity: dim(i) }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              title={s.hint}
            >
              <span
                className="mx-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: s.color }}
              >
                {i + 1}
              </span>
              <p className="mt-1.5 min-h-[32px] text-[12px] font-medium leading-tight text-ink-soft">{s.label}</p>
              <p className="mt-1 text-[22px] font-bold leading-none tabular-nums text-ink">{NUM.format(s.value)}</p>
              <p className="mt-1 text-[11px] font-semibold tabular-nums" style={{ color: s.color }}>
                {pct(s.value, top, s.value === top ? 0 : 1)}
              </p>
            </div>
          ))}
        </div>

        <div className="relative mt-3">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-[180px] w-full" aria-hidden="true">
            {bars.slice(0, -1).map((b, i) => {
              const nb = bars[i + 1];
              return (
                <polygon
                  key={`band-${i}`}
                  points={`${b.x + barW},${b.y} ${nb.x},${nb.y} ${nb.x},${nb.y + nb.h} ${b.x + barW},${b.y + b.h}`}
                  fill={stages[i].color}
                  opacity={hover === null || hover === i || hover === i + 1 ? 0.16 : 0.06}
                  className="transition-opacity"
                />
              );
            })}
            {bars.map((b, i) => (
              <rect
                key={stages[i].key}
                x={b.x}
                y={b.y}
                width={barW}
                height={b.h}
                rx={6}
                fill={stages[i].color}
                opacity={dim(i)}
                className="transition-[opacity] duration-300"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
          </svg>

          {stages.slice(1).map((s, j) => {
            const prev = stages[j];
            const lost = prev.value - s.value;
            return (
              <div
                key={`drop-${s.key}`}
                className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white/90 px-1.5 py-1 text-center leading-tight shadow-sm ring-1 ring-silver-200"
                style={{ left: `${((j + 1) / n) * 100}%` }}
              >
                <p className="text-[11px] font-bold tabular-nums text-ink">{pct(s.value, prev.value, 0)}</p>
                <p className="text-[10px] font-semibold tabular-nums" style={{ color: BAD }}>
                  −{NUM.format(lost)}
                </p>
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-center text-[11px] text-ink-faint">
          Entre cada paso: <span className="font-semibold text-ink-soft">% que avanza</span> y{" "}
          <span className="font-semibold" style={{ color: BAD }}>personas que se pierden</span>
        </p>
      </div>
    </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Comparativa entre landings (de cada 100 visitantes)                  */
/* ------------------------------------------------------------------ */

export type CompareSeries = { key: string; label: string; color: string };

/**
 * Una fila por paso; dentro, una barra por landing con el % de sus visitas
 * que llega a ese paso. Las barras de cada fila se escalan a la mayor de la
 * fila para que se vea quién gana aunque los números sean pequeños.
 */
export function LandingCompare({
  series,
  bases,
  steps,
}: {
  series: CompareSeries[];
  /** Visitas de cada landing, en el orden de `series`. */
  bases: number[];
  steps: { label: string; values: number[] }[];
}) {
  return (
    <div className="space-y-4">
      {steps.map((step) => {
        const shares = step.values.map((v, i) => (bases[i] > 0 ? v / bases[i] : 0));
        const max = Math.max(...shares);
        return (
          <div key={step.label}>
            <p className="mb-1.5 text-[12px] font-semibold text-ink">{step.label}</p>
            <div className="space-y-1">
              {series.map((s, i) => {
                const best = max > 0 && shares[i] === max && shares.filter((x) => x === max).length === 1;
                return (
                  <div key={s.key} className="flex items-center gap-2">
                    <div className="h-2.5 flex-1 rounded-full bg-silver-100">
                      <div
                        className="h-full rounded-full transition-[width] duration-700 ease-out"
                        style={{ width: max > 0 ? `${Math.max(1.5, (shares[i] / max) * 100)}%` : "0%", backgroundColor: s.color }}
                      />
                    </div>
                    <p className="w-[118px] shrink-0 text-right text-[12px] tabular-nums text-ink-muted">
                      <span className={best ? "font-bold" : "font-medium"} style={{ color: best ? s.color : undefined }}>
                        {per100(shares[i])}
                      </span>{" "}
                      de 100
                      <span className="ml-1 text-[10px] text-ink-faint">({NUM.format(step.values[i])})</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <p className="text-[11px] text-ink-faint">En cada paso, la barra más larga es la landing que mejor lo hace; el número entre paréntesis son personas.</p>
    </div>
  );
}

/** 0.189 → "18,9"; por encima de 10 se redondea a entero para leerlo rápido. */
export function per100(share: number) {
  const v = share * 100;
  if (v === 0) return "0";
  return v >= 10 ? Math.round(v).toString() : v.toFixed(1).replace(".", ",");
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
/* Profundidad de scroll                                               */
/* ------------------------------------------------------------------ */

const SCROLL_STEPS = [
  { label: "Entran a la página", hint: "Ven lo primero (el inicio)" },
  { label: "Pasan el primer cuarto", hint: "25% de la página" },
  { label: "Llegan a la mitad", hint: "50% de la página" },
  { label: "Pasan los tres cuartos", hint: "75% de la página" },
  { label: "Llegan al final", hint: "Vieron toda la página" },
];

/**
 * La página se lee de arriba abajo: cada fila es una altura de la página y
 * la barra es el % de los visitantes que sigue ahí. Entre filas se marca
 * cuántos se fueron en ese tramo.
 */
export function ScrollDepth({
  series,
}: {
  /** values: personas que llegan a 25/50/75/100%; base: visitas. */
  series: (CompareSeries & { base: number; values: number[] })[];
}) {
  const levels = series.map((s) => [s.base, ...s.values]);
  return (
    <div>
      {SCROLL_STEPS.map((step, i) => (
        <div key={step.label}>
          {i > 0 && (
            <div className="flex flex-wrap gap-x-3 py-1 pl-3 text-[11px]">
              {series.map((s, si) => {
                const [from, to] = [levels[si][i - 1], levels[si][i]];
                const lost = s.base > 0 ? Math.max(0, from - to) / s.base : 0;
                return (
                  <span key={s.key} className="inline-flex items-center gap-1" style={{ color: lost >= 0.2 ? BAD : undefined }}>
                    <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden="true" className={lost >= 0.2 ? "" : "text-ink-faint"}>
                      <path d="M5 9L1 3h8z" fill="currentColor" />
                    </svg>
                    <span className={lost >= 0.2 ? "font-semibold" : "text-ink-faint"}>
                      {series.length > 1 && `${s.label}: `}se van {per100(lost)} de 100
                    </span>
                  </span>
                );
              })}
            </div>
          )}
          <div className="rounded-xl border border-silver-200 px-3 py-2">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[12px] font-semibold text-ink">{step.label}</p>
              <p className="text-[10px] text-ink-faint">{step.hint}</p>
            </div>
            <div className="mt-1.5 space-y-1">
              {series.map((s, si) => {
                const share = s.base > 0 ? levels[si][i] / s.base : 0;
                return (
                  <div key={s.key} className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-silver-100">
                      <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${share * 100}%`, backgroundColor: s.color }} />
                    </div>
                    <p className="w-[70px] shrink-0 text-right text-[12px] tabular-nums text-ink-muted">
                      <span className="font-semibold text-ink">{per100(share)}</span> de 100
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
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

/* ------------------------------------------------------------------ */
/* Ranking en píldoras (clics por botón)                               */
/* ------------------------------------------------------------------ */

export function RankedPills({
  items,
  color,
  total,
}: {
  items: { label: string; sub?: string; value: number; color?: string }[];
  color: string;
  total: number;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const [hover, setHover] = useState<number | null>(null);
  return (
    <ol className="space-y-2">
      {items.map((item, i) => {
        const c = item.color ?? color;
        return (
          <li
            key={`${item.label}-${item.sub ?? i}`}
            className="relative flex h-14 items-center overflow-hidden rounded-xl bg-silver-50 transition-opacity"
            style={{ opacity: hover !== null && hover !== i ? 0.5 : 1 }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-xl transition-[width] duration-700 ease-out"
              style={{ width: `${Math.max(6, (item.value / max) * 100)}%`, background: `linear-gradient(90deg, ${c}33, ${c}1f)`, borderLeft: `4px solid ${c}` }}
            />
            <span
              className="relative ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold text-white"
              style={{ backgroundColor: c }}
            >
              {i + 1}
            </span>
            <div className="relative ml-3 min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-ink">{item.label}</p>
              {item.sub && <p className="truncate text-[11px] text-ink-muted">{item.sub}</p>}
            </div>
            <div className="relative mr-3 shrink-0 text-right">
              <p className="text-[16px] font-bold leading-none tabular-nums text-ink">{NUM.format(item.value)}</p>
              <p className="mt-0.5 text-[11px] font-semibold tabular-nums" style={{ color: c }}>{pct(item.value, total, 0)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Columnas de fuga (abandono por campo, en orden del formulario)      */
/* ------------------------------------------------------------------ */

export function DropoffColumns({ items, total }: { items: { label: string; value: number }[]; total: number }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const worst = items.findIndex((i) => i.value === max);
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div>
      <div className="flex h-52 items-end gap-1.5 sm:gap-2">
        {items.map((item, i) => {
          const isWorst = i === worst;
          return (
            <div
              key={item.label}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end transition-opacity"
              style={{ opacity: hover !== null && hover !== i ? 0.45 : 1 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {isWorst && (
                <span className="mb-1 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white" style={{ backgroundColor: BAD }}>
                  Mayor fuga
                </span>
              )}
              <p className="text-[12px] font-bold tabular-nums" style={{ color: isWorst ? BAD : "#2A2A2A" }}>{pct(item.value, total, 0)}</p>
              <p className="mb-1 text-[10px] tabular-nums text-ink-faint">{NUM.format(item.value)}</p>
              <div
                className="w-full max-w-[44px] rounded-t-lg transition-[height] duration-700 ease-out"
                style={{
                  height: `${Math.max(3, (item.value / max) * 62)}%`,
                  background: isWorst ? `linear-gradient(180deg, ${BAD}, #e2635f)` : "linear-gradient(180deg, #f3a37f, #f8c9b2)",
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-1.5 border-t border-silver-200 pt-2 sm:gap-2">
        {items.map((item, i) => (
          <p key={item.label} className="min-w-0 flex-1 text-center text-[10px] font-medium leading-tight text-ink-muted" style={{ color: i === worst ? BAD : undefined }}>
            {item.label}
          </p>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-ink-faint">En el orden del formulario: cada columna es el último campo que tocaron antes de irse.</p>
    </div>
  );
}
