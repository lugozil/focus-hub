"use client";

import { useMemo, useState } from "react";

type Values = {
  nombre: string;
  telefono: string;
  email: string;
  dealership: string;
  cargo: string;
  cargoOtro: string;
  carrosPorMes: string;
};

type Step = "form" | "schedule" | "success";
type Status = "idle" | "submitting" | "error";

const CARGO_OPTIONS = [
  "Dueño / CEO",
  "Gerente General",
  "Director(a) de Marketing o Ventas",
  "Otro",
];

const CARROS_OPTIONS = ["Menos de 10", "10-25", "25-50", "Más de 50"];

const INITIAL_VALUES: Values = {
  nombre: "",
  telefono: "",
  email: "",
  dealership: "",
  cargo: "",
  cargoOtro: "",
  carrosPorMes: "",
};

type Errors = Partial<Record<keyof Values, string>>;

function validate(values: Values): Errors {
  const errors: Errors = {};

  if (values.nombre.trim().length < 2) errors.nombre = "Ingresa tu nombre completo.";
  if (!/^[0-9+()\-\s]{7,}$/.test(values.telefono.trim())) errors.telefono = "Ingresa un teléfono válido.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Ingresa un correo válido.";
  if (values.dealership.trim().length < 2) errors.dealership = "Ingresa el nombre de tu dealership.";
  if (!values.cargo) errors.cargo = "Selecciona una opción.";
  if (values.cargo === "Otro" && values.cargoOtro.trim().length === 0) {
    errors.cargoOtro = "Escribe tu cargo.";
  }
  if (!values.carrosPorMes) errors.carrosPorMes = "Selecciona una opción.";

  return errors;
}

function resolveCargo(values: Values) {
  return values.cargo === "Otro" ? values.cargoOtro.trim() : values.cargo;
}

const TIME_SLOTS: string[] = [];
for (let h = 9; h <= 16; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:00`);
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:30`);
}

function formatTime(time: string) {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const period = h >= 12 ? "p.m." : "a.m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${period}`;
}

function getBusinessDays(count: number): Date[] {
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1);

  while (days.length < count) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("es", {
  weekday: "short",
  day: "2-digit",
  month: "short",
});

const FULL_DATE_FORMATTER = new Intl.DateTimeFormat("es", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function optionButtonClass(active: boolean) {
  return [
    "rounded-xl border px-3 py-2.5 text-[13px] font-medium text-center transition-colors",
    active
      ? "border-ink bg-ink text-white"
      : "border-silver-300 text-ink-soft bg-white hover:border-ink-faint hover:bg-silver-50",
  ].join(" ");
}

export function ContactoBForm() {
  const [values, setValues] = useState<Values>(INITIAL_VALUES);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [status, setStatus] = useState<Status>("idle");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const businessDays = useMemo(() => getBusinessDays(10), []);

  const update = (patch: Partial<Values>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  const errors = validate(values);
  const showErrors = formSubmitted;

  function handleContinuar(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitted(true);
    if (Object.keys(validate(values)).length > 0) return;
    setStep("schedule");
  }

  async function handleAgendarCita() {
    if (!selectedDate || !selectedTime) return;

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
          dealership: values.dealership.trim(),
          cargo: resolveCargo(values),
          carrosPorMes: values.carrosPorMes,
          fechaCita: FULL_DATE_FORMATTER.format(selectedDate),
          horaCita: `${formatTime(selectedTime)} (AST)`,
        }),
      });
      if (!res.ok) throw new Error("request-failed");
      setStep("success");
    } catch {
      setStatus("error");
    }
  }

  if (step === "success") {
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
          ¡Listo, {values.nombre.split(" ")[0]}!
        </h2>
        <p className="mt-3 text-sm text-ink-muted leading-relaxed max-w-sm mx-auto">
          Tu cita quedó agendada para el{" "}
          <span className="text-ink font-medium">
            {selectedDate ? FULL_DATE_FORMATTER.format(selectedDate) : ""}
          </span>{" "}
          a las{" "}
          <span className="text-ink font-medium">
            {selectedTime ? `${formatTime(selectedTime)} (AST)` : ""}
          </span>
          . Te enviaremos la confirmación a tu correo.
        </p>
      </div>
    );
  }

  if (step === "schedule") {
    return (
      <div className="rounded-2xl border border-silver-200 bg-white p-6 md:p-8 space-y-5 animate-fade-up">
        <button
          type="button"
          onClick={() => setStep("form")}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-muted hover:text-ink transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M11 7H3m0 0l3.5-3.5M3 7l3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Volver
        </button>

        <div>
          <h2 className="text-lg font-semibold text-ink">Agenda tu cita</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Selecciona el día y la hora que prefieras para tu auditoría gratuita.
          </p>
        </div>

        <div>
          <label className="form-label">Selecciona un día</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {businessDays.map((day) => (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => {
                  setSelectedDate(day);
                  setSelectedTime(null);
                }}
                className={optionButtonClass(
                  selectedDate?.toDateString() === day.toDateString()
                )}
              >
                {SHORT_DATE_FORMATTER.format(day)}
              </button>
            ))}
          </div>
        </div>

        {selectedDate && (
          <div>
            <label className="form-label">Selecciona una hora (AST)</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={optionButtonClass(selectedTime === time)}
                >
                  {formatTime(time)}
                </button>
              ))}
            </div>
          </div>
        )}

        {status === "error" && (
          <p className="form-error">No pudimos agendar tu cita. Por favor intenta de nuevo.</p>
        )}

        <button
          type="button"
          onClick={handleAgendarCita}
          disabled={!selectedDate || !selectedTime || status === "submitting"}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white text-[14px] font-medium px-6 py-3.5 hover:bg-ink-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Agendando..." : "Agendar cita"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleContinuar}
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
        <label className="form-label" htmlFor="dealership">¿Cuál es el nombre de tu dealership?</label>
        <input
          id="dealership"
          type="text"
          value={values.dealership}
          onChange={(e) => update({ dealership: e.target.value })}
          placeholder="Ej. Auto Group San Juan"
          className={`form-control ${showErrors && errors.dealership ? "has-error" : ""}`}
        />
        {showErrors && errors.dealership && <p className="form-error">{errors.dealership}</p>}
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
        <label className="form-label" htmlFor="carrosPorMes">
          ¿Cuál es la cantidad promedio de carros que vendes al mes?
        </label>
        <select
          id="carrosPorMes"
          value={values.carrosPorMes}
          onChange={(e) => update({ carrosPorMes: e.target.value })}
          className={`form-control ${showErrors && errors.carrosPorMes ? "has-error" : ""}`}
        >
          <option value="" disabled>Selecciona una opción</option>
          {CARROS_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {showErrors && errors.carrosPorMes && <p className="form-error">{errors.carrosPorMes}</p>}
      </div>

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white text-[14px] font-medium px-6 py-3.5 hover:bg-ink-soft transition-colors"
      >
        Continuar
      </button>
    </form>
  );
}
