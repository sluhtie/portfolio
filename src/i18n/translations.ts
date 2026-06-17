/**
 * UI copy. Structured arrays (projects, services, …) live in content.ts.
 */
export type Locale = "en" | "de";

export const translations = {
  en: {
    nav: {
      work: "Work",
      about: "About",
      services: "Services",
      contact: "Contact",
      cta: "Let's talk",
    },
    preloader: {
      tagline: "Creative Developer & Designer",
    },
    hero: {
      eyebrow: "Creative Developer & Designer",
      lineOne: "Designing",
      lineTwo: "digital",
      lineThree: "experiences",
      intro:
        "I craft immersive, high-end websites where every pixel moves with purpose. Part developer, part designer, fully obsessed with the details.",
      scroll: "Scroll to explore",
      basedIn: "Based in Hamburg",
    },
    about: {
      eyebrow: "About",
      heading:
        "I help ambitious brands stand out with websites that feel less like pages and more like experiences.",
      body: "Based in Hamburg, I build modern, high-end websites and digital products for businesses and brands. My path runs from tinkering on game servers to React, TypeScript and AI-assisted workflows — and that same obsession with detail goes into everything I ship.",
      cta: "More about me",
    },
    services: {
      eyebrow: "What I do",
      heading: "Services",
      subheading: "End-to-end, from the first sketch to the final deploy.",
    },
    work: {
      eyebrow: "Selected work",
      heading: "Recent projects",
      subheading: "A few things I'm proud of. Hover to take a look.",
      view: "View project",
      all: "See all projects",
    },
    process: {
      eyebrow: "How we'll work",
      heading: "The process",
      subheading: "Clear, collaborative and built for results.",
    },
    testimonials: {
      eyebrow: "Kind words",
      heading: "What clients say",
    },
    contact: {
      eyebrow: "Contact",
      heading: "Let's build something",
      headingAccent: "unforgettable",
      body: "Have a project in mind, or just want to say hi? My inbox is always open.",
      cta: "Start a project",
      emailLabel: "Email",
      socialsLabel: "Socials",
      form: {
        name: "Name",
        namePlaceholder: "Your name",
        email: "Email",
        emailPlaceholder: "you@email.com",
        subject: "Subject",
        subjectPlaceholder: "What's it about?",
        message: "Message",
        messagePlaceholder: "Tell me a little about your project…",
        submit: "Send message",
        sending: "Sending…",
        successTitle: "Message sent — thank you!",
        successBody: "I'll get back to you within 1–2 working days.",
        errorTitle: "Hmm, that didn't go through.",
        errorBody: "Please try again, or email me directly at",
        errRequired: "This field is required.",
        errEmail: "Please enter a valid email address.",
        errMessage: "Please add a short message.",
      },
    },
    footer: {
      tagline: "Creative Developer & Designer crafting immersive digital experiences.",
      localTime: "Local time",
      navTitle: "Menu",
      connectTitle: "Connect",
      backToTop: "Back to top",
      rights: "All rights reserved.",
      built: "Designed & built with care.",
    },
    lang: { switchTo: "DE", label: "Language" },
  },

  de: {
    nav: {
      work: "Arbeiten",
      about: "Über mich",
      services: "Leistungen",
      contact: "Kontakt",
      cta: "Schreib mir",
    },
    preloader: {
      tagline: "Creative Developer & Designer",
    },
    hero: {
      eyebrow: "Creative Developer & Designer",
      lineOne: "Digitale",
      lineTwo: "Erlebnisse",
      lineThree: "gestalten",
      intro:
        "Ich gestalte immersive, hochwertige Websites, bei denen sich jeder Pixel mit Absicht bewegt. Halb Entwickler, halb Designer, voll besessen von Details.",
      scroll: "Scrollen zum Entdecken",
      basedIn: "Ansässig in Hamburg",
    },
    about: {
      eyebrow: "Über mich",
      heading:
        "Ich helfe ambitionierten Marken, sich abzuheben — mit Websites, die sich weniger wie Seiten und mehr wie Erlebnisse anfühlen.",
      body: "Aus Hamburg baue ich moderne, hochwertige Websites und digitale Produkte für Unternehmen und Marken. Mein Weg führt vom Basteln an Game-Servern zu React, TypeScript und KI-gestützten Workflows — und genau diese Detailverliebtheit steckt in allem, was ich abliefere.",
      cta: "Mehr über mich",
    },
    services: {
      eyebrow: "Was ich mache",
      heading: "Leistungen",
      subheading: "End-to-end, von der ersten Skizze bis zum finalen Deploy.",
    },
    work: {
      eyebrow: "Ausgewählte Arbeiten",
      heading: "Aktuelle Projekte",
      subheading: "Ein paar Dinge, auf die ich stolz bin. Hover für einen Blick.",
      view: "Projekt ansehen",
      all: "Alle Projekte",
    },
    process: {
      eyebrow: "Wie wir arbeiten",
      heading: "Der Prozess",
      subheading: "Klar, kollaborativ und auf Ergebnisse ausgelegt.",
    },
    testimonials: {
      eyebrow: "Nette Worte",
      heading: "Was Kunden sagen",
    },
    contact: {
      eyebrow: "Kontakt",
      heading: "Lass uns etwas",
      headingAccent: "Unvergessliches bauen",
      body: "Du hast ein Projekt im Kopf oder willst einfach Hallo sagen? Mein Postfach ist immer offen.",
      cta: "Projekt starten",
      emailLabel: "E-Mail",
      socialsLabel: "Social Media",
      form: {
        name: "Name",
        namePlaceholder: "Dein Name",
        email: "E-Mail",
        emailPlaceholder: "du@email.de",
        subject: "Betreff",
        subjectPlaceholder: "Worum geht's?",
        message: "Nachricht",
        messagePlaceholder: "Erzähl mir kurz von deinem Projekt…",
        submit: "Nachricht senden",
        sending: "Wird gesendet…",
        successTitle: "Nachricht gesendet — danke!",
        successBody: "Ich melde mich innerhalb von 1–2 Werktagen bei dir.",
        errorTitle: "Hmm, das hat nicht geklappt.",
        errorBody: "Bitte versuch es erneut oder schreib mir direkt an",
        errRequired: "Dieses Feld ist erforderlich.",
        errEmail: "Bitte gib eine gültige E-Mail-Adresse an.",
        errMessage: "Bitte füge eine kurze Nachricht hinzu.",
      },
    },
    footer: {
      tagline: "Creative Developer & Designer für immersive digitale Erlebnisse.",
      localTime: "Ortszeit",
      navTitle: "Menü",
      connectTitle: "Connect",
      backToTop: "Nach oben",
      rights: "Alle Rechte vorbehalten.",
      built: "Mit Sorgfalt gestaltet & gebaut.",
    },
    lang: { switchTo: "EN", label: "Sprache" },
  },
};

export type Dictionary = (typeof translations)["en"];
