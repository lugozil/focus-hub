import Image from "next/image";
import type { ServiceIcon } from "@/lib/dictionaries";

const iconMap: Record<ServiceIcon, string> = {
  mercadeo: "/icons/mercadeo.png",
  publicidad: "/icons/publicidad.png",
  redes: "/icons/redes.png",
  email: "/icons/email.png",
  seo: "/icons/seo.png",
};

export function ServiceIconSvg({ name }: { name: ServiceIcon }) {
  return (
    <Image
      src={iconMap[name]}
      alt={name}
      width={48}
      height={48}
      className="w-12 h-12 object-contain"
    />
  );
}
