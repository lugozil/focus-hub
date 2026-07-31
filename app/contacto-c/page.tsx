import type { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { OpportunityCalculator } from "@/components/landing/OpportunityCalculator";
import { AllAtOnceForm } from "@/components/landing/AllAtOnceForm";

export const metadata: Metadata = {
  title: "Contacto — FOCUS Hub",
  description:
    "Descubre cuánto dinero está dejando pasar tu dealership cada mes y agenda tu auditoría de negocio gratuita.",
  robots: { index: false, follow: false },
};

export default function ContactoCPage() {
  return (
    <>
      <LandingHeader />
      <main id="top">
        {/* Hero oscuro + calculadora interactiva */}
        <section className="bg-ink text-white">
          <div className="mx-auto max-w-5xl px-6 pt-16 pb-20 md:pt-24 md:pb-24">
            <div className="text-center max-w-2xl mx-auto animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                Calculadora para dealers
              </span>
              <h1 className="mt-5 text-2xl md:text-4xl font-semibold tracking-[-0.02em] leading-[1.15]">
                ¿Cuánto dinero está dejando pasar tu dealership cada mes?
              </h1>
              <p className="mt-4 text-sm md:text-base text-silver-300 leading-relaxed">
                Mueve los controles y descubre en segundos el tamaño real de la oportunidad que estás dejando sobre la mesa.
              </p>
            </div>

            <div className="mt-10 max-w-md mx-auto animate-fade-up-delay">
              <OpportunityCalculator />
            </div>
          </div>
        </section>

        {/* Formulario */}
        <section className="bg-silver-50 border-b border-silver-200">
          <div id="formulario" className="mx-auto max-w-md px-6 py-16 md:py-20">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-semibold tracking-[-0.01em] text-ink leading-snug">
                Recibe tu plan de acción personalizado
              </h2>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                Completa tus datos y te contactamos para mostrarte, paso a paso, cómo cerrar esa brecha.{" "}
                <span className="text-ink font-medium">Auditoría gratuita. Sin compromiso.</span>
              </p>
            </div>
            <AllAtOnceForm variante="contacto-c" />
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
