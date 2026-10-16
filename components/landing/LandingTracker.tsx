"use client";

import { useEffect } from "react";
import { FORM_FIELDS, type LandingKey } from "@/lib/landingEvents";
import { initTracking, sendEvent, stopTracking } from "@/lib/tracking";

const FIELD_LABEL = new Map(FORM_FIELDS.map((f) => [f.id, f.label]));
const QUARTILES = [25, 50, 75, 100];

function classifySource(): string {
  const params = new URLSearchParams(window.location.search);
  const utm = (params.get("utm_source") ?? "").toLowerCase();
  const ref = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : "";
  const probe = `${utm} ${ref}`;
  if (params.has("fbclid") || /facebook|fb\b|^fb|meta/.test(probe)) return "Facebook";
  if (/instagram|\big\b/.test(probe)) return "Instagram";
  if (params.has("gclid") || /google/.test(probe)) return "Google";
  if (/tiktok/.test(probe)) return "TikTok";
  if (/youtube/.test(probe)) return "YouTube";
  if (/whatsapp|wa\.me/.test(probe)) return "WhatsApp";
  if (utm) return utm.slice(0, 40);
  if (!ref || ref.endsWith("focushub.one")) return "Directo";
  return ref.replace(/^www\./, "").slice(0, 40);
}

/**
 * Rastrea el recorrido del visitante en una landing: visita, scroll,
 * clics en CTA ([data-track-cta]), campos del formulario
 * ([data-track-form]) y videos ([data-track-video]).
 */
export function LandingTracker({ landing }: { landing: LandingKey }) {
  useEffect(() => {
    initTracking(landing);
    const once = new Set<string>();
    const sendOnce = (key: string, fn: () => void) => {
      if (once.has(key)) return;
      once.add(key);
      fn();
    };

    sendEvent("pageview", {
      device: window.matchMedia("(max-width: 767px)").matches ? "movil" : "escritorio",
      source: classifySource(),
    });

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max <= 0 ? 1 : (window.scrollY + 1) / max;
      QUARTILES.forEach((q) => {
        if (ratio * 100 >= q) sendOnce(`scroll-${q}`, () => sendEvent("scroll", { value: q }));
      });
    };

    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track-cta]");
      if (!el) return;
      sendEvent("cta_click", { name: el.dataset.trackCta, detail: el.dataset.trackUbicacion });
    };

    let lastField = "";
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-track-form]")) return;
      const label = FIELD_LABEL.get(target.id);
      if (!label) return;
      sendOnce("form_start", () => sendEvent("form_start"));
      if (label !== lastField) {
        lastField = label;
        sendEvent("form_field", { name: label });
      }
    };

    const videoName = (e: Event) =>
      (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track-video]")?.dataset.trackVideo;
    const onPlay = (e: Event) => {
      const name = videoName(e);
      if (name) sendOnce(`play-${name}`, () => sendEvent("video_play", { name }));
    };
    const onTimeUpdate = (e: Event) => {
      const name = videoName(e);
      const video = e.target as HTMLVideoElement;
      if (!name || !video.duration) return;
      const progress = (video.currentTime / video.duration) * 100;
      QUARTILES.forEach((q) => {
        if (progress >= q - 1) sendOnce(`video-${name}-${q}`, () => sendEvent("video_progress", { name, value: q }));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, true);
    document.addEventListener("focusin", onFocusIn);
    // Los eventos de <video> no burbujean: se escuchan en fase de captura.
    document.addEventListener("play", onPlay, true);
    document.addEventListener("timeupdate", onTimeUpdate, true);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("play", onPlay, true);
      document.removeEventListener("timeupdate", onTimeUpdate, true);
      stopTracking();
    };
  }, [landing]);

  return null;
}
