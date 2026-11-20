import type { Metadata } from "next";
import Image from "next/image";
import { LandingHeader } from "@/components/landing/LandingHeader";
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

const studioFaqs = [
  [
    "¿Qué tipos de contenido desarrollan?",
    "Desarrollamos fotografía, diseño gráfico y videos para las diversas plataformas digitales, adaptando cada producción a las necesidades y objetivos de tu marca."
  ],
  [
    "¿Se encargan de todo el proceso de creación de contenido?",
    "Sí. Nuestro equipo se encarga de todo el proceso creativo, desde la planificación y conceptualización hasta la producción, edición y entrega del contenido final."
  ],
  [
    "¿Ofrecen servicios mensuales o producciones individuales?",
    "Ofrecemos ambas modalidades, adaptándonos a las necesidades de tu marca, ya sea mediante una colaboración mensual o una producción específica."
  ],
  [
    "¿Cuál es la inversión necesaria para trabajar con Studio?",
    "La inversión depende del volumen de contenido, la complejidad de las producciones y las necesidades de tu marca. Durante nuestra reunión, definiremos una propuesta adaptada a tu negocio."
  ],
  [
    "¿Qué sucede después de completar mi aplicación?",
    "Tendrás una reunión con nuestro equipo creativo para conocer tus objetivos, evaluar tus necesidades y definir una propuesta de trabajo."
  ]
];

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

