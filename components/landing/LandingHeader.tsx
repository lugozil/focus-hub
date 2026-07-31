import { Logo } from "@/components/Logo";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-silver-200">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center">
        <Logo />
      </div>
    </header>
  );
}
