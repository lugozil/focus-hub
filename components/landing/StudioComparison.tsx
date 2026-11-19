"use client";

import { useState } from "react";

export function StudioComparison() {
  const [position, setPosition] = useState(50);
  return (
    <div className="mx-auto mt-8 max-w-4xl">
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-silver-200 bg-silver-100">
        <div className="absolute inset-0 flex items-center justify-end bg-neutral-800 p-6 text-right text-white">
          <div className="w-1/2 text-sm sm:text-base">FOCUS Hub Studio<br/>Imagen definitiva pendiente</div>
        </div>
        <div className="absolute inset-0 flex items-center bg-neutral-200 p-6 text-ink" style={{clipPath: `inset(0 ${100-position}% 0 0)`}}>
          <div className="w-1/2 text-sm sm:text-base">Contenido genérico<br/>Imagen definitiva pendiente</div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 bg-white" style={{left: `${position}%`}}>
          <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 text-ink shadow">↔</span>
        </div>
      </div>
      <label htmlFor="studio-comparison" className="mt-4 block text-center text-sm text-ink-muted">Desliza para apreciar la diferencia.</label>
      <input id="studio-comparison" type="range" min={0} max={100} value={position} onChange={(event) => setPosition(Number(event.target.value))} className="mt-2 w-full accent-neutral-800" />
      <p className="mt-2 text-center text-xs text-ink-muted">Preview: sustituir por dos imágenes del mismo vehículo.</p>
    </div>
  );
}
