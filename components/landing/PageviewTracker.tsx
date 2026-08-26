"use client";

import { useEffect } from "react";

export function PageviewTracker({ variante }: { variante: string }) {
  useEffect(() => {
    const key = `dash_pv_${variante}_${new Date().toISOString().slice(0, 10)}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage no disponible — igual mandamos el beacon
    }

    fetch("/api/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variante }),
      keepalive: true,
    }).catch(() => {});
  }, [variante]);

  return null;
}
