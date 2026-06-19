/**
 * Shared contact logic for the Express server (server/index.js).
 * Framework-agnostic: takes a parsed body, returns { status, body }.
 * Sends two emails via useSend (self-hosted Resend alternative).
 *
 * Env: USESEND_API_KEY (required), USESEND_BASE_URL (your self-hosted instance,
 * default https://app.usesend.com), CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL,
 * CONTACT_FROM_NAME
 */

const TO = process.env.CONTACT_TO_EMAIL || "connor@cwcodes.de";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "connor@cwcodes.de";
const FROM_NAME = process.env.CONTACT_FROM_NAME || "CWCODES";
const USESEND_BASE = (process.env.USESEND_BASE_URL || "https://app.usesend.com").replace(/\/+$/, "");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BRAND = {
  bg: "#08070a",
  card: "#0e0d12",
  line: "#26252c",
  ink: "#ecebe4",
  muted: "#908d99",
  accent: "#ccff00",
};

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(s) {
  return esc(s).replace(/\r?\n/g, "<br>");
}

function shell(inner) {
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
            <a href="mailto:${TO}" style="color:${BRAND.muted};">${TO}</a> · <a href="https://www.cwcodes.de" style="color:${BRAND.muted};">cwcodes.de</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
  </body></html>`;
}

function row(label, valueHtml) {
  return `<tr>
    <td style="padding:6px 0;vertical-align:top;width:96px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.muted};">${label}</td>
    <td style="padding:6px 0;font-size:15px;color:${BRAND.ink};">${valueHtml}</td>
  </tr>`;
}

function notifyHtml(d) {
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

function confirmHtml(d) {
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

async function sendUseSend(apiKey, opts) {
  const res = await fetch(`${USESEND_BASE}/api/v1/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: opts.to,
      replyTo: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`useSend ${res.status}: ${detail}`);
  }
}

export async function sendContactEmails(body) {
  const apiKey = process.env.USESEND_API_KEY;
  if (!apiKey) {
    return { status: 500, body: { error: "Email service not configured" } };
  }

  const data = body && typeof body === "object" ? body : {};

  // Honeypot — bots fill this hidden field. Pretend success, send nothing.
  if (typeof data.company === "string" && data.company.trim() !== "") {
    return { status: 200, body: { ok: true } };
  }

  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const subject = String(data.subject ?? "").trim();
  const message = String(data.message ?? "").trim();
  const locale = data.locale === "en" ? "en" : "de";

  if (!name || !EMAIL_RE.test(email) || message.length < 5) {
    return { status: 400, body: { error: "Invalid input" } };
  }

  const [notify, confirm] = await Promise.allSettled([
    sendUseSend(apiKey, {
      to: TO,
      replyTo: email,
      subject: `Neue Anfrage über cwcodes.de — ${name}`,
      html: notifyHtml({ name, email, subject, message }),
    }),
    sendUseSend(apiKey, {
      to: email,
      replyTo: TO,
      subject:
        locale === "en"
          ? "Thanks for reaching out – CWCODES"
          : "Danke für deine Nachricht – CWCODES",
      html: confirmHtml({ name, message, locale }),
    }),
  ]);

  if (notify.status === "rejected") {
    console.error("contact: notification failed", notify.reason);
    return {
      status: 502,
      body: { error: "Could not send your message. Please email directly." },
    };
  }
  if (confirm.status === "rejected") {
    console.error("contact: confirmation failed (notification sent)", confirm.reason);
  }

  return { status: 200, body: { ok: true } };
}
