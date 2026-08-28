/**
 * ============================================================
 *  CONTENT — edit everything here.
 *  Each field that differs per language is { en, de }.
 *  Swap in your real name, projects, links and you're done.
 * ============================================================
 */

export const profile = {
  name: "Connor Welge",
  brand: "CWCODES",
  role: { en: "Creative Developer & Designer", de: "Creative Developer & Designer" },
  email: "connor@cwcodes.de",
  location: { en: "Hamburg, Germany", de: "Hamburg, Deutschland" },
  timezone: "Europe/Berlin",
  available: { en: "Available for projects", de: "Verfügbar für Projekte" },
  socials: [
    { label: "GitHub", href: "https://github.com/sluhtie" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/connor-welge-3a211b3b6/" },
    { label: "Instagram", href: "https://instagram.com/connorhmb_" },
    { label: "X", href: "https://x.com/_sluhtie" },
  ],
};

export type Project = {
  id: string;
  index: string;
  title: string;
  status: "live" | "inProgress";
  category: { en: string; de: string };
  description: { en: string; de: string };
  tags: string[];
  accent: string;
  url: string;
  /** Website screenshot in /public/projects/. Empty string → gradient fallback. */
  image: string;
};

export const projects: Project[] = [
  {
    id: "orbt",
    index: "01",
    title: "Orbt",
    status: "live",
    category: { en: "Discord Bot & Dashboard", de: "Discord-Bot & Dashboard" },
    description: {
      en: "A versatile Discord bot with a modern web dashboard. Orbt brings the features of many individual bots together in one system — without compromising on quality.",
      de: "Ein vielseitiger Discord-Bot mit modernem Web-Dashboard. Orbt bündelt die Funktionen vieler einzelner Bots in einem System — ohne Abstriche bei der Qualität.",
    },
    tags: ["Next.js", "TypeScript", "Tailwind"],
    accent: "#ccff00",
    url: "https://orbt.gg",
    image: "/projects/orbt.webp",
  },
  {
    id: "ihreferien",
    index: "02",
    title: "Inselteam Usedom",
    status: "live",
    category: { en: "Hospitality & Booking", de: "Hospitality & Buchung" },
    description: {
      en: "A direct-booking site for a family-run holiday-rental business on the Baltic island of Usedom — warm, trustworthy and built to convert. Book your stay like among friends.",
      de: "Eine Direktbuchungs-Seite für ein familiengeführtes Ferienwohnungs-Unternehmen auf der Ostseeinsel Usedom — warm, vertrauenswürdig und auf Conversion gebaut. Urlaub buchen wie unter Freunden.",
    },
    tags: ["Web Design", "Booking", "SEO"],
    accent: "#00e0c6",
    url: "https://ihreferien.de",
    image: "/projects/ihreferien.webp",
  },
  {
    id: "beeograph",
    index: "03",
    title: "Beeograph",
    status: "live",
    category: { en: "Creator SaaS", de: "Creator-SaaS" },
    description: {
      en: "A link-in-bio alternative done right: live-updating creator profiles with real integrations, a drag-and-drop editor and analytics — entirely you, no template.",
      de: "Die Link-in-Bio-Alternative, richtig gemacht: live aktualisierte Creator-Profile mit echten Integrationen, Drag-&-Drop-Editor und Analytics — ganz du, kein Template.",
    },
    tags: ["Next.js", "TypeScript", "SaaS"],
    accent: "#7c5cff",
    url: "https://beeograph.com",
    image: "/projects/beeograph.webp",
  },
  {
    id: "rosenberger",
    index: "04",
    title: "Rosenberger Event",
    status: "live",
    category: { en: "Brand & Website", de: "Brand & Website" },
    description: {
      en: "A premium brand site for a Hamburg event-staffing agency — confident typography and calm motion that put the people behind the service front and centre.",
      de: "Eine Premium-Markenseite für eine Hamburger Event-Personalagentur — selbstbewusste Typografie und ruhige Motion, die den Menschen hinter der Dienstleistung in den Mittelpunkt stellen.",
    },
    tags: ["Next.js", "Branding", "Web Design"],
    accent: "#ff5d8f",
    url: "https://rosenberger-event.de/",
    image: "/projects/rosenberger.webp",
  },
  {
    id: "strassburger-pflegedienst",
    index: "05",
    title: "Strassburger Pflegedienst",
    status: "inProgress",
    category: { en: "Healthcare & Website", de: "Pflege & Website" },
    description: {
      en: "A clear, welcoming website for a home care provider in Hamburg-Dulsberg — with easy-to-understand information about care services, the team and how to get in touch.",
      de: "Eine übersichtliche Website für den ambulanten Pflegedienst aus Hamburg-Dulsberg — mit verständlichen Informationen zu Pflegeleistungen, Team und Kontakt.",
    },
    tags: ["Web Design", "Healthcare", "Responsive"],
    accent: "#7da5df",
    url: "https://strassburger-pflegedienst.cwcodes.de/",
    image: "/projects/strassburger-pflegedienst.webp",
  },
];

export const services = [
  {
    num: "01",
    title: { en: "Creative Development", de: "Creative Development" },
    body: {
      en: "I build fast, accessible front-ends with motion baked in — React, TypeScript, WebGL. The kind of site that makes people scroll twice.",
      de: "Ich baue schnelle, barrierefreie Frontends mit Motion im Kern — React, TypeScript, WebGL. Die Art Website, bei der man zweimal scrollt.",
    },
    skills: ["React / Next.js", "TypeScript", "GSAP / Framer Motion", "WebGL / Shaders"],
  },
  {
    num: "02",
    title: { en: "UI / UX Design", de: "UI / UX Design" },
    body: {
      en: "From wireframe to pixel-perfect interface. Design systems, prototypes and interactions that feel inevitable.",
      de: "Vom Wireframe zum pixelgenauen Interface. Designsysteme, Prototypen und Interaktionen, die sich selbstverständlich anfühlen.",
    },
    skills: ["Figma", "Design Systems", "Prototyping", "Interaction Design"],
  },
  {
    num: "03",
    title: { en: "Brand & Art Direction", de: "Brand & Art Direction" },
    body: {
      en: "Identity that lives on screen. Type, color, motion language and a visual voice that scales across every touchpoint.",
      de: "Identität, die auf dem Bildschirm lebt. Typo, Farbe, Motion-Sprache und eine visuelle Stimme, die über jeden Touchpoint skaliert.",
    },
    skills: ["Visual Identity", "Motion Language", "Typography", "Art Direction"],
  },
  {
    num: "04",
    title: { en: "Performance & Care", de: "Performance & Pflege" },
    body: {
      en: "Beautiful is only half the job. I ship Core-Web-Vitals-green sites and stick around to keep them sharp.",
      de: "Schön ist nur die halbe Miete. Ich liefere Core-Web-Vitals-grüne Seiten und bleibe dran, damit sie scharf bleiben.",
    },
    skills: ["Core Web Vitals", "SEO", "Accessibility", "Maintenance"],
  },
];

export const processSteps = [
  {
    num: "01",
    title: { en: "Discover", de: "Entdecken" },
    body: {
      en: "We dig into your goals, audience and what makes you different. No template thinking — every project starts blank.",
      de: "Wir tauchen in deine Ziele, Zielgruppe und das ein, was dich besonders macht. Kein Template-Denken — jedes Projekt startet leer.",
    },
  },
  {
    num: "02",
    title: { en: "Design", de: "Design" },
    body: {
      en: "Concepts, art direction and a motion language. You see the vibe early and we shape it together.",
      de: "Konzepte, Art Direction und eine Motion-Sprache. Du siehst den Vibe früh, und wir formen ihn gemeinsam.",
    },
  },
  {
    num: "03",
    title: { en: "Build", de: "Umsetzung" },
    body: {
      en: "Clean, performant code with every interaction crafted by hand. Weekly previews, no surprises.",
      de: "Sauberer, performanter Code mit jeder Interaktion von Hand gebaut. Wöchentliche Previews, keine Überraschungen.",
    },
  },
  {
    num: "04",
    title: { en: "Launch", de: "Launch" },
    body: {
      en: "We ship, measure and refine. Then I make sure it stays fast, secure and yours.",
      de: "Wir gehen live, messen und verfeinern. Danach sorge ich dafür, dass alles schnell, sicher und deins bleibt.",
    },
  },
];

export const stats = [
  { value: 60, suffix: "+", label: { en: "Projects shipped", de: "Projekte gelauncht" } },
  { value: 8, suffix: "", label: { en: "Years of craft", de: "Jahre Erfahrung" } },
  { value: 12, suffix: "", label: { en: "Awards & features", de: "Awards & Features" } },
  { value: 100, suffix: "%", label: { en: "Client return rate", de: "Wiederkehrende Kunden" } },
];

export const testimonials = [
  {
    quote: {
      en: "Connor turned our vague idea into a site that genuinely made our investors gasp. The animations alone closed the round.",
      de: "Connor hat aus unserer vagen Idee eine Seite gemacht, die unsere Investoren wirklich umgehauen hat. Allein die Animationen haben die Runde geschlossen.",
    },
    author: "Sarah Lindqvist",
    company: { en: "CEO, Lumen Studio", de: "CEO, Lumen Studio" },
  },
  {
    quote: {
      en: "Fast, obsessive about detail, and a real partner. Our bounce rate dropped and the brand finally feels premium.",
      de: "Schnell, detailverliebt und ein echter Partner. Unsere Absprungrate sank und die Marke fühlt sich endlich premium an.",
    },
    author: "Daniel Krüger",
    company: { en: "Founder, Atelier Noir", de: "Gründer, Atelier Noir" },
  },
  {
    quote: {
      en: "We've worked with big agencies. None of them shipped something this polished, this fast, with this much care.",
      de: "Wir haben mit großen Agenturen gearbeitet. Keine hat etwas so Poliertes, so Schnelles und mit so viel Sorgfalt geliefert.",
    },
    author: "Mia Hofer",
    company: { en: "Head of Product, Pulse", de: "Head of Product, Pulse" },
  },
];

export const marqueeWords = [
  "Creative Development",
  "UI / UX",
  "WebGL",
  "Motion Design",
  "Brand Identity",
  "Art Direction",
  "Interaction",
  "Performance",
];
