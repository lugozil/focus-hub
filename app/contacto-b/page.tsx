import type { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { AllAtOnceForm } from "@/components/landing/AllAtOnceForm";

export const metadata: Metadata = {
  title: "Contacto — FOCUS Hub",
  description:
    "Agenda tu auditoría de negocio gratuita. Deja tu información y nos comunicamos personalmente para diseñar tu hoja de ruta.",
  robots: { index: false, follow: false },
};

export default function ContactoBPage() {
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

          <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24 md:pb-24">
            <div className="contacto-b-grid animate-fade-up">

              <div className="[grid-area:eyebrow] flex justify-center md:justify-start">
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
                  Ecosistema para dealers
                </span>
              </div>

              <h1 className="[grid-area:title] text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-ink leading-[1.15] text-center md:text-left">
                Más leads calificados.
                <br />
                Más ventas cerradas.
              </h1>

              <p className="[grid-area:paragraph] text-sm md:text-base text-ink-muted leading-relaxed text-justify">
                Cuéntanos sobre tu dealership en menos de 60 segundos y descubre dónde estás dejando ventas sobre la mesa — con un plan hecho a tu medida.{" "}
                <span className="text-ink font-medium">Auditoría gratuita. Sin compromiso.</span>
              </p>

              <div className="[grid-area:cta] flex justify-center md:hidden">
                <a
                  href="#formulario"
                  className="inline-flex items-center gap-2 rounded-full bg-ink text-white text-[13px] font-medium px-5 py-3 hover:bg-ink-soft transition-colors shadow-[0_8px_20px_-8px_rgba(42,42,42,0.4)]"
                >
                  Solicitar Asesoría
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>

              <div className="[grid-area:video] mx-auto md:mx-0 md:ml-1 aspect-[9/16] w-full max-w-[280px] md:max-w-[320px] rounded-2xl overflow-hidden border border-silver-200 shadow-lg bg-black">
                <iframe
                  src="https://www.youtube.com/embed/L1SXZ0nFGu4"
                  title="Video FOCUS Hub"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div id="formulario" className="[grid-area:form] mx-auto w-full max-w-md md:max-w-none">
                <AllAtOnceForm variante="contacto-b" />
              </div>

            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
