import { useEffect, useRef } from "react";
import { scrollState, attachInput } from "../lib/pointer";

/**
 * Infinite marquee whose speed and skew react to scroll velocity — scroll
 * down and it races ahead, scroll up and it turns around.
 */
export function VelocityMarquee({
  items,
  baseSpeed = 0.6,
  reverse = false,
  className = "",
  itemClassName = "",
}: {
  items: string[];
  baseSpeed?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    attachInput();
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = 0;
    let dir = reverse ? -1 : 1;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(track);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const v = scrollState.velocity;
      if (Math.abs(v) > 0.5) dir = (v > 0 ? 1 : -1) * (reverse ? -1 : 1);
      const speed = reduced ? 0 : baseSpeed + Math.min(Math.abs(v) * 0.35, 18);
      x -= speed * dir;
      const half = track.scrollWidth / 2;
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      const skew = reduced ? 0 : Math.max(-12, Math.min(12, v * -0.25));
      track.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`;
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [baseSpeed, reverse]);

  const sequence = [...items, ...items, ...items, ...items];

  return (
    <div className={`w-full overflow-hidden ${className}`} aria-hidden="true">
      <div ref={trackRef} className="inline-flex whitespace-nowrap will-change-transform">
        {sequence.map((item, i) => (
          <span key={i} className={`flex items-center ${itemClassName}`}>
            <span className="px-[0.35em]">{item}</span>
            <span className="marquee-orb mx-[0.35em]" />
          </span>
        ))}
      </div>
    </div>
  );
}
