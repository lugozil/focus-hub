"use client";

import { useT } from "@/lib/i18n";

export function Intro() {
  const { t } = useT();
  return (
    <section className="border-t border-silver-200 bg-silver-50">
      <div className="mx-auto max-w-4xl px-6 py-24 md:py-32 text-center">
        <span className="eyebrow-pill">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 5a2 2 0 012-2h11v18H6a2 2 0 01-2-2zm13-2v18"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t.intro.eyebrow}
        </span>

        <p className="mt-10 text-xl md:text-2xl lg:text-3xl tracking-[-0.01em] leading-[1.35]">
          {t.intro.segments.map((seg, i) => (
            <span
              key={i}
              className={
                seg.em
                  ? "text-ink font-semibold"
                  : "text-ink-faint font-normal"
              }
            >
              {seg.text}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
