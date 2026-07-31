"use client";

import { useState } from "react";

type Values = {
  nombre: string;
  telefono: string;
  email: string;
  cargo: string;
  cargoOtro: string;
  inversion: string;
};

type Status = "idle" | "submitting" | "success" | "error";

const CARGO_OPTIONS = [
  "Dueño / CEO",
  "Gerente General",
  "Director(a) de Marketing o Ventas",
  "Otro",
];

const INVERSION_OPTIONS = [
  "$1,000 - $3,000",
  "$3,000 - $5,000",
  "$5,000 - $10,000",
  "Más de $10,000",
];

const TOTAL_STEPS = 5;

const INITIAL_VALUES: Values = {
  nombre: "",
  telefono: "",
  email: "",
  cargo: "",
  cargoOtro: "",
  inversion: "",
};

function isStepValid(step: number, values: Values) {
  switch (step) {
    case 0:
      return values.nombre.trim().length > 1;
    case 1:
      return /^[0-9+()\-\s]{7,}$/.test(values.telefono.trim());
    case 2:
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim());
    case 3:
      return (
        values.cargo !== "" &&
        (values.cargo !== "Otro" || values.cargoOtro.trim().length > 0)
      );
    case 4:
      return values.inversion !== "";
    default:
      return false;
  }
}

function resolveCargo(values: Values) {
  return values.cargo === "Otro" ? values.cargoOtro.trim() : values.cargo;
}

export function SequentialForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(INITIAL_VALUES);
  const [status, setStatus] = useState<Status>("idle");

  const update = (patch: Partial<Values>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  async function submit(finalValues: Values) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variante: "contacto-a",
          nombre: finalValues.nombre.trim(),
          telefono: finalValues.telefono.trim(),
          email: finalValues.email.trim(),
          cargo: resolveCargo(finalValues),
          inversion: finalValues.inversion,
        }),
      });
      if (!res.ok) throw new Error("request-failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function goNext(patch?: Partial<Values>) {
    const nextValues = patch ? { ...values, ...patch } : values;
    if (patch) update(patch);
    if (!isStepValid(step, nextValues)) return;
    if (step === TOTAL_STEPS - 1) {
      submit(nextValues);
    } else {
      setStep((s) => s + 1);
    }
  }

  function goBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    goNext();
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-silver-200 bg-white p-10 md:p-14 text-center animate-fade-up">
        <div className="icon-squircle mx-auto">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-xl md:text-2xl font-semibold text-ink">
          ¡Gracias, {values.nombre.split(" ")[0]}!
        </h2>
        <p className="mt-3 text-sm md:text-base text-ink-muted leading-relaxed max-w-sm mx-auto">
          Recibimos tu información. Nos pondremos en contacto contigo muy pronto para agendar tu auditoría gratuita.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-silver-200 bg-white p-8 md:p-12 min-h-[420px] flex flex-col">
      {/* Barra de progreso */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-1 rounded-full bg-silver-200 overflow-hidden">
          <div
            className="h-full bg-ink transition-all duration-500 ease-out rounded-full"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <span className="text-[11px] font-medium text-ink-faint whitespace-nowrap">
          {step + 1} / {TOTAL_STEPS}
        </span>
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col flex-1 animate-fade-up"
        key={step}
      >
        <div className="flex-1">
          {step === 0 && (
            <Step
              question="¿Cómo te llamas?"
              helper="Nombre y apellido"
            >
              <input
                autoFocus
                type="text"
                value={values.nombre}
                onChange={(e) => update({ nombre: e.target.value })}
                placeholder="Ej. María Rodríguez"
                className="field-input"
              />
            </Step>
          )}

          {step === 1 && (
            <Step question="¿Cuál es tu número de teléfono?">
              <input
                autoFocus
                type="tel"
                inputMode="tel"
                value={values.telefono}
                onChange={(e) => update({ telefono: e.target.value })}
                placeholder="Ej. (787) 000-0000"
                className="field-input"
              />
            </Step>
          )}

          {step === 2 && (
            <Step question="¿Cuál es tu correo electrónico?">
              <input
                autoFocus
                type="email"
                value={values.email}
                onChange={(e) => update({ email: e.target.value })}
                placeholder="nombre@empresa.com"
                className="field-input"
              />
            </Step>
          )}

          {step === 3 && (
            <Step question="¿Cuál es tu cargo actual?">
              <div className="flex flex-col gap-3">
                {CARGO_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      if (option === "Otro") {
                        update({ cargo: option });
                      } else {
                        goNext({ cargo: option });
                      }
                    }}
                    className={`option-button ${values.cargo === option ? "option-button--active" : ""}`}
                  >
                    {option}
                  </button>
                ))}
                {values.cargo === "Otro" && (
                  <input
                    autoFocus
                    type="text"
                    value={values.cargoOtro}
                    onChange={(e) => update({ cargoOtro: e.target.value })}
                    placeholder="Escribe tu cargo"
                    className="field-input mt-1"
                  />
                )}
              </div>
            </Step>
          )}

          {step === 4 && (
            <Step question="¿Cuál es el rango de inversión mensual previsto?">
              <div className="flex flex-col gap-3">
                {INVERSION_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => goNext({ inversion: option })}
                    className={`option-button ${values.inversion === option ? "option-button--active" : ""}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Step>
          )}

          {status === "error" && (
            <p className="mt-4 text-[13px] text-red-600">
              No pudimos enviar tu información. Por favor intenta de nuevo.
            </p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="text-[13px] text-ink-muted hover:text-ink transition-colors"
            >
              ← Atrás
            </button>
          ) : (
            <span />
          )}

          {(step < 3 || (step === 3 && values.cargo === "Otro")) && (
            <button
              type="submit"
              disabled={!isStepValid(step, values) || status === "submitting"}
              className="inline-flex items-center gap-2 rounded-full bg-ink text-white text-[13px] font-medium px-5 py-3 hover:bg-ink-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Enviando..." : "Continuar"}
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Step({
  question,
  helper,
  children,
}: {
  question: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-base md:text-lg font-semibold tracking-[-0.01em] text-ink leading-snug">
        {question}
      </h2>
      {helper && <p className="mt-1 text-[13px] text-ink-faint">{helper}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}
