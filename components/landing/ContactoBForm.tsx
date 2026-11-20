"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { sendEvent } from "@/lib/tracking";

declare global {
  interface Window {
    dataLayer?: Object[];
  }
}

type Values = {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  dealership: string;
  cargo: string;
  cargoOtro: string;
  carrosPorMes: string;
  servicios: string[];
};

type ContactoBFormProps = {
  variante?: string;
  /** Si se pasa, se muestra la pregunta de servicio de interés (multiselección, obligatoria). */
  serviceOptions?: string[];
  /** Nombres de eventos para Vercel Analytics y el dataLayer (GTM). */
  events?: {
    formularioCompleto: string;
    fase1: string;
    citaAgendada: string;
  };
  /** Con quién es la reunión, p. ej. "nuestro equipo creativo". */
  appointmentLabel?: string;
};

const CONTACTO_B_EVENTS = {
  formularioCompleto: "contacto_b_formulario_completo",
  fase1: "contact_b_fase1",
  citaAgendada: "contacto_b_cita_agendada",
};

type Step = "personal" | "commercial" | "schedule" | "success";
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
  apellido: "",
  telefono: "",
  email: "",
  dealership: "",
  cargo: "",
  cargoOtro: "",
  carrosPorMes: "",
  servicios: [],
};

type Errors = Partial<Record<keyof Values, string>>;

