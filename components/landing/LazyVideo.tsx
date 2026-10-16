"use client";

import { useEffect, useRef, useState } from "react";

type LazyVideoProps = {
  src: string;
  className?: string;
  /** Si se pasa, el video se mide en el dashboard con este nombre. */
  trackName?: string;
};

export function LazyVideo({ src, className, trackName }: LazyVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className={className} data-track-video={trackName}>
      {shouldLoad ? (
        <video src={src} controls playsInline preload="metadata" className="w-full h-full object-cover">
          Tu navegador no soporta la reproducción de video.
        </video>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <div className="h-10 w-10 rounded-full border-2 border-white/30 border-t-white/80 animate-spin" />
        </div>
      )}
    </div>
  );
}
