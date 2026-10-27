import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import { profile } from "../i18n/content";
import { attachInput } from "../lib/pointer";
import { buildVCard, shareContact } from "../lib/vcard";
import type { Card3D } from "../gl/Card";

/**
 * A 3D replica of the printed business card. It spins to its back as you
 * scroll past, tilts toward the cursor and flips on click/tap.
 */
export function BusinessCard({ className = "" }: { className?: string }) {
  const { tx, t, locale } = useLang();
  const wrapRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<Card3D | null>(null);
  const [failed, setFailed] = useState(false);
  const [toast, setToast] = useState(false);

  const share = async () => {
    const [city, country] = tx(profile.location).split(",").map((v) => v.trim());
    const result = await shareContact(buildVCard(tx(profile.role), city, country ?? ""));
    if (result !== "cancelled") {
      setToast(true);
      window.setTimeout(() => setToast(false), 2200);
    }
  };
  const flip = () => cardRef.current && (cardRef.current.flipped = !cardRef.current.flipped);

  const copy = {
    name: profile.name,
    location: tx(profile.location),
    role: tx(profile.role),
    email: profile.email,
    site: "cwcodes.de",
    brand: profile.brand,
    phone: profile.phone,
  };
  const copyRef = useRef(copy);
  copyRef.current = copy;

  useEffect(() => {
    attachInput();
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let disposed = false;
    let io: IntersectionObserver | undefined;
    let ro: ResizeObserver | undefined;
    let raf = 0;

    const track = () => {
      const card = cardRef.current;
      if (card) {
        const r = wrap.getBoundingClientRect();
        const vh = window.innerHeight;
        card.progress = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      }
      raf = requestAnimationFrame(track);
    };

    import("../gl/Card")
      .then(async ({ Card3D }) => {
        if (disposed) return;
        let card: Card3D;
        try {
          card = new Card3D(canvas);
        } catch {
          setFailed(true);
          return;
        }
        cardRef.current = card;
        try {
          await Promise.all([
            document.fonts.load('700 120px "Clash Display"'),
            document.fonts.load('500 30px "General Sans"'),
          ]);
        } catch {
          /* draw with fallbacks */
        }
        if (disposed) return;
        card.setCopy(copyRef.current);
        ro = new ResizeObserver(() => card.resize());
        ro.observe(wrap);
        io = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) card.start();
          else card.stop();
        });
        io.observe(wrap);
        raf = requestAnimationFrame(track);
      })
      .catch(() => setFailed(true));

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io?.disconnect();
      ro?.disconnect();
      cardRef.current?.dispose();
      cardRef.current = null;
    };
  }, []);

  // redraw the textures when the language changes
  useEffect(() => {
    cardRef.current?.setCopy(copyRef.current);
  }, [locale]);

  return (
    <div className={`relative flex select-none flex-col ${className}`}>
      <button
        ref={wrapRef}
        type="button"
        data-cursor-label={t.about.cardHint}
        aria-label={`${t.about.cardHint}: ${profile.name}`}
        className="block min-h-0 w-full flex-1 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        onPointerEnter={() => cardRef.current && (cardRef.current.hover = true)}
        onPointerLeave={() => cardRef.current && (cardRef.current.hover = false)}
        onClick={share}
      >
        {failed ? (
          <span className="card-fallback mx-auto flex aspect-[1/1.28] h-full max-w-full rounded-2xl border border-line">
            <span className="font-display text-7xl font-bold text-ink/30">CW</span>
          </span>
        ) : (
          <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
        )}
      </button>

      <div className="mt-3 flex items-center justify-center gap-2">
        <button type="button" onClick={share} data-cursor className="btn-primary !px-4 !py-2 text-xs">
          {t.about.cardHint}
          <span aria-hidden="true">↗</span>
        </button>
        {!failed && (
          <button type="button" onClick={flip} data-cursor className="btn-ghost !px-4 !py-2 text-xs">
            {t.about.cardFlip}
            <span aria-hidden="true">↻</span>
          </button>
        )}
      </div>

      <span
        role="status"
        className={`pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-bg transition-all duration-500 ${
          toast ? "opacity-100" : "-translate-y-2 opacity-0"
        }`}
      >
        {toast ? t.about.cardShared : ""}
      </span>
    </div>
  );
}
