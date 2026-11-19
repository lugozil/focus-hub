import type { Metadata } from "next";
import Image from "next/image";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ContactoBForm } from "@/components/landing/ContactoBForm";
import { PageviewTracker } from "@/components/landing/PageviewTracker";
import { LandingTracker } from "@/components/landing/LandingTracker";
import { StudioComparison } from "@/components/landing/StudioComparison";

export const metadata: Metadata = {
  title: "FOCUS Hub Studio — Contenido a la altura de tu dealership",
  description:
    "Producción audiovisual especializada en la industria automotriz, diseñada para proyectar profesionalismo, generar confianza y atraer potenciales compradores.",
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
                Contenido a la altura de tu dealership.
              </h1>

              <p className="mt-4 text-[15px] md:text-base text-ink-muted leading-relaxed max-w-md mx-auto md:mx-0">
                Producción audiovisual especializada en la industria automotriz, diseñada para proyectar profesionalismo, generar confianza y atraer potenciales compradores.
              </p>

              

              <div className="mt-6">
                <CtaButton ubicacion="Hero">Iniciar mi aplicación</CtaButton>
              </div>
            </div>

            {/* Hero: videógrafo de FOCUS Hub Studio filmando un SUV frente al dealer */}
            <div className="relative mx-auto w-full max-w-[520px] md:max-w-none animate-fade-up">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-silver-200 bg-silver-100 shadow-xl">
                <Image
                  src="/studio-hero-v3.jpg"
                  alt="Imagen provisional de producción audiovisual automotriz"
                  fill
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-2 text-center text-xs text-ink-muted">Preview: video principal pendiente.</p>
            </div>
          </div>
        </section>

        {/* ---------- CREATIVE SHOWCASE ---------- */}
        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-6 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-4xl">Diferentes formatos. Un mismo estándar de calidad.</h2>
            <p className="mt-3 text-ink-muted">Tres disciplinas creativas que se complementan para crear contenido con identidad, coherencia e impacto.</p>
          </div>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {["Fotografía", "Diseño gráfico", "Video"].map((format) => (
              <div key={format} className="flex aspect-[9/14] max-h-96 flex-col items-center justify-center rounded-3xl border-4 border-neutral-800 bg-silver-100 p-5 text-center">
                <h3 className="text-lg font-semibold text-ink">{format}</h3>
                <p className="mt-2 text-xs text-ink-muted">Pieza real pendiente</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- CREATIVE COMPARISON ---------- */}
        <section className="bg-silver-50 px-5 py-12 sm:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-4xl">Mismo producto. Diferente percepción.</h2>
              <p className="mt-3 text-ink-muted">Cada decisión creativa influye en la impresión que generamos en un potencial comprador.</p>
            </div>
            <StudioComparison />
          </div>
        </section>

        {/* ---------- PROBLEM & SOLUTION ---------- */}
        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-6 md:py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-4xl">¿Qué está limitando el potencial de tu contenido?</h2>
          <p className="mt-3 text-ink-muted">Identifica los desafíos que enfrenta tu marca y descubre cómo podemos resolverlos.</p>
          <p className="mt-2 text-sm text-ink-muted">Selecciona cada tarjeta para conocer la solución.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {title: "Diferenciación", problem: "Tu contenido no logra diferenciarte de la competencia.", solution: "Desarrollamos una dirección creativa propia, alineada con la identidad y el posicionamiento de tu marca."},
              {title: "Capacidad operativa", problem: "No cuentas con el tiempo, los recursos o el equipo necesario para producir contenido de calidad.", solution: "Ponemos a tu disposición un equipo creativo especializado que se encarga de la planificación, producción y edición de tu contenido."},
              {title: "Calidad de producción", problem: "Tu contenido no refleja la calidad de tu inventario ni el verdadero nivel de tu negocio.", solution: "Disponemos de cámaras profesionales, equipamiento especializado y talento creativo para lograr una ejecución visual del más alto nivel."},
            ].map((item) => (
              <details key={item.title} className="group rounded-2xl border border-silver-200 bg-white p-6">
                <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-sm font-medium text-ink-muted">{item.title}</span>
                  <span className="mt-5 block text-xl font-semibold text-ink">{item.problem}</span>
                  <span className="mt-5 block text-sm text-ink-muted group-open:hidden">Selecciona para ver la solución ↻</span>
                  <span className="mt-5 hidden text-sm text-ink-muted group-open:block">Ocultar solución ↑</span>
                </summary>
                <p className="mt-4 border-t border-silver-200 pt-4 text-ink"> {item.solution}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ---------- CREATIVE PROCESS ---------- */}
        <section className="bg-silver-50 px-5 py-12 sm:px-6 md:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-4xl">Nosotros creamos. Tú vendes.</h2>
              <ol className="mt-8 space-y-6">
                {[
                  {title: "Planificamos", description: "Definimos la estrategia de contenido, desarrollamos los conceptos creativos, calendarios y guiones."},
                  {title: "Producimos", description: "Ejecutamos las producciones fotográficas y audiovisuales con personal y equipamiento especializado."},
                  {title: "Editamos y diseñamos", description: "Transformamos el material producido en piezas visuales alineadas con la identidad de tu marca."},
                  {title: "Entregamos", description: "Todo tu contenido optimizado y listo para su publicación en redes sociales y campañas publicitarias."},
                ].map((step, index) => (
                  <li key={step.title} className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-semibold text-white">{index + 1}</span>
                    <div><h3 className="text-lg font-semibold text-ink">{step.title}</h3><p className="mt-1 text-ink-muted">{step.description}</p></div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="text-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-silver-200">
                <Image src="/studio-hero-v3.jpg" alt="Imagen provisional de producción audiovisual" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
              <p className="mt-2 text-xs text-ink-muted">Preview: fotografía definitiva del equipo pendiente.</p>
            </div>
          </div>
        </section>

        {/* ---------- FORMULARIO ---------- */}
        <section className="relative">
          <div id="formulario" className="mx-auto max-w-md px-5 sm:px-6 py-14 md:py-20 scroll-mt-20">
            <div className="mb-6 text-center">
              <h2 className="text-[22px] md:text-2xl font-semibold tracking-[-0.02em] text-ink leading-[1.2]">
                Da el primer paso hacia un contenido de mayor nivel.
              </h2>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                Completa tu aplicación y agenda una reunión con nuestro equipo creativo.
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
              appointmentLabel="tu reunión con nuestro equipo creativo"
              submitLabel="Continuar para agendar"
            />
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
