"use client";

import { useT } from "@/lib/i18n";
import type { MethodIcon } from "@/lib/dictionaries";

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function MethodIconSvg({ name }: { name: MethodIcon }) {
  switch (name) {
    case "audit":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
          <rect x="3" y="3" width="18" height="18" rx="2.5" />
          <path d="M7 16v-3M12 16v-7M17 16v-5" />
        </svg>
      );
    case "design":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
          <path d="M3 17l4 4L21 7l-4-4z" />
          <path d="M14 6l4 4" />
          <path d="M3 21l3-1" />
        </svg>
      );
    case "launch":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
          <path d="M14 4h6v6" />
          <path d="M20 4l-9 9" />
          <path d="M20 14v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h4" />
        </svg>
      );
  }
}

function Dots({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`rounded-full transition-all ${
            i === active
              ? "w-1.5 h-1.5 bg-ink"
              : "w-1.5 h-1.5 bg-silver-300"
          }`}
        />
      ))}
    </div>
  );
}

export function Methodology() {
  const { t } = useT();
  const phases = t.methodology.phases;

  return (
    <section id="methodology" className="border-t border-silver-200 bg-silver-50">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="text-center max-w-xl mx-auto">
          <span className="eyebrow-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 17l5-5 4 4 8-8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t.methodology.eyebrow}
          </span>
          <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-ink leading-[1.1]">
            {t.methodology.title}
          </h2>
          <p className="mt-3 text-sm md:text-base text-ink-muted leading-relaxed">
            {t.methodology.sub}
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-4 md:auto-rows-fr">
          {phases.map((p, i) => {
            const tall = i === 0;
            return (
              <article
                key={p.n}
                className={`bg-white border border-silver-200 rounded-2xl p-6 md:p-7 flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                  tall ? "md:row-span-2 md:justify-end" : ""
                }`}
              >
                <div className={tall ? "" : ""}>
                  <div className="icon-squircle">
                    <MethodIconSvg name={p.icon} />
                  </div>
                  <h3 className="mt-7 text-base md:text-lg font-medium text-ink tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-ink-muted leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className={`pt-5 mt-6 border-t border-silver-200 flex items-end justify-between ${tall ? "" : "mt-auto"}`}>
                  <span className="text-3xl md:text-4xl font-light text-ink tracking-tight tabular-nums">
                    {p.n}
                  </span>
                  <Dots active={i} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
