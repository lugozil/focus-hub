"use client";

import { useT } from "@/lib/i18n";

export function LangSwitch() {
  const { lang, setLang } = useT();
  const isEs = lang === "es";

  return (
    <div className="inline-flex items-center text-[12px] font-medium text-ink-muted border border-silver-300 rounded-full overflow-hidden">
      <button
        type="button"
        onClick={() => setLang("es")}
        className={`px-2.5 py-1 transition-colors ${
          isEs ? "bg-ink text-white" : "hover:text-ink"
        }`}
        aria-pressed={isEs}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 transition-colors ${
          !isEs ? "bg-ink text-white" : "hover:text-ink"
        }`}
        aria-pressed={!isEs}
      >
        EN
      </button>
    </div>
  );
}
