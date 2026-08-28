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
    title: { en: "Website Development", de: "Website-Entwicklung" },
    body: {
      en: "I build custom websites, usually with Next.js, React and TypeScript. From the layout to the features your project needs, I turn the concept into a working website that fits phones, tablets and desktops.",
      de: "Ich entwickle individuelle Websites, in der Regel mit Next.js, React und TypeScript. Vom Layout bis zu den Funktionen, die dein Projekt braucht: Aus dem Konzept wird eine Website, die auf Smartphone, Tablet und Desktop passt.",
    },
    skills: ["Next.js", "React", "TypeScript", "Responsive Design"],
  },
  {
    num: "02",
    title: { en: "Deployment & Operations", de: "Deployment & Betrieb" },
    body: {
      en: "If you want me to handle the technical side, I take care of deployment, hosting, your domain, HTTPS and secure configuration. You have one point of contact for both development and operations.",
      de: "Auf Wunsch kümmere ich mich auch um die Technik hinter deiner Website: Deployment, Hosting, Domain, HTTPS und eine sichere Konfiguration. So hast du für Entwicklung und Betrieb einen Ansprechpartner.",
    },
    skills: ["DevOps", "Deployment", "Hosting", "Domains & DNS", "HTTPS"],
  },
  {
    num: "03",
    title: { en: "UI/UX & Concepts", de: "UI/UX & Konzept" },
    body: {
      en: "Where useful, I sketch the structure and visual direction in Figma. Together, we work out how the website should look and feel to use. UI/UX supports my main focus: development.",
      de: "Bei Bedarf skizziere ich Aufbau und Gestaltung in Figma. Gemeinsam stimmen wir ab, wie die Website aussehen und sich bedienen lassen soll. UI/UX ergänzt dabei meinen Schwerpunkt: die Entwicklung.",
    },
    skills: ["Figma", "Wireframes", "Prototyping", "UI/UX"],
  },
  {
    num: "04",
    title: { en: "Performance & Care", de: "Performance & Pflege" },
    body: {
      en: "I improve loading times and technical SEO to help your website load quickly and make it easier for search engines to understand. After launch, I can handle updates, security fixes, troubleshooting and further improvements, as agreed.",
      de: "Ich optimiere Ladezeiten und technisches SEO, damit deine Website schnell lädt und von Suchmaschinen besser erfasst werden kann. Nach dem Launch übernehme ich nach Absprache Updates, Sicherheitsaktualisierungen, Fehlerbehebung und Weiterentwicklung.",
    },
    skills: ["SEO", "Core Web Vitals", "Updates", "Maintenance"],
  },
];

export const processSteps = [
  {
    num: "01",
    title: { en: "Goals & Requirements", de: "Ziele & Wünsche" },
    body: {
      en: "You tell me what you have in mind and what the website needs to do. We discuss content, features and any existing examples, then agree on the scope and priorities.",
      de: "Du erzählst mir, was du dir vorstellst und was die Website können soll. Wir besprechen Inhalte, Funktionen und vorhandene Beispiele und stimmen gemeinsam Umfang und Prioritäten ab.",
    },
  },
  {
    num: "02",
    title: { en: "Concept & First Draft", de: "Konzept & Entwurf" },
    body: {
      en: "I put together an initial concept or sketch, using Figma where it helps. You see how the website could look and give feedback on the structure and design before we develop it further.",
      de: "Ich erstelle ein erstes Konzept oder eine Skizze, bei Bedarf in Figma. Du siehst, wie die Website aussehen könnte, und gibst Feedback zu Aufbau und Gestaltung, bevor wir sie weiter ausarbeiten.",
    },
  },
  {
    num: "03",
    title: { en: "Build & Feedback", de: "Umsetzung & Feedback" },
    body: {
      en: "I build the website, usually with Next.js, and share previews along the way. You try it out, tell me what works and what needs adjusting, and we refine it together until the result fits the agreed goals.",
      de: "Ich setze die Website meist mit Next.js um und zeige dir Zwischenstände. Du probierst sie aus und sagst, was passt und was noch geändert werden soll. Gemeinsam verfeinern wir das Ergebnis, bis es zu den vereinbarten Zielen passt.",
    },
  },
  {
    num: "04",
    title: { en: "SEO & Final Checks", de: "SEO & Feinschliff" },
    body: {
      en: "Once the content and design are agreed, I refine technical SEO and loading performance. I also check the layout on different screen sizes and test the main features before delivery.",
      de: "Wenn Inhalt und Gestaltung stehen, optimiere ich technisches SEO und Ladezeiten. Außerdem prüfe ich die Darstellung auf verschiedenen Bildschirmgrößen und teste die wichtigen Funktionen vor der Übergabe.",
    },
  },
  {
    num: "05",
    title: { en: "Launch or Handover", de: "Onlinegang oder Übergabe" },
    body: {
      en: "You choose: I can handle deployment, your domain and the setup for running the website, or hand over the code and setup notes so you can manage it yourself. Ongoing maintenance and support are available by agreement.",
      de: "Du entscheidest: Ich übernehme Deployment, Domain und die Einrichtung für den Betrieb – oder du erhältst den Code samt Hinweisen und kümmerst dich selbst darum. Wartung und weitere Betreuung sind nach Absprache möglich.",
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
  "Next.js",
  "Web Development",
  "Deployment",
  "Domains & Hosting",
  "UI / UX",
  "SEO",
  "Performance",
  "Maintenance",
];
