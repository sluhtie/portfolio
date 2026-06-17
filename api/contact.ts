import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

/**
 * Contact endpoint — sends two emails via Resend:
 *  1. a notification to Connor (reply-to = the sender, so a reply just works)
 *  2. a branded confirmation ("Eingangsbestätigung") back to the sender
 *
 * Required env: RESEND_API_KEY
 * Optional env: CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL
 * The FROM address must be on a domain verified in Resend (cwcodes.de).
 */

const TO = process.env.CONTACT_TO_EMAIL || "connor@cwcodes.de";
const FROM = process.env.CONTACT_FROM_EMAIL || "CWCODES <noreply@cwcodes.de>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BRAND = {
  bg: "#08070a",
  card: "#0e0d12",
  line: "#26252c",
  ink: "#ecebe4",
  muted: "#908d99",
  accent: "#ccff00",
};

function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(s: string): string {
  return esc(s).replace(/\r?\n/g, "<br>");
}

/** Branded dark email shell (table-based for client compatibility). */
function shell(inner: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:${BRAND.bg};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRAND.card};border:1px solid ${BRAND.line};border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <tr><td style="padding:28px 32px 8px 32px;">
          <span style="font-size:20px;font-weight:700;letter-spacing:-0.02em;color:${BRAND.ink};">CWCODES<span style="color:${BRAND.accent};">.</span></span>
        </td></tr>
        ${inner}
        <tr><td style="padding:20px 32px 30px 32px;border-top:1px solid ${BRAND.line};">
          <p style="margin:0;font-size:12px;line-height:1.6;color:${BRAND.muted};">
            Connor Welge · CWCODES · Hamburg<br>
            <a href="mailto:${TO}" style="color:${BRAND.muted};">${TO}</a> · <a href="https://cwcodes.de" style="color:${BRAND.muted};">cwcodes.de</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
  </body></html>`;
}

function row(label: string, valueHtml: string): string {
  return `<tr>
    <td style="padding:6px 0;vertical-align:top;width:96px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.muted};">${label}</td>
    <td style="padding:6px 0;font-size:15px;color:${BRAND.ink};">${valueHtml}</td>
  </tr>`;
}

function notifyHtml(d: { name: string; email: string; subject: string; message: string }): string {
  return shell(`
    <tr><td style="padding:8px 32px 0 32px;">
      <h1 style="margin:8px 0 4px 0;font-size:22px;font-weight:600;color:${BRAND.ink};">Neue Anfrage über cwcodes.de</h1>
      <p style="margin:0 0 18px 0;font-size:14px;color:${BRAND.muted};">Du kannst direkt auf diese E-Mail antworten — sie geht an ${esc(d.name)}.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${row("Name", esc(d.name))}
        ${row("E-Mail", `<a href="mailto:${esc(d.email)}" style="color:${BRAND.accent};text-decoration:none;">${esc(d.email)}</a>`)}
        ${d.subject ? row("Betreff", esc(d.subject)) : ""}
      </table>
      <div style="margin:18px 0 8px 0;padding:16px 18px;background:${BRAND.bg};border:1px solid ${BRAND.line};border-radius:12px;">
        <p style="margin:0;font-size:15px;line-height:1.6;color:${BRAND.ink};">${nl2br(d.message)}</p>
      </div>
    </td></tr>`);
}

function confirmHtml(d: { name: string; message: string; locale: "de" | "en" }): string {
  const t =
    d.locale === "en"
      ? {
          hi: `Hi ${esc(d.name)},`,
          body: "thanks for reaching out — your message arrived safely. I'll get back to you within 1–2 working days.",
          your: "Your message",
          sign: "Talk soon,",
        }
      : {
          hi: `Hallo ${esc(d.name)},`,
          body: "danke für deine Nachricht — sie ist sicher bei mir angekommen. Ich melde mich innerhalb von 1–2 Werktagen bei dir.",
          your: "Deine Nachricht",
          sign: "Bis bald,",
        };
  return shell(`
    <tr><td style="padding:8px 32px 0 32px;">
      <h1 style="margin:8px 0 12px 0;font-size:22px;font-weight:600;color:${BRAND.ink};">${t.hi}</h1>
      <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:${BRAND.ink};">${t.body}</p>
      <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.muted};">${t.your}</p>
      <div style="margin:0 0 18px 0;padding:16px 18px;background:${BRAND.bg};border:1px solid ${BRAND.line};border-radius:12px;">
        <p style="margin:0;font-size:15px;line-height:1.6;color:${BRAND.muted};">${nl2br(d.message)}</p>
      </div>
      <p style="margin:0;font-size:15px;line-height:1.6;color:${BRAND.ink};">${t.sign}<br><strong style="font-weight:600;">Connor</strong></p>
    </td></tr>`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Email service not configured" });
  }

  let body: Record<string, unknown> = {};
  if (typeof req.body === "string") {
    try {
      body = JSON.parse(req.body);
    } catch {
      body = {};
    }
  } else if (req.body && typeof req.body === "object") {
    body = req.body as Record<string, unknown>;
  }

  // Honeypot — bots fill this hidden field. Pretend success, send nothing.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return res.status(200).json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();
  const locale: "de" | "en" = body.locale === "en" ? "en" : "de";

  if (!name || !EMAIL_RE.test(email) || message.length < 5) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const resend = new Resend(apiKey);

  const [notify, confirm] = await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Neue Anfrage über cwcodes.de — ${name}`,
      html: notifyHtml({ name, email, subject, message }),
    }),
    resend.emails.send({
      from: FROM,
      to: email,
      replyTo: TO,
      subject:
        locale === "en"
          ? "Thanks for reaching out – CWCODES"
          : "Danke für deine Nachricht – CWCODES",
      html: confirmHtml({ name, message, locale }),
    }),
  ]);

  // The notification to Connor is the critical one.
  if (notify.status === "rejected" || (notify.value && "error" in notify.value && notify.value.error)) {
    console.error("contact: notification failed", notify);
    return res.status(502).json({ error: "Could not send your message. Please email directly." });
  }
  if (confirm.status === "rejected") {
    console.error("contact: confirmation failed (notification sent)", confirm);
  }

  return res.status(200).json({ ok: true });
}
