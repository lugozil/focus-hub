"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

export function CTA() {
  const { t } = useT();
  return (
    <section className="border-t border-silver-200 bg-ink text-white">
      <div className="mx-auto max-w-4xl px-6 py-24 md:py-32 text-center">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
          {t.cta.title}
        </h2>
        <p className="mt-5 text-lg text-silver-300 max-w-xl mx-auto leading-relaxed">
          {t.cta.sub}
        </p>
        <div className="mt-10">
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 rounded-full bg-white text-ink text-sm font-medium px-6 py-3 hover:bg-silver-200 transition-colors"
          >
            {t.cta.button}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
