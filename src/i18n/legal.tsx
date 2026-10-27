/**
 * ============================================================
 *  LEGAL — Impressum & Datenschutzerklärung (DE/EN).
 *  Personal details live in `legal` in content.ts. Anything in
 *  [square brackets] there renders as a highlighted placeholder.
 *  Not legal advice — have it checked before relying on it.
 * ============================================================
 */
import type { ReactNode } from "react";
import { legal } from "./content";
import type { Locale } from "./translations";
import type { LegalPageId } from "../lib/route";
import { legalHref } from "../lib/route";

export type LegalSection = { title: string; body: ReactNode };
export type LegalDoc = {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  sections: LegalSection[];
};

/** Renders a value, highlighting any [placeholder] parts. */
export function V({ v }: { v: string }) {
  const parts = v.split(/(\[[^\]]+\])/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[") ? (
          <mark key={i} className="legal-ph" title="Placeholder — fill in content.ts">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

function A({ href, children }: { href: string; children: ReactNode }) {
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      data-cursor
      className="legal-link"
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

const Mail = () => <A href={`mailto:${legal.email}`}>{legal.email}</A>;

function Address({ locale }: { locale: Locale }) {
  return (
    <p>
      {legal.name}
      <br />
      <V v={legal.street} />
      <br />
      <V v={`${legal.postalCode} ${legal.city}`} />
      <br />
      {legal.country[locale]}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  IMPRESSUM                                                          */
/* ------------------------------------------------------------------ */

function imprint(locale: Locale): LegalDoc {
  const de = locale === "de";
  const contact = (
    <p>
      {de ? "E-Mail" : "Email"}: <Mail />
      {legal.phone && (
        <>
          <br />
          {de ? "Telefon" : "Phone"}: <V v={legal.phone} />
        </>
      )}
    </p>
  );

  const sections: LegalSection[] = [
    {
      title: de ? "Angaben gemäß § 5 DDG" : "Information pursuant to § 5 DDG",
      body: (
        <>
          <Address locale={locale} />
          <p className="text-muted">
            {de
              ? "Freiberuflicher Webentwickler & Designer (CWCODES)"
              : "Freelance web developer & designer (CWCODES)"}
          </p>
        </>
      ),
    },
    { title: de ? "Kontakt" : "Contact", body: contact },
  ];

  if (legal.vatId) {
    sections.push({
      title: de ? "Umsatzsteuer-ID" : "VAT ID",
      body: (
        <p>
          {de
            ? "Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: "
            : "VAT identification number pursuant to § 27a of the German VAT Act: "}
          <V v={legal.vatId} />
        </p>
      ),
    });
  }

  sections.push(
    {
      title: de
        ? "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV"
        : "Responsible for content under § 18(2) MStV",
      body: <Address locale={locale} />,
    },
    {
      title: de ? "Verbraucherstreitbeilegung" : "Consumer dispute resolution",
      body: (
        <p>
          {de
            ? "Ich bin nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."
            : "I am neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board."}
        </p>
      ),
    },
    {
      title: de ? "Haftung für Inhalte" : "Liability for content",
      body: (
        <p>
          {de
            ? "Die Inhalte dieser Seite wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann ich jedoch keine Gewähr übernehmen. Als Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich, nach §§ 8 bis 10 DDG jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen. Bei Bekanntwerden von Rechtsverletzungen werde ich entsprechende Inhalte umgehend entfernen."
            : "The content of this site was created with great care, but I cannot guarantee that it is accurate, complete or up to date. As a service provider I am responsible for my own content under § 7(1) DDG, but under §§ 8–10 DDG I am not obliged to monitor third-party information that is transmitted or stored. I will remove any content promptly once I become aware of an infringement."}
        </p>
      ),
    },
    {
      title: de ? "Haftung für Links" : "Liability for links",
      body: (
        <p>
          {de
            ? "Diese Website enthält Links zu externen Websites Dritter (z. B. Kundenprojekte und soziale Netzwerke), auf deren Inhalte ich keinen Einfluss habe. Für diese Inhalte ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar; bei Bekanntwerden von Rechtsverletzungen entferne ich derartige Links umgehend."
            : "This website links to external third-party sites (such as client projects and social networks) whose content I have no control over. The respective provider or operator is always responsible for that content. No infringements were apparent at the time of linking; if I become aware of any, I will remove the link promptly."}
        </p>
      ),
    },
    {
      title: de ? "Urheberrecht" : "Copyright",
      body: (
        <p>
          {de
            ? "Die auf dieser Website erstellten Inhalte, Designs und der Code unterliegen dem deutschen Urheberrecht. Die Rechte an Marken und Inhalten der gezeigten Kundenprojekte liegen bei den jeweiligen Inhabern. Vervielfältigung, Bearbeitung und Verbreitung außerhalb der Grenzen des Urheberrechts bedürfen meiner schriftlichen Zustimmung."
            : "The content, design and code on this website are protected by German copyright law. Rights to the brands and content of the client projects shown remain with their owners. Copying, editing or distributing beyond what copyright law allows requires my written consent."}
        </p>
      ),
    }
  );

  return {
    eyebrow: de ? "Rechtliches" : "Legal",
    title: "Impressum",
    intro: de ? undefined : (
      <p className="text-muted">
        Legal notice required for German websites. The German version is the legally binding one.
      </p>
    ),
    sections,
  };
}

/* ------------------------------------------------------------------ */
/*  DATENSCHUTZERKLÄRUNG                                               */
/* ------------------------------------------------------------------ */

function privacy(locale: Locale): LegalDoc {
  const de = locale === "de";
  const host = legal.host;

  const sections: LegalSection[] = [
    {
      title: de ? "1. Verantwortlicher" : "1. Controller",
      body: (
        <>
          <p>
            {de
              ? "Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:"
              : "The controller responsible for data processing on this website under the General Data Protection Regulation (GDPR) is:"}
          </p>
          <Address locale={locale} />
          <p>
            {de ? "E-Mail" : "Email"}: <Mail />
          </p>
          <p>
            {de
              ? "Weitere Angaben findest du im "
              : "More details are in the "}
            <A href={legalHref.imprint}>Impressum</A>.
          </p>
        </>
      ),
    },
    {
      title: de ? "2. Das Wichtigste in Kürze" : "2. The short version",
      body: (
        <ul>
          {(de
            ? [
                "Ich setze keine Cookies, betreibe kein Tracking über Websites hinweg und schalte keine Werbung.",
                "Die Seite läuft auf meinem eigenen Server in einem Rechenzentrum in der EU.",
                "Für die Besucherstatistik nutze ich ein selbst gehostetes, cookieloses Umami — ohne Weitergabe an Dritte.",
                "Daten aus dem Kontaktformular nutze ich ausschließlich, um deine Anfrage zu beantworten.",
                "Die Schriftarten werden aktuell noch vom Dienst Fontshare geladen (Details unten).",
              ]
            : [
                "I set no cookies, do no cross-site tracking and run no ads.",
                "The site runs on my own server in a data centre in the EU.",
                "For visitor statistics I use a self-hosted, cookieless Umami instance — nothing is shared with third parties.",
                "Data from the contact form is used only to answer your enquiry.",
                "Fonts are currently still loaded from the Fontshare service (details below).",
              ]
          ).map((li) => (
            <li key={li}>{li}</li>
          ))}
        </ul>
      ),
    },
    {
      title: de ? "3. Hosting & Server-Logfiles" : "3. Hosting & server log files",
      body: (
        <>
          <p>
            {de
              ? "Ich betreibe diese Website selbst mit der Open-Source-Software Dokploy auf einer virtuellen Maschine, die ich bei folgendem Anbieter miete:"
              : "I run this website myself using the open-source software Dokploy on a virtual machine rented from:"}
          </p>
          <p>
            {host.name}
            <br />
            <V v={host.address} />
            <br />
            <A href={host.url}>novacloud-hosting.com</A>
          </p>
          <p>
            {de ? "Standort des Servers: " : "Server location: "}
            <V v={host.location[locale]} />.{" "}
            {de
              ? "Der Anbieter verarbeitet die Daten nur in meinem Auftrag und nach meinen Weisungen (Auftragsverarbeitung nach Art. 28 DSGVO). Eine Übermittlung in Drittländer findet nicht statt."
              : "The provider processes data only on my behalf and according to my instructions (processing on behalf under Art. 28 GDPR). No data is transferred to third countries."}
          </p>
          <p>
            {de
              ? "Bei jedem Aufruf der Website speichert der Webserver automatisch Informationen, die dein Browser übermittelt: IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Referrer-URL, Browser und Betriebssystem (User-Agent) sowie HTTP-Statuscode. Das ist technisch notwendig, um die Seite auszuliefern und ihre Sicherheit und Stabilität zu gewährleisten (Art. 6 Abs. 1 lit. f DSGVO). Die Logfiles werden nach spätestens "
              : "On every visit the web server automatically stores information sent by your browser: IP address, date and time, requested page, referrer URL, browser and operating system (user agent) and HTTP status code. This is technically necessary to deliver the site and keep it secure and stable (Art. 6(1)(f) GDPR). Log files are deleted after "}
            <V v={legal.logRetentionDays} />
            {de
              ? " Tagen gelöscht, sofern sie nicht zur Aufklärung eines konkreten Sicherheitsvorfalls benötigt werden."
              : " days at the latest, unless they are needed to investigate a specific security incident."}
          </p>
          <p>
            {de
              ? "Die Verbindung ist per TLS (HTTPS) verschlüsselt."
              : "The connection is encrypted with TLS (HTTPS)."}
          </p>
        </>
      ),
    },
    {
      title: de ? "4. Besucherstatistik mit Umami" : "4. Visitor statistics with Umami",
      body: (
        <>
          <p>
            {de
              ? "Um zu verstehen, welche Inhalte gelesen werden, nutze ich Umami, eine Open-Source-Analysesoftware, die ich selbst unter analytics.cwcodes.de betreibe. Umami setzt keine Cookies und erstellt keine seitenübergreifenden Profile. Erfasst werden aufgerufene Seiten, Referrer, Browser, Betriebssystem, Gerätetyp, Bildschirmgröße, Sprache und das ungefähre Land. Deine IP-Adresse wird nicht gespeichert; sie wird nur kurzzeitig verwendet, um zusammen mit einem täglich wechselnden Zufallswert eine anonyme Sitzungskennung zu bilden. Eine Wiedererkennung über mehrere Tage ist dadurch nicht möglich."
              : "To understand which content gets read, I use Umami, open-source analytics software that I host myself at analytics.cwcodes.de. Umami sets no cookies and builds no cross-site profiles. It records pages visited, referrer, browser, operating system, device type, screen size, language and approximate country. Your IP address is not stored; it is used only briefly, together with a daily rotating random value, to form an anonymous session identifier, so you cannot be recognised across days."}
          </p>
          <p>
            {de
              ? "Die Daten verlassen meinen Server nicht und werden nicht an Dritte weitergegeben. Rechtsgrundlage ist mein berechtigtes Interesse an einer datensparsamen Reichweitenmessung (Art. 6 Abs. 1 lit. f DSGVO). Du kannst der Erfassung widersprechen, indem du die Do-Not-Track-Einstellung deines Browsers aktivierst oder einen Skript-/Werbeblocker nutzt."
              : "The data never leaves my server and is not shared with third parties. The legal basis is my legitimate interest in privacy-friendly audience measurement (Art. 6(1)(f) GDPR). You can opt out by enabling your browser's Do Not Track setting or using a script or ad blocker."}
          </p>
        </>
      ),
    },
    {
      title: de ? "5. Schriftarten von Fontshare" : "5. Fonts from Fontshare",
      body: (
        <>
          <p>
            {de
              ? "Für die Darstellung der Schriften (Clash Display, General Sans, Gambetta) lädt diese Website Schriftdateien vom Dienst Fontshare der Indian Type Foundry (Ahmedabad, Indien) über die Server api.fontshare.com und cdn.fontshare.com. Dabei überträgt dein Browser technisch bedingt deine IP-Adresse sowie Browserinformationen an diese Server. Dabei kann es zu einer Übermittlung in ein Drittland ohne Angemessenheitsbeschluss der EU-Kommission kommen."
              : "To display its typefaces (Clash Display, General Sans, Gambetta), this website loads font files from the Fontshare service of the Indian Type Foundry (Ahmedabad, India) via the servers api.fontshare.com and cdn.fontshare.com. For technical reasons your browser sends your IP address and browser information to these servers. This may involve a transfer to a third country for which the EU Commission has not issued an adequacy decision."}
          </p>
          <p>
            {de
              ? "Rechtsgrundlage ist mein berechtigtes Interesse an einer einheitlichen, ansprechenden Darstellung (Art. 6 Abs. 1 lit. f DSGVO). Weitere Informationen: "
              : "The legal basis is my legitimate interest in a consistent, appealing presentation (Art. 6(1)(f) GDPR). More information: "}
            <A href="https://www.fontshare.com/terms">fontshare.com/terms</A>.
          </p>
        </>
      ),
    },
    {
      title: de ? "6. Kontaktformular & E-Mail" : "6. Contact form & email",
      body: (
        <>
          <p>
            {de
              ? "Wenn du mir über das Kontaktformular schreibst, verarbeite ich die angegebenen Daten (Name, E-Mail-Adresse, optional Betreff, Nachricht sowie die gewählte Sprache), um deine Anfrage zu beantworten. Du erhältst außerdem eine automatische Eingangsbestätigung an die angegebene Adresse. Gleiches gilt, wenn du mir direkt per E-Mail schreibst."
              : "If you write to me through the contact form, I process the data you provide (name, email address, optional subject, message and the selected language) to answer your enquiry. You also receive an automatic confirmation at the address you entered. The same applies if you email me directly."}
          </p>
          <p>
            {de
              ? "Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, wenn deine Anfrage auf einen Vertrag abzielt, ansonsten mein berechtigtes Interesse an der Beantwortung von Anfragen (Art. 6 Abs. 1 lit. f DSGVO). Die Angaben sind freiwillig; ohne sie kann ich dir jedoch nicht antworten."
              : "The legal basis is Art. 6(1)(b) GDPR where your enquiry relates to a contract, otherwise my legitimate interest in answering enquiries (Art. 6(1)(f) GDPR). Providing the data is voluntary, but I can't reply without it."}
          </p>
          <p>
            {de
              ? "Die E-Mails werden über useSend versendet, das ich selbst auf meinem Server betreibe. useSend stellt die Nachrichten über Amazon Simple Email Service (SES) der Amazon Web Services EMEA SARL, 38 Avenue John F. Kennedy, L-1855 Luxemburg, zu. Ich nutze dafür die AWS-Region "
              : "Emails are sent via useSend, which I run myself on my server. useSend delivers messages through Amazon Simple Email Service (SES), provided by Amazon Web Services EMEA SARL, 38 Avenue John F. Kennedy, L-1855 Luxembourg. I use the AWS region "}
            eu-central-1 (Frankfurt)
            {de
              ? ". Mit AWS besteht ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO. Da AWS einen US-Mutterkonzern hat, ist ein Zugriff aus den USA nicht völlig auszuschließen; AWS ist unter dem EU-US Data Privacy Framework zertifiziert, zusätzlich gelten die EU-Standardvertragsklauseln."
              : ". A data processing agreement under Art. 28 GDPR is in place with AWS. As AWS has a US parent company, access from the US cannot be entirely ruled out; AWS is certified under the EU-US Data Privacy Framework and the EU Standard Contractual Clauses also apply."}
          </p>
          <p>
            {de
              ? "Ich lösche deine Anfrage, sobald sie abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten (z. B. bis zu 6 bzw. 10 Jahre für Geschäftskorrespondenz nach HGB und AO) entgegenstehen."
              : "I delete your enquiry once it has been fully dealt with, unless statutory retention periods apply (e.g. up to 6 or 10 years for business correspondence under German commercial and tax law)."}
          </p>
        </>
      ),
    },
    {
      title: de ? "7. Lokaler Speicher (Spracheinstellung)" : "7. Local storage (language setting)",
      body: (
        <p>
          {de
            ? "Damit die Seite beim nächsten Besuch in deiner gewählten Sprache erscheint, speichere ich die Einstellung („de“ oder „en“) im lokalen Speicher deines Browsers (localStorage, Schlüssel „portfolio-locale“). Dieser Wert wird nicht an mich übertragen und enthält keine personenbezogenen Daten. Die Speicherung ist für die von dir gewünschte Funktion unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Du kannst den Eintrag jederzeit über die Einstellungen deines Browsers löschen."
            : "So the site appears in your chosen language next time, I store that setting (“de” or “en”) in your browser's local storage (localStorage, key “portfolio-locale”). The value is never sent to me and contains no personal data. Storing it is strictly necessary for the function you asked for (§ 25(2) no. 2 TDDDG). You can delete it at any time in your browser settings."}
        </p>
      ),
    },
    {
      title: de ? "8. Links zu anderen Websites" : "8. Links to other websites",
      body: (
        <p>
          {de
            ? "Diese Seite verlinkt auf Kundenprojekte und meine Profile bei GitHub, LinkedIn, Instagram und X. Es handelt sich um einfache Links, nicht um eingebettete Inhalte: Daten werden erst übertragen, wenn du einen Link anklickst. Ab dann gilt die Datenschutzerklärung des jeweiligen Anbieters."
            : "This site links to client projects and my profiles on GitHub, LinkedIn, Instagram and X. These are plain links, not embedded content: no data is transferred until you click one. From then on, that provider's privacy policy applies."}
        </p>
      ),
    },
    {
      title: de ? "9. Deine Rechte" : "9. Your rights",
      body: (
        <>
          <p>
            {de
              ? "Du hast jederzeit das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie das Recht, einer Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO aus Gründen, die sich aus deiner besonderen Situation ergeben, zu widersprechen (Art. 21). Eine formlose E-Mail an "
              : "You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20) and the right to object, on grounds relating to your particular situation, to processing based on Art. 6(1)(f) GDPR (Art. 21). An informal email to "}
            <Mail />
            {de ? " genügt." : " is enough."}
          </p>
          <p>
            {de
              ? "Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), zum Beispiel bei der für mich zuständigen Behörde: Der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit, Ludwig-Erhard-Straße 22, 20459 Hamburg, "
              : "You can also lodge a complaint with a data protection supervisory authority (Art. 77 GDPR), for example the one responsible for me: Der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit, Ludwig-Erhard-Straße 22, 20459 Hamburg, Germany, "}
            <A href="https://datenschutz-hamburg.de">datenschutz-hamburg.de</A>.
          </p>
          <p>
            {de
              ? "Eine automatisierte Entscheidungsfindung oder ein Profiling findet nicht statt."
              : "No automated decision-making or profiling takes place."}
          </p>
        </>
      ),
    },
  ];

  return {
    eyebrow: de ? "Rechtliches" : "Legal",
    title: de ? "Datenschutz" : "Privacy",
    intro: (
      <p className="text-muted">
        {de ? "Stand: " : "Last updated: "}
        {legal.updated[locale]}
        {de ? "" : ". The German version is the legally binding one."}
      </p>
    ),
    sections,
  };
}

export function getLegalDoc(page: LegalPageId, locale: Locale): LegalDoc {
  return page === "imprint" ? imprint(locale) : privacy(locale);
}
