import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo-focus.png"
        alt="FOCUS HUB Performance"
        width={180}
        height={40}
        priority
        className="h-8 w-auto"
      />
    </a>
  );
}
