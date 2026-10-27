import { useEffect, useRef, useState } from "react";
import { attachInput } from "../lib/pointer";
import type { World } from "../gl/World";

/** WebGL with a real GPU behind it. Software renderers (SwiftShader, llvmpipe)
 *  would run the shaders on the CPU and stall the main thread for seconds, so
 *  those get the static CSS glow instead. */
function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software/i.test(renderer);
  } catch {
    return false;
  }
}

/**
 * Fixed, page-wide WebGL backdrop. Falls back to a static CSS rendition of the
 * business-card glow when WebGL isn't available.
 */
export function WebGLWorld({ ready }: { ready: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<World | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    attachInput();
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!canvasRef.current || saveData || !hasWebGL()) {
      setFallback(true);
      return;
    }

    let disposed = false;
    let ro: ResizeObserver | undefined;

    // three.js is the heaviest dependency — load it off the critical path, once
    // the main thread is idle, so it never competes with the first paint.
    const load = () =>
      import("../gl/World")
        .then(({ World }) => {
          if (disposed || !canvasRef.current) return;
          const world = new World(canvasRef.current);
          worldRef.current = world;
          world.start();
          ro = new ResizeObserver(() => world.measure());
          ro.observe(document.body);
        })
        .catch(() => setFallback(true));
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 1200 })
      : window.setTimeout(load, 300);

    return () => {
      disposed = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      ro?.disconnect();
      worldRef.current?.dispose();
      worldRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    // The world may still be loading; retry briefly until it exists.
    let tries = 0;
    const id = window.setInterval(() => {
      if (worldRef.current) {
        worldRef.current.setIntro(1);
        worldRef.current.measure();
        window.clearInterval(id);
      } else if (++tries > 40) window.clearInterval(id);
    }, 50);
    return () => window.clearInterval(id);
  }, [ready]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="world-fallback absolute inset-0" />
      {!fallback && <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />}
    </div>
  );
}
