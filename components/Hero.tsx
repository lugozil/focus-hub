"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useT } from "@/lib/i18n";

export function Hero() {
  const { t } = useT();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate overflow-hidden"
    >
      <div aria-hidden className="mesh-bg">
        <div className="mesh-blob mesh-blob--a" />
        <div className="mesh-blob mesh-blob--b" />
        <div className="mesh-blob mesh-blob--c" />
        <div className="mesh-blob--mouse" />
        <div className="mesh-fade" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-28 md:pt-32 md:pb-32">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] text-ink leading-[1.1] max-w-3xl animate-fade-up">
          {t.hero.headline}
        </h1>

        <p className="mt-5 text-sm md:text-base text-ink-muted max-w-xl leading-relaxed animate-fade-up-delay">
          {t.hero.sub}
        </p>

        <div className="mt-8 animate-fade-up-delay-2">
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 rounded-full bg-ink text-white text-[13px] font-medium px-5 py-3 hover:bg-ink-soft transition-colors shadow-[0_8px_20px_-8px_rgba(42,42,42,0.4)]"
          >
            {t.hero.cta}
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
