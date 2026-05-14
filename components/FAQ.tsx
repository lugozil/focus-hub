"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";

export function FAQ() {
  const { t } = useT();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-silver-200 bg-silver-50">
      <div className="mx-auto max-w-4xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <span className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink-faint">
            {t.faq.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-ink leading-tight">
            {t.faq.title}
          </h2>
        </div>

        <div className="mt-12 divide-y divide-silver-200 border-t border-b border-silver-200">
          {t.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[16px] md:text-[17px] font-medium text-ink">
                    {item.q}
                  </span>
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full border border-silver-300 flex items-center justify-center text-ink-muted transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-12 text-[15px] text-ink-muted leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
