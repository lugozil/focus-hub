import Image from "next/image";

export function Logo({
  className = "",
  imgClassName = "h-8 w-auto",
  src = "/logo-focus.png",
  alt = "FOCUS HUB Performance",
  width = 180,
  height = 40,
}: {
  className?: string;
  imgClassName?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}) {
  return (
    <a href="#top" className={`inline-flex items-center ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority
        className={imgClassName}
      />
    </a>
  );
}
