import type { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ContactoBForm } from "@/components/landing/ContactoBForm";

export const metadata: Metadata = {
  title: "Contacto — FOCUS Hub",
  description:
    "Agenda tu auditoría de negocio gratuita. Deja tu información y nos comunicamos personalmente para diseñar tu hoja de ruta.",
  robots: { index: false, follow: false },
};

export default function ContactoBPage() {
  return (
    <>
      <LandingHeader logoClassName="h-6 w-auto" />
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

              <div className="[grid-area:video] mx-auto md:mx-0 aspect-video w-full max-w-[420px] md:max-w-none rounded-2xl overflow-hidden border border-silver-200 shadow-lg bg-black">
                <video
                  src="/VSL.mp4"
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                >
                  Tu navegador no soporta la reproducción de video.
                </video>
              </div>

              <div id="formulario" className="[grid-area:form] mx-auto w-full max-w-md md:max-w-none">
                <ContactoBForm />
              </div>

            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
