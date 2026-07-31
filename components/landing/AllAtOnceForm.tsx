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

const INITIAL_VALUES: Values = {
  nombre: "",
  telefono: "",
  email: "",
  cargo: "",
  cargoOtro: "",
  inversion: "",
};

type Errors = Partial<Record<keyof Values, string>>;

function validate(values: Values): Errors {
  const errors: Errors = {};

  if (values.nombre.trim().length < 2) errors.nombre = "Ingresa tu nombre completo.";
  if (!/^[0-9+()\-\s]{7,}$/.test(values.telefono.trim())) errors.telefono = "Ingresa un teléfono válido.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Ingresa un correo válido.";
  if (!values.cargo) errors.cargo = "Selecciona una opción.";
  if (values.cargo === "Otro" && values.cargoOtro.trim().length === 0) {
    errors.cargoOtro = "Escribe tu cargo.";
  }
  if (!values.inversion) errors.inversion = "Selecciona una opción.";

  return errors;
}

function resolveCargo(values: Values) {
  return values.cargo === "Otro" ? values.cargoOtro.trim() : values.cargo;
}

export function AllAtOnceForm() {
  const [values, setValues] = useState<Values>(INITIAL_VALUES);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const update = (patch: Partial<Values>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  const errors = validate(values);
  const showErrors = submitted;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    if (Object.keys(validate(values)).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variante: "contacto-b",
          nombre: values.nombre.trim(),
          telefono: values.telefono.trim(),
          email: values.email.trim(),
          cargo: resolveCargo(values),
          inversion: values.inversion,
        }),
      });
      if (!res.ok) throw new Error("request-failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-silver-200 bg-white p-10 text-center animate-fade-up">
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
        <h2 className="mt-6 text-xl font-semibold text-ink">
          ¡Gracias, {values.nombre.split(" ")[0]}!
        </h2>
        <p className="mt-3 text-sm text-ink-muted leading-relaxed max-w-sm mx-auto">
          Recibimos tu información. Nos pondremos en contacto contigo muy pronto para agendar tu auditoría gratuita.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-silver-200 bg-white p-6 md:p-8 space-y-5"
      noValidate
    >
      <div>
        <label className="form-label" htmlFor="nombre">Nombre y apellido</label>
        <input
          id="nombre"
          type="text"
          value={values.nombre}
          onChange={(e) => update({ nombre: e.target.value })}
          placeholder="Ej. María Rodríguez"
          className={`form-control ${showErrors && errors.nombre ? "has-error" : ""}`}
        />
        {showErrors && errors.nombre && <p className="form-error">{errors.nombre}</p>}
      </div>

      <div>
        <label className="form-label" htmlFor="telefono">Teléfono</label>
        <input
          id="telefono"
          type="tel"
          inputMode="tel"
          value={values.telefono}
          onChange={(e) => update({ telefono: e.target.value })}
          placeholder="Ej. (787) 000-0000"
          className={`form-control ${showErrors && errors.telefono ? "has-error" : ""}`}
        />
        {showErrors && errors.telefono && <p className="form-error">{errors.telefono}</p>}
      </div>

      <div>
        <label className="form-label" htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => update({ email: e.target.value })}
          placeholder="nombre@empresa.com"
          className={`form-control ${showErrors && errors.email ? "has-error" : ""}`}
        />
        {showErrors && errors.email && <p className="form-error">{errors.email}</p>}
      </div>

      <div>
        <label className="form-label" htmlFor="cargo">¿Cuál es tu cargo actual?</label>
        <select
          id="cargo"
          value={values.cargo}
          onChange={(e) => update({ cargo: e.target.value })}
          className={`form-control ${showErrors && errors.cargo ? "has-error" : ""}`}
        >
          <option value="" disabled>Selecciona una opción</option>
          {CARGO_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {showErrors && errors.cargo && <p className="form-error">{errors.cargo}</p>}

        {values.cargo === "Otro" && (
          <input
            type="text"
            value={values.cargoOtro}
            onChange={(e) => update({ cargoOtro: e.target.value })}
            placeholder="Escribe tu cargo"
            className={`form-control mt-2 ${showErrors && errors.cargoOtro ? "has-error" : ""}`}
          />
        )}
        {showErrors && errors.cargoOtro && <p className="form-error">{errors.cargoOtro}</p>}
      </div>

      <div>
        <label className="form-label" htmlFor="inversion">¿Cuál es el rango de inversión mensual previsto?</label>
        <select
          id="inversion"
          value={values.inversion}
          onChange={(e) => update({ inversion: e.target.value })}
          className={`form-control ${showErrors && errors.inversion ? "has-error" : ""}`}
        >
          <option value="" disabled>Selecciona una opción</option>
          {INVERSION_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {showErrors && errors.inversion && <p className="form-error">{errors.inversion}</p>}
      </div>

      {status === "error" && (
        <p className="form-error">No pudimos enviar tu información. Por favor intenta de nuevo.</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white text-[14px] font-medium px-6 py-3.5 hover:bg-ink-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Enviando..." : "Solicitar Asesoría"}
      </button>
    </form>
  );
}
