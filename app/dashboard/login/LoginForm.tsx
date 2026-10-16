"use client";

import { useState } from "react";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/dashboard/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    if (res?.ok) {
      window.location.href = "/dashboard";
      return;
    }
    setStatus("error");
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-silver-200 bg-white p-6 md:p-8">
      <h1 className="text-lg font-semibold text-ink">Métricas de landings</h1>
      <p className="mt-1 text-[13px] text-ink-muted">Ingresa la contraseña del equipo para ver el dashboard.</p>
      <label className="form-label mt-6 block" htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`form-control ${status === "error" ? "has-error" : ""}`}
        autoFocus
      />
      {status === "error" && <p className="form-error">Contraseña incorrecta.</p>}
      <button
        type="submit"
        disabled={!password || status === "loading"}
        className="mt-5 w-full rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-ink-soft disabled:opacity-50"
      >
        {status === "loading" ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
