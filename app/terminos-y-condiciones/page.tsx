import type { Metadata } from "next";
import { LandingHeader } from "@/components/landing/LandingHeader";

export const metadata: Metadata = { title: "Términos y Condiciones del Sitio Web — FOCUS Hub LLC", robots: {index:false,follow:false} };
const sections = [
  [
    "1. Disposiciones generales",
    "Los presentes Términos y Condiciones regulan el acceso y uso de los sitios web, plataformas digitales y páginas comerciales administradas por FOCUS Hub LLC, en adelante «FOCUS Hub».",
    "El acceso y uso de estos sitios estará sujeto a las presentes disposiciones y a la legislación aplicable."
  ],
  [
    "2. Finalidad del sitio web",
    "Los sitios web de FOCUS Hub tienen como finalidad proporcionar información corporativa y comercial sobre nuestras capacidades, soluciones, metodologías y experiencia profesional, así como facilitar la comunicación con potenciales clientes.",
    "La información publicada tiene carácter informativo y no constituye, por sí misma, una oferta contractual vinculante."
  ],
  [
    "3. Proceso de aplicación y selección",
    "FOCUS Hub opera bajo un modelo selectivo de incorporación de clientes.",
    "La presentación de una aplicación, el envío de información o la programación de una reunión no garantizan la aprobación de una solicitud ni el establecimiento de una relación comercial.",
    "Nuestro equipo podrá evaluar cada oportunidad de acuerdo con criterios internos de compatibilidad empresarial, comercial y profesional.",
    "La contratación de servicios estará sujeta a la aprobación correspondiente y a la formalización de los acuerdos contractuales aplicables."
  ],
  [
    "4. Veracidad de la información",
    "Los usuarios deberán proporcionar información veraz, precisa y actualizada al completar formularios, presentar aplicaciones o establecer comunicaciones con FOCUS Hub.",
    "FOCUS Hub podrá suspender la evaluación de solicitudes que contengan información falsa, incompleta o engañosa."
  ],
  [
    "5. Propiedad intelectual",
    "Los elementos originales de nuestros sitios web, incluyendo marcas, logotipos, textos, diseños, contenidos audiovisuales, metodologías y recursos digitales, pertenecen a FOCUS Hub o a sus respectivos titulares.",
    "El acceso al sitio web no concede derechos de propiedad, explotación comercial, reproducción, distribución o utilización de dichos elementos sin la autorización correspondiente."
  ],
  [
    "6. Uso adecuado del sitio web",
    "El usuario se compromete a utilizar nuestros sitios web de manera lícita y responsable.",
    "Queda prohibido utilizar el sitio para actividades fraudulentas, acceder sin autorización a sistemas o información, introducir contenido malicioso, interferir con su funcionamiento o infringir derechos de terceros."
  ],
  [
    "7. Testimonios y resultados",
    "Los testimonios y casos de éxito publicados corresponden a experiencias particulares de clientes.",
    "Los resultados comerciales pueden variar en función de las condiciones del mercado, la inversión, la estructura operativa, los procesos comerciales y otros factores propios de cada empresa.",
    "FOCUS Hub no garantiza resultados comerciales específicos mediante la información publicada en sus sitios web."
  ],
  [
    "8. Servicios y enlaces de terceros",
    "Nuestros sitios web pueden incorporar enlaces, herramientas o funcionalidades proporcionadas por terceros.",
    "El uso de Google Maps y de sus funcionalidades de localización está sujeto a los Términos de Servicio y a la Política de Privacidad de Google.",
    "FOCUS Hub no controla las políticas, disponibilidad o funcionamiento independiente de plataformas externas."
  ],
  [
    "9. Disponibilidad del sitio web",
    "FOCUS Hub procurará mantener sus sitios web disponibles y actualizados. Sin embargo, su funcionamiento podrá verse afectado por tareas de mantenimiento, actualizaciones, fallos tecnológicos u otras circunstancias.",
    "Nos reservamos el derecho de modificar, actualizar o retirar contenidos y funcionalidades cuando resulte necesario."
  ],
  [
    "10. Limitación de responsabilidad",
    "En la máxima medida permitida por la legislación aplicable, FOCUS Hub no será responsable por pérdidas o daños derivados del uso indebido del sitio web, interrupciones ajenas a su control razonable o decisiones adoptadas exclusivamente sobre la base de información de carácter general publicada en el sitio.",
    "Ninguna disposición de estos términos limitará responsabilidades o derechos que legalmente no puedan excluirse."
  ],
  [
    "11. Privacidad",
    "El tratamiento de información personal recopilada a través de nuestros sitios web se encuentra regulado por nuestra Política de Privacidad."
  ],
  [
    "12. Contratación de servicios",
    "Los presentes Términos y Condiciones regulan exclusivamente el uso del sitio web.",
    "Las condiciones económicas, obligaciones, responsabilidades, alcances y demás disposiciones relativas a la contratación de servicios profesionales serán establecidas mediante los acuerdos contractuales correspondientes."
  ],
  [
    "13. Legislación aplicable",
    "Los presentes Términos y Condiciones se interpretarán conforme a la legislación aplicable del Estado de Florida y las disposiciones federales correspondientes de los Estados Unidos, sin perjuicio de otras normas de carácter obligatorio que resulten aplicables."
  ],
  [
    "14. Modificaciones",
    "FOCUS Hub podrá actualizar los presentes Términos y Condiciones para reflejar cambios operativos, tecnológicos o legales. La versión vigente estará disponible en nuestros sitios web."
  ],
  [
    "15. Contacto",
    "Para consultas relacionadas con estos Términos y Condiciones, puede comunicarse con nosotros a través de:"
  ]
];

export default function LegalPage() {
  return <><LandingHeader logoClassName="h-6 w-auto" /><main lang="es" className="mx-auto max-w-3xl px-6 py-12 md:py-16 space-y-8">
    <a href="/contacto-b" className="text-sm underline text-ink-muted">Volver a FOCUS Hub Performance</a>
    <header><h1 className="text-3xl md:text-4xl font-semibold text-ink">Términos y Condiciones del Sitio Web</h1><p className="mt-2 text-ink-muted">FOCUS Hub LLC</p></header>
    {sections.map(([heading,...paragraphs])=><section key={heading} className="space-y-3"><h2 className="text-lg font-semibold text-ink">{heading}</h2>{paragraphs.map(p=>p.startsWith("- ")?<ul key={p} className="list-disc pl-6 space-y-1 text-sm leading-relaxed text-ink-muted">{p.split("\n").map(line=><li key={line}>{line.slice(2)}</li>)}</ul>:<p key={p} className="text-sm leading-relaxed text-ink-muted">{p}</p>)}</section>)}
    <address className="not-italic text-sm leading-relaxed text-ink-muted">FOCUS Hub LLC<br/>Correo electrónico: <a href="mailto:support@focushub.one" className="underline">support@focushub.one</a><br/>Teléfono: <a href="tel:+17874177570" className="underline">+1 (787) 417-7570</a><br/>Sitio web: <a href="/" className="underline">www.focushub.one</a></address>
    <footer className="border-t border-silver-200 pt-5 text-xs text-ink-muted">© {new Date().getFullYear()} FOCUS Hub LLC. Todos los derechos reservados.</footer>
  </main></>;
}
