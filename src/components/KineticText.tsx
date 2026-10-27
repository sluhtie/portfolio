import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { EASE } from "../lib/motion";

/**
 * Splits a string into characters that flip up into place (3D, staggered).
 * Controlled by `show` so it can be chained to the preloader.
 */
export function SplitChars({
  text,
  show,
  delay = 0,
  stagger = 0.028,
  className = "",
  charClassName = "",
}: {
  text: string;
  show: boolean;
  delay?: number;
  stagger?: number;
  className?: string;
  charClassName?: string;
}) {
  return (
    <span className={`split-chars ${className}`}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) => (
        <span key={`${ch}-${i}`} aria-hidden="true" className="split-char-mask">
          <motion.span
            className={`split-char ${charClassName}`}
            initial={{ y: "110%", rotateX: -80, opacity: 0 }}
            animate={show ? { y: "0%", rotateX: 0, opacity: 1 } : { y: "110%", rotateX: -80, opacity: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function ScrubWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = Math.min(1, start + 1.5 / total);
  const opacity = useTransform(progress, [start, end], [0.14, 1]);
  const blur = useTransform(progress, [start, end], ["blur(6px)", "blur(0px)"]);
  return (
    <motion.span style={{ opacity, filter: blur }} className="inline-block will-change-[opacity]">
      {word}
    </motion.span>
  );
}

/** Words light up one by one as the block scrolls through the viewport. */
export function ScrubWords({
  text,
  className = "",
  highlight = [],
}: {
  text: string;
  className?: string;
  /** words (lowercased, punctuation-free) to render in the gradient */
  highlight?: string[];
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => {
        const key = w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
        const hl = highlight.includes(key);
        return (
          <span key={i} className={hl ? "scrub-hl" : undefined}>
            <ScrubWord word={w} index={i} total={words.length} progress={scrollYProgress} />
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
}

const GLYPHS = "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Text that scrambles through glyphs and resolves, on hover or on mount. */
export function Scramble({
  text,
  trigger = "hover",
  className = "",
}: {
  text: string;
  trigger?: "hover" | "mount";
  className?: string;
}) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const run = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(raf.current);
    let frame = 0;
    const total = text.length * 2.2 + 8;
    const step = () => {
      frame++;
      const resolved = Math.floor((frame / total) * text.length);
      setOut(
        Array.from(text)
          .map((ch, i) =>
            i < resolved || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join("")
      );
      if (frame < total) raf.current = requestAnimationFrame(step);
      else setOut(text);
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    setOut(text);
    if (trigger === "mount") run();
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span
      className={className}
      onMouseEnter={trigger === "hover" ? run : undefined}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}

/** Parallax wrapper: moves children at a different speed than the scroll. */
export function Parallax({
  children,
  speed = 0.2,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
