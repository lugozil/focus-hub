import type { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { PerformanceApplicationForm } from "@/components/landing/PerformanceApplicationForm";
import { PageviewTracker } from "@/components/landing/PageviewTracker";
import { LandingTracker } from "@/components/landing/LandingTracker";

export const metadata: Metadata = {
  title: "FOCUS Hub Performance — Mercadeo automotriz",
  description: "Transformamos tu inversión publicitaria en oportunidades de venta calificadas.",
  robots: { index: false, follow: false },
};

const sectionClass = "mx-auto max-w-4xl px-6 py-10 md:py-16";
const headingClass = "text-center text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-ink leading-[1.2]";
const filter = [
  "Nuestros servicios están dirigidos exclusivamente a Dealerships de autos.",
  "No se aceptan aplicaciones de vendedores individuales.",
];
const meeting = [
  "Conocerás nuestro ecosistema de soluciones.",
  "Identificaremos los desafíos actuales de tu Dealership.",
  "Analizaremos las causas detrás de esos desafíos.",
  "Te explicaremos cómo podemos ayudarte a superarlos.",
];
const testimonials = [
  { src: "/Voices.mp4", track: "Testimonio · Voices", quote: "Nos han ayudado a abrir nuevas vías de generación de prospectos para convertirlos en clientes que llegan a nuestro Dealership y con ello generar más cierres.", name: "Orlando Jaquez", role: "Chief Sales Officer", dealer: "Sutherlin Nissan of Orlando", location: "Orlando, Florida" },
  { src: "/testimonio-hdelgado.mp4", track: "Testimonio · H. Delgado", quote: "En solo seis meses logramos duplicar la cantidad de ventas de todo el año anterior.", name: "Héctor Delgado", role: "Fundador y Propietario", dealer: "H Delgado Auto", location: "Carolina, Puerto Rico" },
];
const methodology = [
  ["Diagnóstico & Estrategia", "Analizamos tu operación, identificamos oportunidades y definimos una estrategia alineada con tus objetivos comerciales."],
  ["Infraestructura & Tecnología", "Construimos la infraestructura necesaria para captar, organizar y medir tus oportunidades de venta."],
  ["Activación & Adquisición", "Ejecutamos campañas publicitarias orientadas a generar un flujo de prospectos calificados."],
  ["Medición & Optimización", "Analizamos el rendimiento y optimizamos continuamente tu inversión publicitaria."],
];
const faqs = [
  ["¿Con qué tipo de Dealerships trabajan?", "Trabajamos exclusivamente con Dealerships de autos, tanto de franquicia como independientes, incluyendo grupos automotrices con múltiples ubicaciones."],
  ["¿En qué ubicaciones ofrecen sus servicios?", "Actualmente ofrecemos nuestros servicios en Puerto Rico, Florida, Texas y Nueva York."],
  ["¿Qué los diferencia de otras agencias de mercadeo?", "Lo que nos distingue es nuestro profundo conocimiento de la industria automotriz, tanto de su dinámica comercial como de sus desafíos operativos. Esta especialización nos permite integrar Mercadeo, Publicidad, Branding, Producciones y Tecnología con una visión estratégica que va más allá de la ejecución técnica."],
  ["¿La reunión inicial tiene algún costo?", "No. La reunión inicial es completamente gratuita y no implica ningún compromiso de contratación."],
  ["¿Qué sucede después de completar mi aplicación?", "Nuestro equipo evaluará tu caso a través de un proceso de reuniones y te comunicará si tu aplicación ha sido aprobada. Trabajamos con un grupo selecto de clientes para quienes podemos generar cambios reales y resultados tangibles."],
];
function CtaButton({ ubicacion }: { ubicacion: string }) {
  return <a href="#formulario" data-track-cta="INICIAR MI APLICACION" data-track-ubicacion={ubicacion} className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-ink text-white text-sm font-medium px-6 py-3.5 hover:bg-ink-soft transition-colors">INICIAR MI APLICACION</a>;
}

export default function ContactoBPage() {
  return (
    <>
      <LandingHeader logoClassName="h-6 w-auto" />
      <PageviewTracker variante="contacto-b" />
      <LandingTracker landing="performance" />
      <main id="top">
        <section className="relative isolate overflow-hidden">
          <div aria-hidden className="mesh-bg"><div className="mesh-blob mesh-blob--a" /><div className="mesh-blob mesh-blob--b" /><div className="mesh-blob mesh-blob--c" /><div className="mesh-fade" /></div>
          <div className="relative mx-auto max-w-2xl px-6 pt-10 pb-8 md:pt-16 md:pb-12 text-center animate-fade-up">
            <span className="eyebrow-pill">FIRMA ESPECIALIZADA EN MERCADEO AUTOMOTRIZ</span>
            <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-ink leading-[1.15]">Atrae compradores. <br />Impulsa tus ventas. <br />Escala tu Dealership.</h1>
            <p className="mt-4 text-sm md:text-base text-ink-muted leading-relaxed">Transformamos tu inversión publicitaria en oportunidades de venta calificadas.</p>
            <div className="mt-6 aspect-video w-full rounded-2xl overflow-hidden border border-silver-200 shadow-lg bg-black">
              <video src="/VSL.mp4" data-track-video="VSL principal" controls playsInline preload="metadata" className="w-full h-full object-contain">Tu navegador no soporta la reproducción de video.</video>
            </div>
          </div>
        </section>
        <section className={sectionClass}>
          <div className="mx-auto max-w-xl rounded-2xl border border-silver-200 bg-white p-6 md:p-8">
            <h2 className={headingClass}>Comencemos Tu Transformación</h2>
            <p className="mt-3 text-center text-ink-muted text-sm md:text-base">Da el primer paso hacia una operación comercial más sólida.</p>
            <div className="mt-6 border-t border-silver-200 pt-5">
              <h3 className="font-semibold text-ink">Durante nuestra reunión:</h3>
              <ul className="mt-3 space-y-3 text-sm text-ink-muted">
                {meeting.map((item) => <li key={item} className="flex items-start gap-3"><span aria-hidden className="font-semibold text-ink">✓</span>{item}</li>)}
              </ul>
            </div>
            <div className="mt-6 text-center"><CtaButton ubicacion="Hero, bajo el VSL" /></div>
            <p className="mt-4 text-xs text-center text-ink-muted font-medium">{filter[0]}</p>
            <p className="mt-1 text-xs text-center text-ink-muted">{filter[1]}</p>
          </div>
        </section>
        <section className={sectionClass}>
          <h2 className={headingClass}>Relaciones Construidas Sobre Resultados</h2>
          <p className="mt-3 text-center text-ink-muted text-sm md:text-base">Conoce la experiencia de quienes han confiado en FOCUS Hub Performance.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {testimonials.map((item) => (
              <article key={item.src} className="rounded-2xl border border-silver-200 bg-white overflow-hidden flex flex-col">
                <video src={item.src} data-track-video={item.track} aria-label={"Testimonio de " + item.name} controls playsInline preload="metadata" className="aspect-video w-full bg-black object-contain" />
                <div className="flex-1 flex flex-col p-5 gap-4">
                  <blockquote className="text-base font-medium text-ink">“{item.quote}”</blockquote>
                  <div className="mt-auto pt-4 border-t border-silver-200 text-sm">
                    <p className="font-semibold text-ink">{item.name}</p>
                    <p className="text-ink-muted">{item.role}</p>
                    <p className="text-ink">{item.dealer}</p>
                    <p className="text-xs text-ink-muted">{item.location}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 text-center"><CtaButton ubicacion="Bajo los testimonios" /></div>
        </section>
        <section className={sectionClass}>
          <h2 className={headingClass}>El Sistema Detrás De Los Resultados</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {methodology.map(([title, description], i) => <article key={title} className="rounded-2xl border border-silver-200 bg-white p-5"><span className="text-lg font-medium text-ink-muted">{String(i+1).padStart(2,"0")}</span><h3 className="mt-2 font-semibold text-ink">{title}</h3><p className="mt-2 text-sm text-ink-muted leading-relaxed">{description}</p></article>)}
          </div>
          <div className="mt-6 text-center"><CtaButton ubicacion="Bajo metodología" /></div>
        </section>
        <section id="formulario" className="mx-auto max-w-md px-6 py-10 md:py-16 scroll-mt-20">
          <h2 className={headingClass}>Inicia Tu Aplicación</h2>
          <div className="mt-6"><PerformanceApplicationForm /></div>
        </section>
        <section className={sectionClass}>
          <h2 className={headingClass}>Preguntas Frecuentes</h2>
          <div className="mt-6 divide-y divide-silver-200 border-y border-silver-200">
            {faqs.map(([question,answer]) => <details key={question} className="group py-4"><summary className="cursor-pointer flex list-none items-center justify-between gap-4 font-medium text-ink [&::-webkit-details-marker]:hidden">{question}<span aria-hidden className="group-open:hidden">+</span><span aria-hidden className="hidden group-open:inline">−</span></summary><p className="mt-3 text-sm leading-relaxed text-ink-muted">{answer}</p></details>)}
          </div>
          <div className="mt-6 text-center"><CtaButton ubicacion="Bajo preguntas frecuentes" /></div>
        </section>
      </main>
      <footer className="border-t border-silver-200 bg-silver-50">
        <div className="mx-auto max-w-4xl px-6 py-10 space-y-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <div><img src="/logo-focus.png" alt="FOCUS Hub" className="h-6 w-auto" /><p className="mt-3 text-sm text-ink-muted">Firma especializada en mercadeo automotriz.</p></div>
            <div className="space-y-2 text-sm"><h3 className="font-semibold">Contacto</h3><a className="block text-ink-muted" href="mailto:sales@focushub.one">sales@focushub.one</a><a className="block text-ink-muted" href="tel:+17874177570">+1 (787) 417-7570</a></div>
            <div className="space-y-2 text-sm"><h3 className="font-semibold">Legal</h3><a className="block underline text-ink-muted" href="/politica-de-privacidad">Política de Privacidad</a><a className="block underline text-ink-muted" href="/terminos-y-condiciones">Términos y Condiciones</a></div>
          </div>
          <div className="border-t border-silver-200 pt-6 text-xs text-ink-muted leading-relaxed space-y-3">
            <p>FOCUS Hub LLC es una firma especializada en Mercadeo, Publicidad, Branding, Producciones y Tecnología, orientada al desarrollo y crecimiento comercial de empresas de la industria automotriz.</p>
            <p>Nuestros servicios están sujetos a un proceso de evaluación y selección. La presentación de una aplicación o la participación en reuniones comerciales no garantiza su aprobación ni constituye un compromiso de contratación por ninguna de las partes.</p>
            <p>Los testimonios, casos de éxito y resultados presentados corresponden a experiencias particulares de nuestros clientes. Los resultados pueden variar según las condiciones del mercado, la inversión, la estructura operativa y la capacidad comercial de cada Dealership. FOCUS Hub no garantiza resultados comerciales específicos.</p>
            <p>La información proporcionada a través de nuestros formularios será utilizada para evaluar solicitudes y gestionar las comunicaciones correspondientes, de conformidad con nuestra Política de Privacidad. La prestación de nuestros servicios estará sujeta a los acuerdos contractuales correspondientes.</p>
            <p>© {new Date().getFullYear()} FOCUS Hub LLC. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
