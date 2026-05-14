"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { Logo } from "./Logo";
import { LangSwitch } from "./LangSwitch";

export function Header() {
  const { t } = useT();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-silver-200">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-[13px] text-ink-muted">
          <a href="#services" className="hover:text-ink transition-colors">
            {t.nav.services}
          </a>
          <a href="#methodology" className="hover:text-ink transition-colors">
            {t.nav.methodology}
          </a>
          <a href="#faq" className="hover:text-ink transition-colors">
            {t.nav.faq}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <LangSwitch />
          <Link
            href="/contacto"
            className="hidden sm:inline-flex items-center rounded-full bg-ink text-white text-[13px] font-medium px-4 py-2 hover:bg-ink-soft transition-colors"
          >
            {t.nav.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}
