import type { Metadata } from "next";
import Image from "next/image";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ContactoBForm } from "@/components/landing/ContactoBForm";
import { PageviewTracker } from "@/components/landing/PageviewTracker";
import { LandingTracker } from "@/components/landing/LandingTracker";

export const metadata: Metadata = {
  title: "FOCUS Hub Studio — Contenido que marca la diferencia",
  description:
    "Videos y piezas publicitarias con dirección creativa, narrativa visual y ejecución profesional para que tu marca destaque.",
  robots: { index: false, follow: false },
};

const SERVICES = [
  {
    title: "Planificación de contenido",
    description:
      "Estrategia, calendario y guiones pensados para tu dealer, para que cada pieza tenga un objetivo claro.",
    icon: "M4 6h16M4 12h10M4 18h7",
  },
  {
    title: "Producciones audiovisuales",
    description:
      "Filmmakers profesionales, dirección creativa y narrativa visual para mostrar tu marca y tu inventario como se merecen.",
    icon: "M15 10l5-3v10l-5-3M4 6h11v12H4z",
  },
  {
    title: "Creación completa de contenido",
    description:
      "De la idea a la publicación: planificamos, producimos y entregamos el contenido listo para tus redes y anuncios.",
    icon: "M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4",
  },
];

const SERVICE_OPTIONS = SERVICES.map((s) => s.title);

const STUDIO_EVENTS = {
  formularioCompleto: "studio_formulario_completo",
  fase1: "studio_fase1",
  citaAgendada: "studio_cita_agendada",
};

function CtaButton({ children, ubicacion }: { children: string; ubicacion: string }) {
  return (
    <a
      href="#formulario"
      data-track-cta={children}
      data-track-ubicacion={ubicacion}
      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-ink text-white text-[15px] sm:text-[14px] font-medium px-6 py-4 sm:py-3.5 hover:bg-ink-soft transition-colors"
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

export default function StudioPage() {
  return (
    <>
      <LandingHeader
        logoClassName="h-4 w-auto"
        logo={{
          src: "/focus-studio-logo.png",
          alt: "FOCUS HUB Studio",
          width: 1048,
          height: 112,
        }}
      />
      <PageviewTracker variante="studio" />
      <LandingTracker landing="studio" />
      <main id="top">
        {/* ---------- HERO ---------- */}
        <section className="relative isolate overflow-hidden">
          <div aria-hidden className="mesh-bg">
            <div className="mesh-blob mesh-blob--a" />
            <div className="mesh-blob mesh-blob--b" />
            <div className="mesh-blob mesh-blob--c" />
            <div className="mesh-fade" />
          </div>

          <div className="relative mx-auto max-w-6xl px-5 sm:px-6 pt-8 pb-12 md:pt-16 md:pb-20 grid items-center gap-8 md:gap-12 md:grid-cols-[1.05fr_1fr]">
            <div className="text-center md:text-left animate-fade-up">
              <span className="eyebrow-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M15 10l5-3v10l-5-3M4 6h11v12H4z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                FOCUS Hub Studio
              </span>

              <h1 className="mt-4 text-[26px] sm:text-3xl lg:text-[40px] font-semibold tracking-[-0.025em] text-ink leading-[1.12] text-balance">
                No necesitas más contenido.{" "}
                <span className="block mt-1 text-ink-muted">
                  Necesitas contenido que{" "}
                  <span className="text-ink box-decoration-clone px-1 -mx-1 rounded-md bg-[linear-gradient(transparent_58%,var(--color-silver-300)_58%)]">
                    marque la diferencia.
                  </span>
                </span>
              </h1>

              <p className="mt-4 text-[15px] md:text-base text-ink-muted leading-relaxed max-w-md mx-auto md:mx-0">
                Creamos videos y piezas publicitarias con dirección creativa y ejecución profesional para que tu marca destaque.
              </p>

              <p className="mt-3 text-xs md:text-[13px] font-medium text-ink-faint">
                Exclusivo para dueños y gerentes de dealers.
              </p>

              <div className="mt-6">
                <CtaButton ubicacion="Hero">Quiero destacar mi marca</CtaButton>
              </div>
            </div>

            {/* Hero: videógrafo de FOCUS Hub Studio filmando un SUV frente al dealer */}
            <div className="relative mx-auto w-full max-w-[520px] md:max-w-none animate-fade-up">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-silver-200 bg-silver-100 shadow-xl">
                <Image
                  src="/studio-hero-v3.jpg"
                  alt="Videógrafo de FOCUS Hub Studio filmando un SUV frente a un dealer"
                  fill
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- SERVICIOS ---------- */}
        <section className="relative">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 pt-2 pb-14 md:pb-20">
            <div className="text-center">
              <h2 className="text-[22px] md:text-2xl font-semibold tracking-[-0.02em] text-ink leading-[1.2] text-balance">
                Todo el contenido de tu marca, en un solo equipo creativo
              </h2>
              <p className="mt-3 text-sm md:text-base text-ink-muted leading-relaxed max-w-md mx-auto">
                De la idea a la publicación: estrategia, producción y gestión con un mismo estándar de calidad.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:gap-4 sm:grid-cols-3">
              {SERVICES.map((service) => (
                <div
                  key={service.title}
                  className="rounded-2xl border border-silver-200 bg-white p-5 sm:p-6 text-left flex gap-4 sm:block"
                >
                  <div className="icon-squircle shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d={service.icon}
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="sm:mt-4 text-base font-semibold text-ink">{service.title}</h3>
                    <p className="mt-1.5 sm:mt-2 text-sm text-ink-muted leading-relaxed">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <CtaButton ubicacion="Bajo los servicios">Quiero destacar mi marca</CtaButton>
            </div>
          </div>
        </section>

        {/* ---------- FORMULARIO ---------- */}
        <section className="relative">
          <div id="formulario" className="mx-auto max-w-md px-5 sm:px-6 pb-14 md:pb-20 scroll-mt-20">
            <div className="mb-6 text-center">
              <h2 className="text-[22px] md:text-2xl font-semibold tracking-[-0.02em] text-ink leading-[1.2]">
                Agenda tu sesión creativa
              </h2>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                Cuéntanos sobre tu dealer y qué necesitas. Te mostramos cómo llevar tu contenido al siguiente nivel.
              </p>
            </div>
            <div
              role="note"
              className="mb-4 flex items-start gap-3 rounded-xl border border-silver-300 bg-silver-50 px-4 py-3 text-left text-[13px] md:text-sm leading-relaxed text-ink-muted"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-ink">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <p>
                <span className="font-semibold text-ink">Importante:</span> este formulario es solo para dueños o gerentes de dealers. Si eres vendedor independiente, por favor no lo llenes.
              </p>
            </div>
            <ContactoBForm
              variante="studio"
              serviceOptions={SERVICE_OPTIONS}
              events={STUDIO_EVENTS}
              appointmentLabel="tu sesión creativa"
              submitLabel="Continuar para agendar"
            />
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
