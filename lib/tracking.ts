"use client";

import type { EventType, LandingKey, TrackedEvent } from "@/lib/landingEvents";

// Estado del rastreo de la landing actual. Lo inicializa <LandingTracker />;
// mientras no exista, sendEvent no hace nada (p. ej. en otras páginas).
let current: { landing: LandingKey; session: string } | null = null;

export function initTracking(landing: LandingKey) {
  const storageKey = `fh_session_${landing}`;
  let session = "";
  try {
    session = sessionStorage.getItem(storageKey) ?? "";
    if (!session) {
      session = crypto.randomUUID();
      sessionStorage.setItem(storageKey, session);
    }
  } catch {
    session = crypto.randomUUID();
  }
  current = { landing, session };
  return current;
}

export function stopTracking() {
  current = null;
}

export function sendEvent(
  type: EventType,
  extra: Omit<TrackedEvent, "landing" | "session" | "type"> = {}
) {
  if (!current) return;
  const body = JSON.stringify({ ...current, type, ...extra });
  try {
    if (navigator.sendBeacon?.("/api/event", new Blob([body], { type: "application/json" }))) return;
  } catch {
    // sendBeacon no disponible: usamos fetch
  }
  fetch("/api/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
