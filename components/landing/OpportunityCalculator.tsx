"use client";

import { useMemo, useState } from "react";

const TARGET_CLOSE_RATE = 25;

export function OpportunityCalculator() {
  const [leads, setLeads] = useState(60);
  const [closeRate, setCloseRate] = useState(15);
  const [profitPerSale, setProfitPerSale] = useState(1500);

  const { gapSales, monthlyOpportunity } = useMemo(() => {
    const currentSales = leads * (closeRate / 100);
    const targetSales = leads * (TARGET_CLOSE_RATE / 100);
    const gap = Math.max(Math.round(targetSales - currentSales), 0);
    return { gapSales: gap, monthlyOpportunity: gap * profitPerSale };
  }, [leads, closeRate, profitPerSale]);

  return (
    <div className="rounded-2xl bg-white p-6 md:p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
      <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-faint">
        Calcula tu oportunidad perdida
      </h2>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-center justify-between text-[13px] text-ink-muted mb-2">
            <span>Leads mensuales aproximados</span>
            <span className="font-semibold text-ink">{leads}</span>
          </div>
          <input
            type="range"
            min={10}
            max={300}
            step={5}
            value={leads}
            onChange={(e) => setLeads(Number(e.target.value))}
            className="range-slider"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-[13px] text-ink-muted mb-2">
            <span>Tu tasa de cierre actual</span>
            <span className="font-semibold text-ink">{closeRate}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            step={1}
            value={closeRate}
            onChange={(e) => setCloseRate(Number(e.target.value))}
            className="range-slider"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-[13px] text-ink-muted mb-2">
            <span>Ganancia promedio por venta</span>
            <span className="font-semibold text-ink">${profitPerSale.toLocaleString("es-US")}</span>
          </div>
          <input
            type="range"
            min={500}
            max={3000}
            step={100}
            value={profitPerSale}
            onChange={(e) => setProfitPerSale(Number(e.target.value))}
            className="range-slider"
          />
        </div>
      </div>

      <div className="mt-7 rounded-xl bg-silver-50 border border-silver-200 p-5 text-center">
        {gapSales > 0 ? (
          <p className="text-sm md:text-base text-ink leading-relaxed">
            Podrías estar dejando pasar{" "}
            <span className="font-semibold">{gapSales} ventas</span> y{" "}
            <span className="font-semibold">${monthlyOpportunity.toLocaleString("es-US")}</span>{" "}
            en ganancias cada mes.
          </p>
        ) : (
          <p className="text-sm md:text-base text-ink leading-relaxed">
            Tu tasa de cierre ya está por encima del promedio de la industria — con la estrategia correcta puedes escalar aún más rápido.
          </p>
        )}
      </div>

      <a
        href="#formulario"
        className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white text-[13px] font-medium px-5 py-3.5 hover:bg-ink-soft transition-colors"
      >
        Ver mi plan de acción personalizado
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}
