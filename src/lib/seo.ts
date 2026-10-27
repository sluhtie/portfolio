/**
 * Everything that ends up in <head> per route: title, description, canonical,
 * hreflang alternates, Open Graph / Twitter cards and JSON-LD.
 *
 * Used twice: at build time by scripts/prerender.mjs (serialised into each
 * prerendered HTML file) and in the browser when the language is toggled.
 */
import { translations, type Locale } from "../i18n/translations";
import { legal, profile, services } from "../i18n/content";
import { pathFor, type PageId, type Route } from "./route";

export const SITE_URL = "https://www.cwcodes.de";
const OG_IMAGE: Record<Locale, string> = {
  de: `${SITE_URL}/og-image.jpg`,
  en: `${SITE_URL}/og-image-en.jpg`,
};
const TWITTER = "@_sluhtie";

const LEGAL_META: Record<"imprint" | "privacy", Record<Locale, { title: string; description: string }>> = {
  imprint: {
    de: {
      title: "Impressum | CWCODES – Connor Welge",
      description:
        "Impressum von CWCODES – Connor Welge, Webdesign & Webentwicklung aus Hamburg. Angaben gemäß § 5 DDG, Kontakt und Verantwortlicher.",
    },
    en: {
      title: "Imprint | CWCODES – Connor Welge",
      description:
        "Legal notice (Impressum) for CWCODES – Connor Welge, web design & development from Hamburg. Provider details and contact.",
    },
  },
  privacy: {
    de: {
      title: "Datenschutzerklärung | CWCODES – Connor Welge",
      description:
        "Datenschutzerklärung von CWCODES: welche Daten beim Besuch von cwcodes.de verarbeitet werden – Hosting, Analytics ohne Cookies, Kontaktformular.",
    },
    en: {
      title: "Privacy Policy | CWCODES – Connor Welge",
      description:
        "Privacy policy for CWCODES: what data is processed when you visit cwcodes.de – hosting, cookieless analytics and the contact form.",
    },
  },
};

const OG_ALT: Record<Locale, string> = {
  de: "CWCODES – Connor Welge, Webdesigner & Webentwickler aus Hamburg",
  en: "CWCODES – Connor Welge, web designer & developer in Hamburg",
};

export type Head = {
  lang: Locale;
  title: string;
  description: string;
  canonical: string;
  robots: string;
  /** hreflang → absolute URL (includes x-default) */
  alternates: { hreflang: string; href: string }[];
  ogLocale: string;
  ogLocaleAlt: string;
  ogType: string;
  jsonLd: object;
};

const abs = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;

export function headFor({ page, locale }: Route): Head {
  const other: Locale = locale === "de" ? "en" : "de";
  const meta =
    page === "home"
      ? translations[locale].meta
      : page === "notFound"
        ? translations[locale].notFound.meta
        : LEGAL_META[page][locale];

  const indexable = page !== "notFound";
  const alternates = indexable
    ? [
        { hreflang: "de", href: abs(pathFor(page, "de")) },
        { hreflang: "en", href: abs(pathFor(page, "en")) },
        { hreflang: "x-default", href: abs(pathFor(page, "de")) },
      ]
    : [];

  return {
    lang: locale,
    title: meta.title,
    description: meta.description,
    canonical: abs(pathFor(page, locale)),
    robots: indexable
      ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      : "noindex, follow",
    alternates,
    ogLocale: locale === "de" ? "de_DE" : "en_US",
    ogLocaleAlt: other === "de" ? "de_DE" : "en_US",
    ogType: page === "home" ? "website" : "article",
    jsonLd: jsonLd(page, locale, meta),
  };
}

