import type { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";

export const metadata: Metadata = { title: "Política de Privacidad — FOCUS Hub LLC", robots: {index:false,follow:false} };
const sections = [
  [
    "1. Introducción",
    "FOCUS Hub LLC, en adelante «FOCUS Hub», reconoce la importancia de proteger la privacidad de sus usuarios, prospectos y clientes. La presente Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos la información proporcionada a través de nuestros sitios web y canales digitales."
  ],
  [
    "2. Información que recopilamos",
    "Podemos recopilar las siguientes categorías de información:",
    "- Nombre y apellido.\n- Correo electrónico y número de teléfono.\n- Información empresarial y profesional.\n- Nombre y ubicación de la empresa.\n- Información comercial proporcionada mediante formularios de aplicación.\n- Información relacionada con solicitudes, reuniones y comunicaciones.\n- Dirección IP, características del dispositivo, navegador e información de navegación.",
    "La información puede obtenerse directamente del usuario o mediante tecnologías utilizadas en nuestros sitios web."
  ],
  [
    "3. Uso de la información",
    "Utilizamos la información recopilada para:",
    "- Gestionar y evaluar aplicaciones comerciales.\n- Contactar a usuarios y potenciales clientes.\n- Coordinar reuniones y presentaciones.\n- Evaluar oportunidades de colaboración.\n- Proporcionar información sobre nuestras soluciones.\n- Gestionar relaciones comerciales.\n- Analizar y mejorar nuestros sitios web, campañas publicitarias y procesos internos.\n- Cumplir con nuestras obligaciones legales y regulatorias."
  ],
  [
    "4. Comunicaciones",
    "Podremos utilizar los datos de contacto proporcionados para responder solicitudes, coordinar reuniones y dar seguimiento a oportunidades comerciales.",
    "Las comunicaciones promocionales y aquellas realizadas mediante sistemas automatizados estarán sujetas a los requisitos de consentimiento establecidos por la legislación aplicable.",
    "El usuario podrá solicitar la cancelación de dichas comunicaciones en cualquier momento, incluyendo mediante los mecanismos de cancelación disponibles en nuestros mensajes."
  ],
  [
    "5. Cookies y tecnologías de seguimiento",
    "Nuestros sitios web pueden utilizar cookies, píxeles de seguimiento y otras tecnologías destinadas a mejorar la experiencia de navegación, analizar el comportamiento de los usuarios y medir el rendimiento de nuestras campañas publicitarias.",
    "Estas tecnologías pueden ser proporcionadas por plataformas externas especializadas en publicidad, análisis de datos y servicios digitales.",
    "El usuario podrá administrar sus preferencias mediante las configuraciones de su navegador y los mecanismos de privacidad disponibles en el sitio."
  ],
  [
    "6. Servicios y proveedores externos",
    "FOCUS Hub podrá utilizar proveedores tecnológicos para gestionar información, comunicaciones, almacenamiento, publicidad, análisis de datos, ubicaciones comerciales y otros procesos relacionados con su actividad empresarial.",
    "La información podrá compartirse con dichos proveedores cuando resulte necesario para las finalidades descritas en esta política, bajo las condiciones y obligaciones de protección aplicables.",
    "Los servicios de localización proporcionados por Google Maps están sujetos a las políticas de privacidad y condiciones de servicio de Google."
  ],
  [
    "7. Protección de la información",
    "FOCUS Hub adoptará medidas administrativas, técnicas y organizativas razonables para proteger la información frente a accesos no autorizados, pérdidas, alteraciones o divulgaciones indebidas.",
    "No obstante, ningún sistema de almacenamiento o transmisión electrónica puede garantizar una seguridad absoluta."
  ],
  [
    "8. Conservación de la información",
    "Conservaremos la información durante el tiempo razonablemente necesario para cumplir con las finalidades para las cuales fue recopilada, gestionar nuestras relaciones comerciales y atender obligaciones legales, administrativas o contractuales."
  ],
  [
    "9. Derechos de privacidad",
    "De conformidad con la legislación aplicable, los usuarios podrán solicitar:",
    "- Acceso a su información personal.\n- Corrección o actualización de sus datos.\n- Eliminación de información personal.\n- Retiro de su consentimiento, cuando corresponda.\n- Cancelación de comunicaciones comerciales.\n- Ejercicio de otros derechos reconocidos por la normativa aplicable.",
    "Las solicitudes estarán sujetas a los procedimientos de verificación de identidad, requisitos y excepciones previstos por la legislación correspondiente."
  ],
  [
    "10. Privacidad de menores",
    "Nuestros sitios web y servicios están dirigidos a profesionales y empresas. No están destinados a menores de edad ni recopilamos intencionalmente información personal de menores de 13 años."
  ],
  [
    "11. Modificaciones",
    "FOCUS Hub podrá actualizar esta Política de Privacidad para reflejar cambios en sus operaciones, tecnologías o requisitos legales. Las versiones actualizadas estarán disponibles en nuestros sitios web."
  ],
  [
    "12. Contacto",
    "Para consultas relacionadas con esta Política de Privacidad o el tratamiento de información personal, puede comunicarse con nosotros a través de:"
  ]
];

export default function LegalPage() {
  return <><LandingHeader logoClassName="h-6 w-auto" /><main lang="es" className="mx-auto max-w-3xl px-6 py-12 md:py-16 space-y-8">
    <a href="/contacto-b" className="text-sm underline text-ink-muted">Volver a FOCUS Hub Performance</a>
    <header><h1 className="text-3xl md:text-4xl font-semibold text-ink">Política de Privacidad</h1><p className="mt-2 text-ink-muted">FOCUS Hub LLC</p></header>
    {sections.map(([heading,...paragraphs])=><section key={heading} className="space-y-3"><h2 className="text-lg font-semibold text-ink">{heading}</h2>{paragraphs.map(p=>p.startsWith("- ")?<ul key={p} className="list-disc pl-6 space-y-1 text-sm leading-relaxed text-ink-muted">{p.split("\n").map(line=><li key={line}>{line.slice(2)}</li>)}</ul>:<p key={p} className="text-sm leading-relaxed text-ink-muted">{p}</p>)}</section>)}
    <address className="not-italic text-sm leading-relaxed text-ink-muted">FOCUS Hub LLC<br/>Correo electrónico: <a href="mailto:support@focushub.one" className="underline">support@focushub.one</a><br/>Teléfono: <a href="tel:+17874177570" className="underline">+1 (787) 417-7570</a><br/>Sitio web: <a href="/" className="underline">www.focushub.one</a></address>
    <footer className="border-t border-silver-200 pt-5 text-xs text-ink-muted">© {new Date().getFullYear()} FOCUS Hub LLC. Todos los derechos reservados.</footer>
  </main></>;
}
