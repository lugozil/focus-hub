import Image from "next/image";

export function LandingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-silver-200 bg-silver-50">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col items-center gap-2 text-center">
        <Image
          src="/icono-focus.png"
          alt="FOCUS Hub"
          width={56}
          height={56}
          className="h-12 w-12 opacity-80"
        />
        <p className="text-[12px] text-ink-faint">© {year} FOCUS Hub.</p>
      </div>
    </footer>
  );
}
