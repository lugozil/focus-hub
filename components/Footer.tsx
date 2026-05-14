"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = useT();
  const pathname = usePathname();
  const year = new Date().getFullYear();

  // Genera el href correcto: ancla directa en home, ruta completa desde otras páginas
  const sectionHref = (hash: string) =>
    pathname === "/" ? hash : `/${hash}`;

  return (
    <footer className="border-t border-silver-200 bg-silver-50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-[14px] text-ink-muted max-w-sm leading-relaxed">
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink-faint">
              {t.footer.servicesLabel}
            </h4>
            <ul className="mt-4 space-y-2 text-[14px] text-ink-muted">
              {t.services.items.map((s) => (
                <li key={s.title}>
                  <a
                    href={sectionHref("#services")}
                    className="hover:text-ink transition-colors"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={sectionHref("#methodology")}
                  className="hover:text-ink transition-colors"
                >
                  {t.nav.methodology}
                </a>
              </li>
              <li>
                <a
                  href={sectionHref("#faq")}
                  className="hover:text-ink transition-colors"
                >
                  {t.nav.faq}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink-faint">
              {t.footer.contactLabel}
            </h4>
            <ul className="mt-4 space-y-2 text-[14px] text-ink-muted">
              <li>
                <Link
                  href="/contacto"
                  className="hover:text-ink transition-colors"
                >
                  {t.nav.cta}
                </Link>
              </li>
              <li>
                <a href="mailto:growth@focushub.com" className="hover:text-ink transition-colors">
                  growth@focushub.com
                </a>
              </li>
              <li>
                <a href="tel:+17874177570" className="hover:text-ink transition-colors">
                  +1 787-417-7570
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-silver-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-[12px] text-ink-faint">
            © {year} FOCUS Hub. {t.footer.rights}
          </p>
          <ul className="flex items-center gap-6 text-[12px] text-ink-faint">
            <li>
              <a href="#" className="hover:text-ink transition-colors">
                {t.footer.privacy}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-ink transition-colors">
                {t.footer.terms}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
