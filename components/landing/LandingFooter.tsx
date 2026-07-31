export function LandingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-silver-200 bg-silver-50">
      <div className="mx-auto max-w-6xl px-6 py-8 text-center">
        <p className="text-[12px] text-ink-faint">© {year} FOCUS Hub.</p>
      </div>
    </footer>
  );
}