function validate(values: Values, step: Step, requireServicios: boolean): Errors {
  const errors: Errors = {};

  if (step === "personal") {
    if (!values.nombre.trim()) errors.nombre = "Ingresa tu nombre.";
    if (!values.apellido.trim()) errors.apellido = "Ingresa tu apellido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Ingresa un correo válido.";
    if (!/^[0-9+()\-\s]{7,}$/.test(values.telefono.trim())) errors.telefono = "Ingresa un teléfono válido.";
    return errors;
  }
  if (step !== "commercial") return errors;

  if (values.dealership.trim().length < 2) errors.dealership = "Ingresa el nombre del Dealership.";
  if (!values.cargo) errors.cargo = "Selecciona una opción.";
  if (values.cargo === "Otro" && values.cargoOtro.trim().length === 0) {
    errors.cargoOtro = "Escribe tu cargo.";
  }
  if (!values.carrosPorMes) errors.carrosPorMes = "Selecciona una opción.";
  if (requireServicios && values.servicios.length === 0) {
    errors.servicios = "Selecciona al menos un servicio.";
  }

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

function formatGHLDateTime(date: Date, time: string) {
  const [hStr, mStr] = time.split(":");
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hStr}:${mStr}:00`;
}

const WEEKDAY_LABELS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

const PR_DATE_PARTS_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Puerto_Rico",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function todayInPuertoRico(): Date {
  const parts = PR_DATE_PARTS_FORMATTER.formatToParts(new Date());
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return new Date(Number(map.year), Number(map.month) - 1, Number(map.day));
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, delta: number) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function isSelectableDay(date: Date, minDate: Date) {
  const day = date.getDay();
  return day !== 0 && day !== 6 && date.getTime() >= minDate.getTime();
}

function buildMonthGrid(month: Date): (Date | null)[][] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7; // 0 = lunes

  const cells: (Date | null)[] = Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, monthIndex, day));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat("es", {
  month: "long",
  year: "numeric",
});

function formatMonthLabel(date: Date) {
  const label = MONTH_LABEL_FORMATTER.format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

const FULL_DATE_FORMATTER = new Intl.DateTimeFormat("es", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function ServiceMultiSelect({
  options,
  selected,
  onToggle,
  hasError,
}: {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  hasError: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        id="servicios"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="servicios-label"
        onClick={() => setOpen((o) => !o)}
        className={`form-control flex items-center justify-between gap-2 text-left ${hasError ? "has-error" : ""}`}
      >
        <span className={`truncate ${selected.length ? "" : "text-ink-faint"}`}>
          {selected.length ? selected.join(", ") : "Selecciona una o varias opciones"}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby="servicios-label"
          className="absolute left-0 right-0 z-20 mt-1 rounded-xl border border-silver-300 bg-white p-1 shadow-lg"
        >
          {options.map((option) => {
            const active = selected.includes(option);
            return (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => onToggle(option)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-ink hover:bg-silver-50"
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      active ? "border-ink bg-ink text-white" : "border-silver-400"
                    }`}
                  >
                    {active && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function optionButtonClass(active: boolean) {
  return [
    "rounded-xl border px-3 py-2.5 text-[13px] font-medium text-center transition-colors",
    active
      ? "border-ink bg-ink text-white"
      : "border-silver-300 text-ink-soft bg-white hover:border-ink-faint hover:bg-silver-50",
  ].join(" ");
}

export function ContactoBForm({
  variante = "contacto-b",
  serviceOptions,
  events = CONTACTO_B_EVENTS,
  appointmentLabel = "nuestro equipo de especialistas",
}: ContactoBFormProps = {}) {
  const requireServicios = Boolean(serviceOptions?.length);
  const [values, setValues] = useState<Values>(INITIAL_VALUES);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [step, setStep] = useState<Step>("personal");
  const [status, setStatus] = useState<Status>("idle");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const today = useMemo(() => todayInPuertoRico(), []);
  const minSelectableDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d;
  }, [today]);
  const minMonth = useMemo(() => startOfMonth(today), [today]);
  const maxMonth = useMemo(() => addMonths(minMonth, 2), [minMonth]);
  const [visibleMonth, setVisibleMonth] = useState<Date>(minMonth);

  const monthWeeks = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);
  const canGoPrevMonth = visibleMonth.getTime() > minMonth.getTime();
  const canGoNextMonth = visibleMonth.getTime() < maxMonth.getTime();

  const update = (patch: Partial<Values>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  const errors = validate(values, step, requireServicios);

  const toggleServicio = (servicio: string) =>
    setValues((prev) => ({
      ...prev,
      servicios: prev.servicios.includes(servicio)
        ? prev.servicios.filter((s) => s !== servicio)
        : [...prev.servicios, servicio],
    }));
  const showErrors = formSubmitted;

  function submitLead(payload: {
    agendado: boolean;
    fechaCita: string;
    horaCita: string;
    fechaHoraCita: string;
  }) {
    return fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        variante,
        nombre: [values.nombre.trim(), values.apellido.trim()].join(" "),
        firstName: values.nombre.trim(),
        lastName: values.apellido.trim(),
        telefono: values.telefono.trim(),
        email: values.email.trim(),
        dealership: values.dealership.trim(),
        cargo: resolveCargo(values),
        carrosPorMes: values.carrosPorMes,
        ...(requireServicios && { servicios: values.servicios.join(", ") }),
        ...payload,
      }),
    });
  }

  async function handleContinuar(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    if (step === "personal") {
      setFormSubmitted(false);
      setStep("commercial");
      return;
    }
    // Fase 1: el lead se guarda sin cita; si agenda, la fase 2 actualiza el
    // mismo registro (match por email + teléfono).
    setStatus("submitting");
    try {
      const res = await submitLead({ agendado: false, fechaCita: "NO AGENDO", horaCita: "NO AGENDO", fechaHoraCita: "" });
      if (!res.ok) throw new Error("request-failed");
      track(events.formularioCompleto);
      window.dataLayer?.push({ event: events.fase1 });
      sendEvent("form_submit");
      sendEvent("form_field", { name: "Calendario (fase 3)" });
      setStatus("idle");
      setFormSubmitted(false);
      setStep("schedule");
    } catch {
      setStatus("error");
    }
  }

  async function handleAgendarCita() {
    if (!selectedDate || !selectedTime) return;

    setStatus("submitting");
    try {
      const res = await submitLead({
        agendado: true,
        fechaCita: FULL_DATE_FORMATTER.format(selectedDate),
        horaCita: `${formatTime(selectedTime)} (hora de Puerto Rico)`,
        fechaHoraCita: formatGHLDateTime(selectedDate, selectedTime),
      });
      if (!res.ok) throw new Error("request-failed");
      track(events.citaAgendada);
      sendEvent("cita");
      window.dataLayer?.push({ event: events.citaAgendada });
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
          Hemos recibido tu solicitud de reunión para el{" "}
          <span className="text-ink font-medium">
            {selectedDate ? FULL_DATE_FORMATTER.format(selectedDate) : ""}
          </span>{" "}
          a las{" "}
          <span className="text-ink font-medium">
            {selectedTime ? `${formatTime(selectedTime)} (hora de Puerto Rico)` : ""}
          </span>
          . Nuestro equipo se comunicará contigo para confirmar los próximos pasos.
        </p>
      </div>
    );
  }

  if (step === "schedule") {
    return (
      <div className="rounded-2xl border border-silver-200 bg-white p-6 md:p-8 space-y-5 animate-fade-up">
        <button
          type="button"
          onClick={() => { setStatus("idle"); setStep("commercial"); }}
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
          <p className="text-xs text-ink-muted">Paso 3 · Agendamiento</p>
          <h2 className="text-lg font-semibold text-ink">Agenda Tu Reunión</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Selecciona el día y la hora de tu preferencia para reunirte con {appointmentLabel}.
          </p>
        </div>

        <div>
          <label className="form-label">Selecciona una fecha</label>
          <p className="text-xs text-ink-muted mb-2">Horarios sujetos a confirmación del equipo.</p>

          <div className="rounded-2xl border border-silver-200 p-3 md:p-4">
            <div className="flex items-center justify-between px-1 pb-3">
              <button
                type="button"
                onClick={() => canGoPrevMonth && setVisibleMonth((m) => addMonths(m, -1))}
                disabled={!canGoPrevMonth}
                aria-label="Mes anterior"
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-silver-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <span className="text-sm font-semibold text-ink">
                {formatMonthLabel(visibleMonth)}
              </span>

              <button
                type="button"
                onClick={() => canGoNextMonth && setVisibleMonth((m) => addMonths(m, 1))}
                disabled={!canGoNextMonth}
                aria-label="Mes siguiente"
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-silver-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center">
              {WEEKDAY_LABELS.map((label) => (
                <span key={label} className="text-[11px] font-medium uppercase tracking-wide text-ink-faint py-1">
                  {label}
                </span>
              ))}

              {monthWeeks.map((week, weekIndex) =>
                week.map((day, dayIndex) => {
                  if (!day) return <span key={`${weekIndex}-${dayIndex}`} />;

                  const selectable = isSelectableDay(day, minSelectableDate);
                  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                  const isToday = isSameDay(day, today);

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      disabled={!selectable}
                      onClick={() => {
                        setSelectedDate(day);
                        setSelectedTime(null);
                      }}
                      className={[
                        "mx-auto my-0.5 flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-medium transition-colors",
                        !selectable
                          ? "text-ink-faint/50 cursor-not-allowed"
                          : isSelected
                            ? "bg-ink text-white"
                            : "text-ink hover:bg-silver-100",
                        isToday && !isSelected ? "ring-1 ring-inset ring-silver-300" : "",
                      ].join(" ")}
                    >
                      {day.getDate()}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {selectedDate && (
          <div>
            <label className="form-label">Selecciona una hora (hora de Puerto Rico)</label>
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
          <p className="form-error">No pudimos registrar tu solicitud. Por favor intenta de nuevo.</p>
        )}

        <button
          type="button"
          onClick={handleAgendarCita}
          disabled={!selectedDate || !selectedTime || status === "submitting"}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white text-[14px] font-medium px-6 py-3.5 hover:bg-ink-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Agendando..." : "CONFIRMAR MI REUNIÓN"}
        </button>
      </div>
    );
  }

  const textField = (key: "nombre" | "apellido" | "email" | "telefono" | "dealership", label: string, type = "text", autoComplete?: string) => (
    <div key={key}>
      <label className="form-label" htmlFor={key}>{label}</label>
      <input
        id={key}
        type={type}
        autoComplete={autoComplete}
        value={values[key]}
        onChange={(e) => update({ [key]: e.target.value })}
        className={`form-control ${showErrors && errors[key] ? "has-error" : ""}`}
      />
      {showErrors && errors[key] && <p className="form-error">{errors[key]}</p>}
    </div>
  );
  const selectField = (key: "cargo" | "carrosPorMes", label: string, options: string[]) => (
    <div key={key}>
      <label className="form-label" htmlFor={key}>{label}</label>
      <select
        id={key}
        value={values[key]}
        onChange={(e) => update({ [key]: e.target.value })}
        className={`form-control ${showErrors && errors[key] ? "has-error" : ""}`}
      >
        <option value="" disabled>Selecciona una opción</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      {showErrors && errors[key] && <p className="form-error">{errors[key]}</p>}
    </div>
  );

  return (
    <form data-track-form onSubmit={handleContinuar} className="rounded-2xl border border-silver-200 bg-white p-6 md:p-8 space-y-5" noValidate>
      <div>
        <p className="text-xs text-ink-muted">Paso {step === "personal" ? 1 : 2}</p>
        <h3 className="mt-1 text-lg font-semibold">{step === "personal" ? "Información Personal" : "Información Comercial"}</h3>
      </div>
      {step === "personal" ? (
        <>
          {textField("nombre", "Nombre", "text", "given-name")}
          {textField("apellido", "Apellido", "text", "family-name")}
          {textField("email", "Correo electrónico", "email", "email")}
          {textField("telefono", "Número de teléfono", "tel", "tel")}
        </>
      ) : (
        <>
          {textField("dealership", "Nombre del Dealership", "text", "organization")}
          <div>
            {selectField("cargo", "Cargo actual", CARGO_OPTIONS)}
            {values.cargo === "Otro" && (
              <input
                type="text"
                aria-label="Escribe tu cargo"
                value={values.cargoOtro}
                onChange={(e) => update({ cargoOtro: e.target.value })}
                placeholder="Escribe tu cargo"
                className={`form-control mt-2 ${showErrors && errors.cargoOtro ? "has-error" : ""}`}
              />
            )}
            {showErrors && errors.cargoOtro && <p className="form-error">{errors.cargoOtro}</p>}
          </div>
          {selectField("carrosPorMes", "¿Cuántos vehículos venden al mes?", CARROS_OPTIONS)}
          {serviceOptions && serviceOptions.length > 0 && (
            <div>
              <label className="form-label" id="servicios-label">
                ¿Qué servicios te interesan?{" "}
                <span className="font-normal text-ink-faint">(puedes elegir varios)</span>
              </label>
              <ServiceMultiSelect
                options={serviceOptions}
                selected={values.servicios}
                onToggle={toggleServicio}
                hasError={Boolean(showErrors && errors.servicios)}
              />
              {showErrors && errors.servicios && <p className="form-error">{errors.servicios}</p>}
            </div>
          )}
        </>
      )}
      {status === "error" && <p role="alert" className="form-error">No pudimos enviar tu aplicación. Inténtalo de nuevo.</p>}
      <button type="submit" disabled={status === "submitting"} className="w-full rounded-full bg-ink text-white text-sm font-medium px-6 py-3.5 disabled:opacity-50">
        {status === "submitting" ? "Enviando..." : "CONTINUAR"}
      </button>
      {step === "commercial" && (
        <button
          type="button"
          disabled={status === "submitting"}
          className="block mx-auto text-sm text-ink-muted"
          onClick={() => { setStatus("idle"); setFormSubmitted(false); setStep("personal"); }}
        >
          Volver
        </button>
      )}
      <p className="text-xs text-center text-ink-muted">Al continuar, solicitas que nuestro equipo evalúe tu aplicación y se comunique contigo para gestionar tu solicitud.</p>
      <p className="text-xs text-center text-ink-muted">
        <a href="/politica-de-privacidad" target="_blank" rel="noopener noreferrer" className="underline">Política de Privacidad</a> |{" "}
        <a href="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className="underline">Términos y Condiciones</a>
      </p>
    </form>
  );
}
