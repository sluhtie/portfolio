import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { profile } from "../i18n/content";
import { EASE } from "../lib/motion";

/**
 * Posts to `/api/contact`, handled by the Express server (server/index.js), which
 * sends a branded notification to Connor and a confirmation back to the sender
 * via useSend. Set to "" to fall back to a mailto: link (e.g. for local
 * `npm run dev`, where only Vite runs and the API isn't available).
 */
const FORM_ENDPOINT = "/api/contact";

type Status = "idle" | "submitting" | "success" | "error";
type Values = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const { t, locale } = useLang();
  const f = t.contact.form;

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [honey, setHoney] = useState(""); // spam honeypot

  const update =
    (key: keyof Values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = f.errRequired;
    if (!values.email.trim()) next.email = f.errRequired;
    else if (!EMAIL_RE.test(values.email)) next.email = f.errEmail;
    if (values.message.trim().length < 5) next.message = f.errMessage;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honey) return; // bot
    if (!validate()) return;
    setStatus("submitting");

    // No endpoint configured → graceful mailto fallback.
    if (!FORM_ENDPOINT) {
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
        values.subject || "Portfolio"
      )}&body=${encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`)}`;
      setStatus("success");
      return;
    }

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message,
          locale,
          company: honey,
        }),
      });
      if (res.ok) {
        setStatus("success");
        setValues({ name: "", email: "", subject: "", message: "" });
        window.umami?.track("contact-submit");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full rounded-xl border bg-bg-soft/60 px-4 py-3.5 text-ink outline-none transition-colors duration-300 placeholder:text-muted/50 focus:border-accent";

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex min-h-[420px] flex-col items-start justify-center rounded-2xl border border-line bg-bg-soft/40 p-8"
          >
            <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h3 className="font-display text-2xl font-semibold">{f.successTitle}</h3>
            <p className="mt-2 max-w-sm text-muted">{f.successBody}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-5"
          >
            {/* honeypot — hidden from users */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honey}
              onChange={(e) => setHoney(e.target.value)}
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              aria-hidden
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label={f.name} error={errors.name} htmlFor="cf-name">
                <input
                  id="cf-name"
                  type="text"
                  value={values.name}
                  onChange={update("name")}
                  placeholder={f.namePlaceholder}
                  aria-invalid={!!errors.name}
                  className={`${inputBase} ${errors.name ? "border-rose" : "border-line"}`}
                />
              </Field>
              <Field label={f.email} error={errors.email} htmlFor="cf-email">
                <input
                  id="cf-email"
                  type="email"
                  value={values.email}
                  onChange={update("email")}
                  placeholder={f.emailPlaceholder}
                  aria-invalid={!!errors.email}
                  className={`${inputBase} ${errors.email ? "border-rose" : "border-line"}`}
                />
              </Field>
            </div>

            <Field label={f.subject} htmlFor="cf-subject">
              <input
                id="cf-subject"
                type="text"
                value={values.subject}
                onChange={update("subject")}
                placeholder={f.subjectPlaceholder}
                className={`${inputBase} border-line`}
              />
            </Field>

            <Field label={f.message} error={errors.message} htmlFor="cf-message">
              <textarea
                id="cf-message"
                rows={5}
                value={values.message}
                onChange={update("message")}
                placeholder={f.messagePlaceholder}
                aria-invalid={!!errors.message}
                className={`${inputBase} resize-none ${errors.message ? "border-rose" : "border-line"}`}
              />
            </Field>

            {status === "error" && (
              <p className="text-sm text-rose">
                {f.errorTitle} {f.errorBody}{" "}
                <a href={`mailto:${profile.email}`} className="link-underline text-ink">
                  {profile.email}
                </a>
                .
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary mt-1 w-full justify-center !py-4 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? f.sending : f.submit}
              {status !== "submitting" && <span>→</span>}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-2">
      <span className="eyebrow">{label}</span>
      {children}
      {error && <span className="text-xs text-rose">{error}</span>}
    </label>
  );
}
