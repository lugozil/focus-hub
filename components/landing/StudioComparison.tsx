"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const LABEL_CLASS =
  "pointer-events-none absolute top-3 sm:top-4 rounded-full bg-black/60 px-3 py-1.5 text-xs sm:text-sm font-medium text-white backdrop-blur-sm";

export function StudioComparison() {
  const [position, setPosition] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function moveTo(clientX: number) {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }

  return (
    <div className="mx-auto mt-8 max-w-4xl">
      <div
        ref={frame}
        className="relative aspect-[16/9] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-2xl border border-silver-200 bg-silver-100"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          moveTo(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        {/* Derecha: FOCUS Hub Studio */}
        <Image
          src="/studio-comparacion-focus.jpg"
          alt="Tesla blanco fotografiado por FOCUS Hub Studio"
          fill
          sizes="(min-width: 896px) 896px, 100vw"
          className="object-cover"
          draggable={false}
        />
        <span className={`${LABEL_CLASS} right-3 sm:right-4`}>FOCUS Hub Studio</span>

        {/* Izquierda: contenido genérico, recortado según el deslizador */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image
            src="/studio-comparacion-generico.jpg"
            alt="Sedán gris fotografiado de forma amateur en un lote"
            fill
            sizes="(min-width: 896px) 896px, 100vw"
            className="object-cover"
            draggable={false}
          />
          <span className={`${LABEL_CLASS} left-3 sm:left-4`}>Contenido genérico</span>
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white" style={{ left: `${position}%` }}>
          <span className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
      <label htmlFor="studio-comparison" className="mt-4 block text-center text-sm text-ink-muted">
        Desliza para apreciar la diferencia.
      </label>
      <input
        id="studio-comparison"
        type="range"
        min={0}
        max={100}
        value={Math.round(position)}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="mt-2 w-full accent-neutral-800"
      />
    </div>
  );
}
