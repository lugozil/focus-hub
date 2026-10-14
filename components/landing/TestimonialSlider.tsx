"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { LazyVideo } from "@/components/landing/LazyVideo";

type TestimonialVideo = {
  src: string;
  label?: string;
};

type TestimonialSliderProps = {
  videos: TestimonialVideo[];
  className?: string;
};

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d={direction === "right" ? "M5 2.5L9.5 7 5 11.5" : "M9 2.5L4.5 7 9 11.5"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TestimonialSlider({ videos, className }: TestimonialSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Detecta el slide visible (swipe, flechas o puntos) y pausa los demás videos.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      const index = Math.round(el.scrollLeft / el.clientWidth);
      setActive((prev) => (prev === index ? prev : index));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    trackRef.current?.querySelectorAll("video").forEach((video, i) => {
      if (i !== active && !video.paused) video.pause();
    });
    track("testimonial_slide", { index: active });
  }, [active]);

  const goTo = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(videos.length - 1, index));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  };

  const hasMany = videos.length > 1;

  const arrowClass =
    "flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-md border border-silver-200 hover:bg-silver-50 transition-opacity disabled:opacity-30 disabled:cursor-default disabled:hover:bg-white";

  return (
    <div className={className}>
      {hasMany && (
        <p className="mb-3 flex items-center justify-center gap-1.5 text-xs md:text-[13px] font-medium text-ink-faint">
          Desliza para ver más testimonios
          <Arrow direction="right" />
        </p>
      )}

      {/* Mismo ancho que el VSL del hero */}
      <div className="mx-auto w-full max-w-[420px] md:max-w-full">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-roledescription="carrusel"
        >
          {videos.map((video, i) => (
            <div
              key={video.src}
              className="w-full shrink-0 snap-center"
              aria-roledescription="slide"
              aria-label={video.label ?? `Testimonio ${i + 1} de ${videos.length}`}
            >
              <LazyVideo
                src={video.src}
                className="aspect-video w-full rounded-2xl overflow-hidden border border-silver-200 shadow-lg bg-black"
              />
            </div>
          ))}
        </div>
      </div>

      {hasMany && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Testimonio anterior"
            className={arrowClass}
          >
            <Arrow direction="left" />
          </button>

          <div className="flex items-center gap-2">
            {videos.map((video, i) => (
              <button
                key={video.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ver testimonio ${i + 1}`}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-6 bg-ink" : "w-2 bg-silver-300 hover:bg-ink-faint"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === videos.length - 1}
            aria-label="Siguiente testimonio"
            className={arrowClass}
          >
            <Arrow direction="right" />
          </button>
        </div>
      )}
    </div>
  );
}