function jsonLd(page: PageId, locale: Locale, meta: { title: string; description: string }) {
  const url = abs(pathFor(page, locale));
  const address = {
    "@type": "PostalAddress",
    streetAddress: legal.street,
    postalCode: legal.postalCode,
    addressLocality: legal.city,
    addressRegion: "Hamburg",
    addressCountry: "DE",
  };
  const sameAs = profile.socials.map((s) => s.href);

  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#connor`,
    name: profile.name,
    alternateName: profile.brand,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/icon-512.png`,
    jobTitle: locale === "de" ? "Webdesigner & Webentwickler" : "Web Designer & Developer",
    email: `mailto:${profile.email}`,
    worksFor: { "@id": `${SITE_URL}/#business` },
    address: { "@type": "PostalAddress", addressLocality: legal.city, addressCountry: "DE" },
    knowsAbout: [
      "Webdesign",
      "Webentwicklung",
      "Web Development",
      "Next.js",
      "React",
      "TypeScript",
      "UI/UX Design",
      "Technical SEO",
      "Web Performance",
    ],
    sameAs,
  };

  const business = {
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name: `${profile.brand} – ${profile.name}`,
    alternateName: profile.brand,
    description: translations.de.meta.description,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icon-512.png`,
    image: OG_IMAGE.de,
    email: profile.email,
    telephone: profile.phone.replace(/\s+/g, ""),
    founder: { "@id": `${SITE_URL}/#connor` },
    address,
    geo: { "@type": "GeoCoordinates", latitude: 53.5511, longitude: 9.9937 },
    areaServed: [
      { "@type": "City", name: "Hamburg" },
      { "@type": "Country", name: "Deutschland" },
    ],
    knowsLanguage: ["de", "en"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: locale === "de" ? "Leistungen" : "Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title[locale], description: s.body[locale] },
      })),
    },
    sameAs,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: profile.brand,
    alternateName: `${profile.brand} – ${profile.name}`,
    url: `${SITE_URL}/`,
    inLanguage: ["de-DE", "en-US"],
    publisher: { "@id": `${SITE_URL}/#business` },
  };

  const webpage = {
    "@type": page === "home" ? ["WebPage", "ProfilePage"] : "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: meta.title,
    description: meta.description,
    inLanguage: locale === "de" ? "de-DE" : "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#business` },
    ...(page === "home"
      ? { mainEntity: { "@id": `${SITE_URL}/#connor` }, primaryImageOfPage: { "@type": "ImageObject", url: OG_IMAGE[locale], width: 1200, height: 630 } }
      : {}),
  };

  return { "@context": "https://schema.org", "@graph": [webpage, website, business, person] };
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Serialised <head> tags for the prerendered HTML. */
export function renderHead(h: Head): string {
  const tags = [
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}" />`,
    `<meta name="robots" content="${h.robots}" />`,
    `<link rel="canonical" href="${h.canonical}" />`,
    ...h.alternates.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`),
    `<meta property="og:type" content="${h.ogType}" />`,
    `<meta property="og:site_name" content="${profile.brand}" />`,
    `<meta property="og:url" content="${h.canonical}" />`,
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    `<meta property="og:image" content="${OG_IMAGE[h.lang]}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(OG_ALT[h.lang])}" />`,
    `<meta property="og:locale" content="${h.ogLocale}" />`,
    `<meta property="og:locale:alternate" content="${h.ogLocaleAlt}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="${TWITTER}" />`,
    `<meta name="twitter:creator" content="${TWITTER}" />`,
    `<meta name="twitter:title" content="${esc(h.title)}" />`,
    `<meta name="twitter:description" content="${esc(h.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE[h.lang]}" />`,
    `<meta name="twitter:image:alt" content="${esc(OG_ALT[h.lang])}" />`,
    `<script type="application/ld+json">${JSON.stringify(h.jsonLd).replace(/</g, "\\u003c")}</script>`,
  ];
  return tags.join("\n    ");
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Browser side: bring <head> in line with the current route (language toggle, dev). */
export function applyHead(h: Head) {
  document.documentElement.lang = h.lang;
  document.title = h.title;
  setMeta("name", "description", h.description);
  setMeta("name", "robots", h.robots);
  setMeta("property", "og:url", h.canonical);
  setMeta("property", "og:title", h.title);
  setMeta("property", "og:description", h.description);
  setMeta("property", "og:locale", h.ogLocale);
  setMeta("property", "og:locale:alternate", h.ogLocaleAlt);
  setMeta("property", "og:image", OG_IMAGE[h.lang]);
  setMeta("property", "og:image:alt", OG_ALT[h.lang]);
  setMeta("name", "twitter:title", h.title);
  setMeta("name", "twitter:description", h.description);
  setMeta("name", "twitter:image", OG_IMAGE[h.lang]);
  setMeta("name", "twitter:image:alt", OG_ALT[h.lang]);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = h.canonical;
}
