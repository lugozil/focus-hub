export type Lang = "es" | "en";

export type ServiceIcon =
  | "mercadeo"
  | "publicidad"
  | "redes"
  | "email"
  | "seo";

export type MethodIcon = "audit" | "design" | "launch";

export type Dict = {
  nav: { services: string; methodology: string; faq: string; cta: string };
  hero: { headline: string; sub: string; cta: string };
  intro: {
    eyebrow: string;
    segments: { text: string; em?: boolean }[];
  };
  services: {
    eyebrow: string;
    title: string;
    sub: string;
    items: {
      icon: ServiceIcon;
      title: string;
      description: string;
    }[];
  };
  methodology: {
    eyebrow: string;
    title: string;
    sub: string;
    phases: {
      n: string;
      icon: MethodIcon;
      title: string;
      description: string;
    }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
  };
  cta: { title: string; sub: string; button: string };
  footer: {
    tagline: string;
    servicesLabel: string;
    legalLabel: string;
    contactLabel: string;
    privacy: string;
    terms: string;
    rights: string;
  };
};

export const dict: Record<Lang, Dict> = {
  es: {
    nav: {
      services: "Servicios",
      methodology: "Metodología",
      faq: "Preguntas",
      cta: "Agenda una llamada",
    },
    hero: {
      headline:
        "Sistemas de marketing y crecimiento construidos para tu dealership.",
      sub: "Estrategia, ejecución y tecnología que convierten inventario en ventas. Diseñamos la operación; tu equipo cierra los negocios.",
      cta: "Agenda una llamada",
    },
    intro: {
      eyebrow: "Introducción",
      segments: [
        { text: "FOCUS Hub es una " },
        { text: "firma de marketing", em: true },
        { text: " especializada en concesionarios. Diseñamos y operamos los " },
        { text: "sistemas comerciales", em: true },
        { text: " que llenan tu sala de ventas — " },
        { text: "estrategia, medios y tecnología", em: true },
        { text: " trabajando como una sola pieza." },
      ],
    },
    services: {
      eyebrow: "Servicios",
      title: "Especialidades",
      sub: "Sistemas de principio a fin que generan demanda, califican leads y escalan operaciones.",
      items: [
        {
          icon: "mercadeo",
          title: "Mercadeo Estratégico",
          description:
            "Plan de crecimiento con objetivos comerciales claros, segmentación, propuesta de valor y calendario de ejecución con KPIs medibles.",
        },
        {
          icon: "publicidad",
          title: "Publicidad Digital Multicanal",
          description:
            "Campañas multicanal en Meta, Google y TikTok con configuración técnica, monitoreo continuo y optimización por resultado.",
        },
        {
          icon: "redes",
          title: "Gestión de Redes",
          description:
            "Contenido, comunidad y estrategia editorial para las redes sociales de tu concesionario. Presencia activa que genera confianza y tráfico.",
        },
        {
          icon: "email",
          title: "Email & SMS Marketing",
          description:
            "Secuencias automatizadas de email y SMS para nutrir leads, reactivar clientes y aumentar el valor de cada contacto en tu base de datos.",
        },
        {
          icon: "seo",
          title: "SEO",
          description:
            "Posicionamiento orgánico para que tu concesionario aparezca primero cuando alguien busca tu inventario o servicios en Google.",
        },
      ],
    },
    methodology: {
      eyebrow: "Cómo operamos",
      title: "Simple. Escalable.",
      sub: "Tres fases. Un resultado.",
      phases: [
        {
          n: "01",
          icon: "audit",
          title: "Auditoría Estratégica",
          description:
            "Levantamos un diagnóstico completo del negocio: dónde se está dejando dinero en la mesa, qué canales rinden y dónde se concentran las oportunidades de mayor impacto.",
        },
        {
          n: "02",
          icon: "design",
          title: "Diseño y Arquitectura",
          description:
            "Construimos el plan de marketing y la arquitectura de campañas a partir del diagnóstico. Mensajes, segmentos, KPIs y calendario quedan definidos antes de gastar un dólar en medios.",
        },
        {
          n: "03",
          icon: "launch",
          title: "Despliegue",
          description:
            "Lanzamos con seguimiento diario. Medimos en tiempo real, optimizamos por datos y dejamos la operación corriendo de forma estable mes a mes.",
        },
      ],
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      title: "Lo que suelen preguntarnos antes de empezar.",
      items: [
        {
          q: "¿Solo trabajan con concesionarios automotrices?",
          a: "Es nuestra especialidad y donde más valor entregamos. Trabajamos con dealerships de distintos tamaños y, en ciertos casos, con sectores adyacentes al rubro automotriz.",
        },
        {
          q: "¿Cuánto tarda en verse resultados?",
          a: "Las primeras señales aparecen en las primeras 4 a 6 semanas. La consistencia y el efecto compuesto se notan a partir del tercer mes de ejecución.",
        },
        {
          q: "¿Qué necesitan de mi equipo para empezar?",
          a: "Acceso a las cuentas existentes, una conversación inicial con la dirección y un punto de contacto interno para validar materiales. El resto lo manejamos nosotros.",
        },
        {
          q: "¿Tienen contratos de permanencia?",
          a: "Trabajamos por ciclos cortos al inicio para validar el ajuste. Las renovaciones se discuten cuando los resultados las justifican, no antes.",
        },
        {
          q: "¿Cómo se reportan los resultados?",
          a: "Reportes mensuales con KPIs reales del negocio: leads cualificados, costo por lead, citas y ventas atribuidas. Sin métricas de vanidad.",
        },
      ],
    },
    cta: {
      title: "¿Listo para mover tu dealership al siguiente nivel?",
      sub: "Agenda una llamada de 30 minutos. Sin compromiso, sin pitch genérico.",
      button: "Agenda una llamada",
    },
    footer: {
      tagline: "Marketing, producción y tecnología para concesionarios.",
      servicesLabel: "Servicios",
      legalLabel: "Legal",
      contactLabel: "Contacto",
      privacy: "Política de privacidad",
      terms: "Términos de servicio",
      rights: "Todos los derechos reservados.",
    },
  },
  en: {
    nav: {
      services: "Services",
      methodology: "Methodology",
      faq: "FAQ",
      cta: "Book a call",
    },
    hero: {
      headline: "Marketing and growth systems built for your dealership.",
      sub: "Strategy, execution and technology that turn inventory into sales. We design the operation; your team closes the deals.",
      cta: "Book a call",
    },
    intro: {
      eyebrow: "Introduction",
      segments: [
        { text: "FOCUS Hub is a " },
        { text: "marketing firm", em: true },
        { text: " specialized in dealerships. We design and operate the " },
        { text: "commercial systems", em: true },
        { text: " that fill your showroom — " },
        { text: "strategy, media and technology", em: true },
        { text: " working as a single piece." },
      ],
    },
    services: {
      eyebrow: "Services",
      title: "Specialties",
      sub: "End-to-end systems that generate demand, qualify leads and scale operations.",
      items: [
        {
          icon: "mercadeo",
          title: "Strategic Marketing",
          description:
            "Growth plan with clear commercial objectives, segmentation, value proposition and an execution calendar with measurable KPIs.",
        },
        {
          icon: "publicidad",
          title: "Multichannel Digital Advertising",
          description:
            "Multichannel campaigns on Meta, Google and TikTok with technical setup, continuous monitoring and result-driven optimization.",
        },
        {
          icon: "redes",
          title: "Social Media Management",
          description:
            "Content, community and editorial strategy for your dealership's social channels. Active presence that builds trust and drives traffic.",
        },
        {
          icon: "email",
          title: "Email & SMS Marketing",
          description:
            "Automated email and SMS sequences to nurture leads, reactivate customers and increase the value of every contact in your database.",
        },
        {
          icon: "seo",
          title: "SEO",
          description:
            "Organic positioning so your dealership ranks first when someone searches for your inventory or services on Google.",
        },
      ],
    },
    methodology: {
      eyebrow: "How we operate",
      title: "Simple. Scalable.",
      sub: "Three phases. One outcome.",
      phases: [
        {
          n: "01",
          icon: "audit",
          title: "Strategic Audit",
          description:
            "We map the business end-to-end: where revenue is being left on the table, which channels deliver and where the highest-leverage opportunities sit.",
        },
        {
          n: "02",
          icon: "design",
          title: "Design & Architecture",
          description:
            "We build the marketing plan and campaign architecture from the audit. Messages, segments, KPIs and calendar are locked before spending a dollar on media.",
        },
        {
          n: "03",
          icon: "launch",
          title: "Deployment",
          description:
            "We launch with daily monitoring. Measure in real time, optimize by data and leave the operation running steady month after month.",
        },
      ],
    },
    faq: {
      eyebrow: "Frequently asked",
      title: "What teams usually ask us before starting.",
      items: [
        {
          q: "Do you only work with car dealerships?",
          a: "It is our specialty and where we deliver the most value. We work with dealerships of different sizes and, in select cases, with adjacent sectors of the automotive industry.",
        },
        {
          q: "How long until I see results?",
          a: "First signals appear within 4 to 6 weeks. Consistency and compounding effects show up from the third month onward.",
        },
        {
          q: "What do you need from my team to start?",
          a: "Access to existing accounts, an initial conversation with leadership and an internal point of contact for approvals. We handle the rest.",
        },
        {
          q: "Do you require long-term contracts?",
          a: "We work in short cycles at first to validate the fit. Renewals are discussed when the results justify them, not before.",
        },
        {
          q: "How are results reported?",
          a: "Monthly reports with real business KPIs: qualified leads, cost per lead, appointments and attributed sales. No vanity metrics.",
        },
      ],
    },
    cta: {
      title: "Ready to take your dealership to the next level?",
      sub: "Book a 30-minute call. No commitment, no generic pitch.",
      button: "Book a call",
    },
    footer: {
      tagline: "Marketing, production and technology for dealerships.",
      servicesLabel: "Services",
      legalLabel: "Legal",
      contactLabel: "Contact",
      privacy: "Privacy policy",
      terms: "Terms of service",
      rights: "All rights reserved.",
    },
  },
};