// Iconos lineales (24×24) para las tres disciplinas creativas.
const FORMATS = [
  {
    title: "Fotografía",
    icon: "M4 8.5A1.5 1.5 0 015.5 7h2.3l1.4-2h5.6l1.4 2h2.3A1.5 1.5 0 0120 8.5v9a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 17.5v-9zM12 16.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z",
  },
  {
    title: "Diseño gráfico",
    icon: "M12 20a8 8 0 118-8c0 2-1.5 3-3 3h-2a1.5 1.5 0 00-1 2.6c.6.6.3 2.4-2 2.4zM7.5 11.5h.01M10 7.5h.01M14.5 7.5h.01M17 11h.01",
  },
  {
    title: "Video",
    icon: "M15 10.5l5-3v9l-5-3M4 7h11v10H4z",
  },
];

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
        {/* ---------- HERO (cinematográfico, con indicador REC) ---------- */}
        <section className="relative isolate overflow-hidden bg-[#111] text-white">
          <div aria-hidden className="absolute inset-0 -z-20">
            <Image
              src="/studio-hero-v3.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="studio-hero-push object-cover object-[28%_center]"
            />
          </div>
          <div aria-hidden className="studio-hero-shade absolute inset-0 -z-10" />

          <div className="mx-auto grid min-h-[560px] max-w-6xl content-end gap-[18px] px-5 pt-14 pb-9 sm:px-6 lg:min-h-[660px] lg:pt-24 lg:pb-14">
            <span className="studio-rec" aria-hidden="true">REC · FOCUS Hub Studio</span>
            <span className="inline-flex min-h-9 items-center gap-2 justify-self-start rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Para dueños y gerentes de dealers
            </span>
            <h1 className="max-w-[14em] text-[clamp(32px,8.4vw,56px)] font-[650] leading-[1.06] tracking-[-0.03em] text-white text-balance">
              Contenido a la altura de tu dealership.
            </h1>
            <p className="max-w-xl text-base md:text-lg leading-relaxed text-white/85">
              Producción audiovisual especializada en la industria automotriz, diseñada para proyectar profesionalismo, generar confianza y atraer potenciales compradores.
            </p>
            <div className="mt-1">
              <a
                href="#formulario"
                data-track-cta="Iniciar mi aplicación"
                data-track-ubicacion="Hero"
                className="inline-flex w-full sm:w-auto min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-white px-7 text-[15px] font-semibold text-ink hover:bg-silver-100 transition-colors focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white"
              >
                Iniciar mi aplicación
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
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
            {FORMATS.map((format) => (
              <div key={format.title} className="flex items-center gap-4 rounded-3xl border border-silver-200 bg-white px-5 py-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)] sm:flex-col sm:justify-center sm:py-8 sm:text-center">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink text-white sm:h-14 sm:w-14">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d={format.icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="text-lg font-semibold text-ink">{format.title}</h3>
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
              <details key={item.title} className="group rounded-2xl border border-silver-300 bg-silver-200/70 p-6 transition-colors hover:bg-silver-200">
                <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-sm font-medium text-ink-muted">{item.title}</span>
                  <span className="mt-5 block text-xl font-semibold text-ink">{item.problem}</span>
                  <span className="mt-5 block text-sm text-ink-muted group-open:hidden">Selecciona para ver la solución ↻</span>
                  <span className="mt-5 hidden text-sm text-ink-muted group-open:block">Ocultar solución ↑</span>
                </summary>
                <p className="mt-4 border-t border-silver-300 pt-4 text-ink">{item.solution}</p>
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
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-silver-200">
              <Image src="/studio-equipo.jpg" alt="Integrante del equipo de FOCUS Hub Studio trabajando en la oficina" fill sizes="(min-width: 768px) 448px, 100vw" className="object-cover object-[center_35%]" />
            </div>
          </div>
        </section>

        {/* ---------- FORMULARIO ---------- */}
        <section className="relative">
          <div id="formulario" className="mx-auto max-w-md px-5 sm:px-6 py-14 md:py-20 scroll-mt-20">
            <div className="mb-6 text-center md:-mx-40">
              <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-4xl">
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
              appointmentLabel="nuestro equipo creativo"
            />
          </div>
        </section>
        {/* ---------- FAQ ---------- */}
        <section className="mx-auto max-w-4xl px-6 py-10 md:py-16">
          <h2 className="text-center text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-ink leading-[1.2]">Preguntas frecuentes</h2>
          <div className="mt-6 divide-y divide-silver-200 border-y border-silver-200">
            {studioFaqs.map(([question, answer]) => <details key={question} className="group py-4"><summary className="cursor-pointer flex list-none items-center justify-between gap-4 font-medium text-ink [&::-webkit-details-marker]:hidden">{question}<span aria-hidden className="group-open:hidden">+</span><span aria-hidden className="hidden group-open:inline">−</span></summary><p className="mt-3 text-sm leading-relaxed text-ink-muted">{answer}</p></details>)}
          </div>
          <div className="mt-6 text-center"><CtaButton ubicacion="Bajo preguntas frecuentes">Iniciar mi aplicación</CtaButton></div>
        </section>
      </main>
      <footer className="border-t border-silver-200 bg-silver-50">
        <div className="mx-auto max-w-4xl px-6 py-10 space-y-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <div><Image src="/focus-studio-logo.png" alt="FOCUS Hub Studio" width={1048} height={112} className="h-[18px] w-auto" /><p className="mt-3 text-sm text-ink-muted">Estudio Creativo Especializado en la industria automotriz</p></div>
            <div className="space-y-2 text-sm"><h3 className="font-semibold">Contacto</h3><a className="block text-ink-muted" href="mailto:sales@focushub.one">sales@focushub.one</a><a className="block text-ink-muted" href="tel:+17874177570">+1 (787) 417-7570</a></div>
            <div className="space-y-2 text-sm"><h3 className="font-semibold">Legal</h3><a className="block underline text-ink-muted" href="/politica-de-privacidad">Política de Privacidad</a><a className="block underline text-ink-muted" href="/terminos-y-condiciones">Términos y Condiciones</a></div>
          </div>
          <div className="border-t border-silver-200 pt-6 text-xs text-ink-muted leading-relaxed space-y-3">
            <p>FOCUS Hub LLC es una firma especializada en Mercadeo, Publicidad, Branding, Producciones y Tecnología, orientada al desarrollo y crecimiento comercial de empresas de la industria automotriz.</p>
            <p>Nuestros servicios están sujetos a un proceso de evaluación y selección. La presentación de una aplicación o la participación en reuniones comerciales no garantiza su aprobación ni constituye un compromiso de contratación por ninguna de las partes.</p>
            <p>Las piezas visuales presentadas ilustran nuestras capacidades creativas y de producción. Los resultados pueden variar según las condiciones del mercado, la inversión, la estructura operativa y la capacidad comercial de cada Dealership. FOCUS Hub no garantiza resultados comerciales específicos.</p>
            <p>La información proporcionada a través de nuestros formularios será utilizada para evaluar solicitudes y gestionar las comunicaciones correspondientes, de conformidad con nuestra Política de Privacidad. La prestación de nuestros servicios estará sujeta a los acuerdos contractuales correspondientes.</p>
            <p>© {new Date().getFullYear()} FOCUS Hub LLC. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
