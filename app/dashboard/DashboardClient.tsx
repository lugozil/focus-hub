"use client";

import { useEffect, useState } from "react";
import { DashboardView, type Range } from "./DashboardView";
import type { DashboardData } from "./types";

type State =
  | { status: "loading"; data?: DashboardData }
  | { status: "ready"; data: DashboardData }
  | { status: "error"; error: string; data?: DashboardData };

const ERRORS: Record<string, string> = {
  "db-not-configured": "La base de datos todavía no está conectada (falta DATABASE_URL).",
};

export function DashboardClient() {
  const [range, setRange] = useState<Range>(30);
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ status: "loading", data: prev.data }));
    fetch(`/api/dashboard?days=${range}`, { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (json.ok) setState({ status: "ready", data: json.data });
        else setState((prev) => ({ status: "error", error: json.error, data: prev.data }));
      })
      .catch(() => !cancelled && setState((prev) => ({ status: "error", error: "network", data: prev.data })));
    return () => {
      cancelled = true;
    };
  }, [range]);

  if (!state.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-silver-50 px-4 text-center">
        {state.status === "error" ? (
          <div className="max-w-sm rounded-2xl border border-silver-200 bg-white p-6">
            <p className="text-[15px] font-semibold text-ink">No se pudieron cargar las métricas</p>
            <p className="mt-1 text-[13px] text-ink-muted">{ERRORS[state.error] ?? "Inténtalo de nuevo en unos minutos."}</p>
          </div>
        ) : (
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-silver-300 border-t-ink" aria-label="Cargando" />
        )}
      </div>
    );
  }

  return (
    <DashboardView
      data={state.data}
      range={range}
      onRangeChange={setRange}
      loading={state.status === "loading"}
    />
  );
}
