import { Fragment } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "../lib/motion";

/**
 * Generic fade-up that triggers once when scrolled into view.
 */
export function Reveal({
  children,
  delay = 0,
  y = 32,
  className,
  as = "div",
  amount = 0.3,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span" | "li" | "p";
  amount?: number;
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Masked-line reveal. Splits text into lines and animates each up from behind an
 * overflow-hidden mask with a stagger.
 *
 * IMPORTANT: the `whileInView` trigger lives on the OUTER container (which is
 * never transformed). The animated children sit ~110% lower until revealed, so
 * if we observed them directly the IntersectionObserver would see them shifted
 * down and large headings would never cross the visibility threshold — leaving
 * the text stuck inside the mask.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  stagger = 0.1,
  delay = 0,
  amount = 0.35,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
}) {
  return (
    <motion.span
      className={className}
      style={{ display: "block" }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {lines.map((line, i) => (
        <span key={i} className="reveal-line">
          <motion.span
            className={lineClassName}
            style={{ display: "block" }}
            variants={{
              hidden: { y: "110%" },
              show: { y: "0%", transition: { duration: 1, ease: EASE } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/**
 * Word-by-word reveal — great for paragraphs that "type in" as you scroll.
 * Same trigger-on-the-container approach as RevealLines.
 */
export function RevealWords({
  text,
  className,
  stagger = 0.025,
  amount = 0.3,
}: {
  text: string;
  className?: string;
  stagger?: number;
  amount?: number;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "bottom",
              paddingBottom: "0.12em",
              marginBottom: "-0.12em",
            }}
          >
            <motion.span
              style={{ display: "inline-block" }}
              variants={{
                hidden: { y: "110%", opacity: 0 },
                show: { y: "0%", opacity: 1, transition: { duration: 0.8, ease: EASE } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </motion.span>
  );
}
