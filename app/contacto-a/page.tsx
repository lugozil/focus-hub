import type { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { SequentialForm } from "@/components/landing/SequentialForm";

export const metadata: Metadata = {
  title: "Contacto — FOCUS Hub",
  description:
    "Agenda tu auditoría de negocio gratuita. Deja tu información y nos comunicamos personalmente para diseñar tu hoja de ruta.",
  robots: { index: false, follow: false },
};

export default function ContactoAPage() {
  return (
    <>
      <LandingHeader />
      <main id="top">
        <section className="relative isolate overflow-hidden">
          <div aria-hidden className="mesh-bg">
            <div className="mesh-blob mesh-blob--a" />
            <div className="mesh-blob mesh-blob--b" />
            <div className="mesh-blob mesh-blob--c" />
            <div className="mesh-fade" />
          </div>

          <div className="relative mx-auto max-w-xl px-6 pt-16 pb-20 md:pt-24 md:pb-24">
            <div className="text-center mb-10 animate-fade-up">
              <span className="eyebrow-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Sesión personalizada
              </span>
              <h1 className="mt-5 text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-ink leading-[1.15]">
                ¿Tu negocio está listo para escalar?
              </h1>
              <p className="mt-4 text-sm md:text-base text-ink-muted leading-relaxed max-w-md mx-auto">
                Responde estas preguntas y agenda tu auditoría de negocio gratuita.{" "}
                <span className="text-ink font-medium">Sin costo. Sin compromiso.</span>
              </p>
            </div>

            <SequentialForm />
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
