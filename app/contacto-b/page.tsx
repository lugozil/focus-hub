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
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">

              {/* Columna izquierda: eyebrow, título, párrafo, CTA, VSL */}
              <div className="animate-fade-up">
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
                  ¿Tu dealership está listo
                  <br />
                  para escalar?
                </h1>

                <p className="mt-4 text-sm md:text-base text-ink-muted leading-relaxed max-w-md">
                  Cuéntanos sobre tu dealership en menos de 60 segundos y descubre dónde estás dejando ventas sobre la mesa — con un plan hecho a tu medida.{" "}
                  <span className="text-ink font-medium">Auditoría gratuita. Sin compromiso.</span>
                </p>

                <a
                  href="#formulario"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink text-white text-[13px] font-medium px-5 py-3 hover:bg-ink-soft transition-colors shadow-[0_8px_20px_-8px_rgba(42,42,42,0.4)]"
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

                <div className="mt-8 aspect-[9/16] w-full max-w-[280px] rounded-2xl overflow-hidden border border-silver-200 shadow-lg bg-black">
                  <iframe
                    src="https://www.youtube.com/embed/L1SXZ0nFGu4"
                    title="Video FOCUS Hub"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Columna derecha: formulario completo */}
              <div id="formulario" className="animate-fade-up-delay">
                <AllAtOnceForm />
              </div>

            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
