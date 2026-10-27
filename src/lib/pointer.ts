/**
 * Shared, allocation-free input state read by WebGL scenes and motion
 * components every frame. Listeners are attached once, lazily.
 */
export const pointer = {
  /** normalized -1..1, y up */
  x: 0,
  y: 0,
  /** raw client px */
  cx: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
  cy: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  /** smoothed pointer speed, roughly 0..1 */
  speed: 0,
  active: false,
};

export const scrollState = {
  y: 0,
  /** px per frame, smoothed and signed */
  velocity: 0,
};

let attached = false;

export function attachInput() {
  if (attached || typeof window === "undefined") return;
  attached = true;

  let lastX = pointer.cx;
  let lastY = pointer.cy;
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.cx = e.clientX;
      pointer.cy = e.clientY;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      const d = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      pointer.speed = Math.min(1, pointer.speed + d / 600);
      lastX = e.clientX;
      lastY = e.clientY;
      pointer.active = true;
    },
    { passive: true }
  );

  let lastScroll = window.scrollY;
  scrollState.y = lastScroll;
  const tick = () => {
    const y = window.scrollY;
    const v = y - lastScroll;
    lastScroll = y;
    scrollState.y = y;
    scrollState.velocity += (v - scrollState.velocity) * 0.18;
    pointer.speed *= 0.94;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
