import type { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ContactoBForm } from "@/components/landing/ContactoBForm";
import { LazyVideo } from "@/components/landing/LazyVideo";
import { PageviewTracker } from "@/components/landing/PageviewTracker";

export const metadata: Metadata = {
  title: "Contacto — FOCUS Hub",
  description:
    "Agenda tu auditoría de negocio gratuita. Deja tu información y nos comunicamos personalmente para diseñar tu hoja de ruta.",
  robots: { index: false, follow: false },
};

function CtaButton({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#formulario"
      className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white text-[14px] font-medium px-6 py-3.5 hover:bg-ink-soft transition-colors"
    >
      {children}
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
  );
}

export default function ContactoBPage() {
  return (
    <>
      <LandingHeader logoClassName="h-6 w-auto" />
      <PageviewTracker variante="contacto-b" />
      <main id="top">
        {/* ---------- HERO ---------- */}
        <section className="relative isolate overflow-hidden">
          <div aria-hidden className="mesh-bg">
            <div className="mesh-blob mesh-blob--a" />
            <div className="mesh-blob mesh-blob--b" />
            <div className="mesh-blob mesh-blob--c" />
            <div className="mesh-fade" />
          </div>

          <div className="relative mx-auto max-w-xl px-6 pt-10 pb-14 md:pt-16 md:pb-20 text-center animate-fade-up">
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
              Sistema de ventas efectivo
            </span>

            <h1 className="mt-4 text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-ink leading-[1.15]">
              Más leads calificados.
              <br />
              Más ventas cerradas.
            </h1>

            <p className="mt-3 text-sm md:text-base text-ink-muted leading-relaxed max-w-md mx-auto">
              Descubre en 60 segundos dónde estás dejando ventas sobre la mesa.
            </p>

            <div className="mt-6 mx-auto aspect-video w-full max-w-[420px] md:max-w-full rounded-2xl overflow-hidden border border-silver-200 shadow-lg bg-black">
              <video
                src="/VSL.mp4"
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              >
                Tu navegador no soporta la reproducción de video.
              </video>
            </div>

            <div className="mt-6">
              <CtaButton>Quiero mi auditoría gratuita</CtaButton>
            </div>
          </div>
        </section>

        {/* ---------- TESTIMONIO ---------- */}
        <section className="relative">
          <div className="mx-auto max-w-xl px-6 py-14 md:py-20 text-center">
            <span className="eyebrow-pill">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M8 9h8M8 13h5m6-9H2a1 1 0 00-1 1v11a1 1 0 001 1h4l3 4 3-4h9a1 1 0 001-1V5a1 1 0 00-1-1z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Clientes FOCUS Hub
            </span>

            <h2 className="mt-4 text-xl md:text-2xl font-semibold tracking-[-0.02em] text-ink leading-[1.2]">
              Escucha las voces de nuestros clientes
            </h2>

            <LazyVideo
              src="/Voices.mp4"
              className="mt-6 mx-auto aspect-video w-full max-w-[420px] md:max-w-full rounded-2xl overflow-hidden border border-silver-200 shadow-lg bg-black"
            />

            <div className="mt-6">
              <CtaButton>Agendar mi auditoría gratuita</CtaButton>
            </div>
          </div>
        </section>

        {/* ---------- FORMULARIO ---------- */}
        <section className="relative">
          <div id="formulario" className="mx-auto max-w-md px-6 pb-14 md:pb-20">
            <ContactoBForm />
          </div>
        </section>

        {/* ---------- PÁRRAFO LARGO (reubicado) ---------- */}
        <section className="relative">
          <div className="mx-auto max-w-xl px-6 pb-16 md:pb-24">
            <p className="text-sm md:text-base text-ink-muted leading-relaxed text-justify">
              Cuéntanos sobre tu dealership en menos de 60 segundos y descubre dónde estás dejando ventas sobre la mesa — con un plan hecho a tu medida.{" "}
              <span className="text-ink font-medium">Auditoría gratuita. Sin compromiso.</span>
            </p>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
