"use client";

import { useT } from "@/lib/i18n";
import { ServiceIconSvg } from "./ServiceIcons";
import type { Dict } from "@/lib/dictionaries";

type Item = Dict["services"]["items"][number];

function Card({ item }: { item: Item }) {
  return (
    <article className="bg-white border border-silver-200 rounded-2xl p-6 md:p-7 hover:border-silver-400 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="icon-squircle">
        <ServiceIconSvg name={item.icon} />
      </div>
      <h3 className="mt-8 text-base md:text-lg font-medium text-ink tracking-tight">
        {item.title}
      </h3>
      <p className="mt-2.5 text-sm text-ink-muted leading-relaxed">
        {item.description}
      </p>
    </article>
  );
}

export function Services() {
  const { t } = useT();
  const [a, b, c, d, e] = t.services.items;

  return (
    <section id="services" className="border-t border-silver-200 bg-silver-100">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="text-center max-w-xl mx-auto">
          <span className="eyebrow-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 7h18M3 12h18M3 17h18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            {t.services.eyebrow}
          </span>
          <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-ink leading-[1.1]">
            {t.services.title}
          </h2>
          <p className="mt-3 text-sm md:text-base text-ink-muted leading-relaxed">
            {t.services.sub}
          </p>
        </div>

        <div className="mt-12 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card item={a} />
            <Card item={b} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card item={c} />
            <Card item={d} />
            <Card item={e} />
          </div>
        </div>
      </div>
    </section>
  );
}
