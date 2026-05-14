import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contacto — FOCUS Hub",
  description:
    "Agenda tu auditoría de negocio gratuita. Deja tu información y nos comunicamos personalmente para diseñar tu hoja de ruta.",
};

export default function ContactoPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero de contacto */}
        <section className="border-b border-silver-200 bg-white">
          <div className="mx-auto max-w-3xl px-6 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
            <span className="eyebrow-pill mb-6">
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
              ¿Tu negocio está listo para escalar, pero le falta la estrategia y los sistemas para lograrlo?
            </h1>
            <p className="mt-6 text-sm md:text-base text-ink-muted leading-relaxed max-w-2xl mx-auto">
              Deja tu información a continuación y nos comunicaremos personalmente para agendar tu auditoría de negocio gratuita — donde te irás con una hoja de ruta clara y accionable, diseñada para tu negocio.{" "}
              <span className="text-ink font-medium">Sin costo. Sin compromiso.</span>
            </p>
          </div>
        </section>

        {/* Formulario + imagen */}
        <section className="bg-silver-100 border-b border-silver-200">
          <div className="mx-auto max-w-6xl px-6 pb-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-stretch">

              {/* Formulario — primero en el DOM (visible primero en móvil), derecha en desktop */}
              <div className="md:order-2">
                <iframe
                  src="https://link.focushub.one/widget/form/3UeypkAvZwYp9UZVGFy1"
                  style={{
                    width: "100%",
                    height: "1060px",
                    border: "none",
                    borderRadius: "20px",
                    display: "block",
                    overflow: "hidden",
                  }}
                  scrolling="no"
                  title="Formulario de contacto FOCUS Hub"
                />
              </div>

              {/* Imagen — segunda en el DOM (debajo en móvil), izquierda en desktop */}
              <div className="hidden md:flex md:order-1 flex-col justify-start gap-6 md:mt-10">
                <Image
                  src="/ubicacion.webp"
                  alt="Ubicaciones donde opera FOCUS Hub: New York, Houston, Tampa, Orlando, San Juan, Ponce"
                  width={900}
                  height={700}
                  className="w-full h-auto"
                  priority
                />
                <div className="space-y-1 text-center md:text-left">
                  <p className="text-xs font-medium text-ink-muted uppercase tracking-widest">
                    Presencia en
                  </p>
                  <p className="text-sm text-ink leading-relaxed">
                    New York · Houston · Tampa · Orlando · San Juan · Ponce
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
