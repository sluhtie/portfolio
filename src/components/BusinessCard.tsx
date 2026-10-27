import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import { profile } from "../i18n/content";
import { attachInput } from "../lib/pointer";
import type { Card3D } from "../gl/Card";

/**
 * A 3D replica of the printed business card. It spins to its back as you
 * scroll past, tilts toward the cursor and flips on click/tap.
 */
export function BusinessCard({ className = "" }: { className?: string }) {
  const { tx, t, locale } = useLang();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<Card3D | null>(null);
  const [failed, setFailed] = useState(false);

  const copy = {
    name: profile.name,
    location: tx(profile.location),
    role: tx(profile.role),
    email: profile.email,
    site: "cwcodes.de",
    brand: profile.brand,
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
    <div
      ref={wrapRef}
      data-cursor
      data-cursor-label={t.about.cardHint}
      className={`relative select-none ${className}`}
      onPointerEnter={() => cardRef.current && (cardRef.current.hover = true)}
      onPointerLeave={() => cardRef.current && (cardRef.current.hover = false)}
      onClick={() => cardRef.current && (cardRef.current.flipped = !cardRef.current.flipped)}
    >
      {failed ? (
        <div className="card-fallback mx-auto aspect-[1/1.28] h-full max-w-full rounded-2xl border border-line">
          <span className="font-display text-7xl font-bold text-ink/30">CW</span>
        </div>
      ) : (
        <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
      )}
      <span className="sr-only">
        {profile.name} — {tx(profile.location)}
      </span>
    </div>
  );
}
