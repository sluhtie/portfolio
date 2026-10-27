import { useEffect, useRef, useState } from "react";
import { useHasFinePointer, usePrefersReducedMotion } from "../lib/hooks";

/**
 * Custom cursor: a precise dot plus a lagging ring that swells over anything
 * interactive and turns into a label bubble over elements with
 * `data-cursor-label`.
 */
export function Cursor() {
  const fine = useHasFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState<"default" | "hover" | "label" | "text">("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      setVisible(true);
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor-label]");
      if (labelled) {
        setMode("label");
        setLabel(labelled.dataset.cursorLabel || "");
        return;
      }
      if (target?.closest("input, textarea")) {
        setMode("text");
        return;
      }
      if (target?.closest("a, button, [data-cursor], label, select")) setMode("hover");
      else setMode("default");
    };
    const leave = () => setVisible(false);

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className={`cursor-root ${visible ? "is-visible" : ""}`} data-mode={mode}>
      <div ref={ringRef} className="cursor-ring">
        <div className="cursor-ring-inner">
          <span className="cursor-label">{label}</span>
        </div>
      </div>
      <div ref={dotRef} className="cursor-dot">
        <div className="cursor-dot-inner" />
      </div>
    </div>
  );
}
