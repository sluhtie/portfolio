import { profile } from "../i18n/content";

const esc = (v: string) => v.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");

/** vCard 3.0 for Connor — understood by iOS, Android, macOS and Outlook. */
export function buildVCard(role: string, city: string, country: string) {
  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(last)};${esc(first)};;;`,
    `FN:${esc(profile.name)}`,
    `ORG:${esc(profile.brand)}`,
    `TITLE:${esc(role)}`,
    `EMAIL;TYPE=INTERNET,WORK:${profile.email}`,
    profile.phone ? `TEL;TYPE=CELL:${profile.phone.replace(/\s+/g, "")}` : "",
    `URL:${profile.website}`,
    `ADR;TYPE=WORK:;;;${esc(city)};;;${esc(country)}`,
    ...profile.socials.map((s) => `X-SOCIALPROFILE;TYPE=${s.label.toLowerCase()}:${s.href}`),
    "END:VCARD",
  ].filter(Boolean);
  return lines.join("\r\n") + "\r\n";
}

/**
 * Share the contact card: native share sheet with the .vcf where supported
 * (iOS/Android), otherwise a plain download that opens in Contacts.
 */
export async function shareContact(vcard: string): Promise<"shared" | "downloaded" | "cancelled"> {
  const filename = `${profile.name.replace(/\s+/g, "-")}.vcf`;
  const file = new File([vcard], filename, { type: "text/vcard" });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: profile.name });
      return "shared";
    } catch (e) {
      if ((e as DOMException)?.name === "AbortError") return "cancelled";
      // fall through to download
    }
  }

  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  return "downloaded";
}
